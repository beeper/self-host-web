import {NextResponse} from 'next/server'
import {gql, GraphQLClient} from 'graphql-request'

export async function POST(req: Request) {

    const {beeperToken, flyToken, bridge} = await req.json()
    const app_name = `sh-${bridge}-${Date.now()}`

    // Create the app

    const res_create_app = await fetch('https://api.machines.dev/v1/apps', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${flyToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({app_name: app_name, org_slug: 'personal'})
    })

    if (res_create_app.status != 201) {
        return
    }

    // Allocate shared IPv4

    const graphQLClient = new GraphQLClient('https://api.fly.io/graphql', {
        headers: {
            authorization: `Bearer ${flyToken}`,
        },
    })

    const ip_query = gql`
        mutation($input: AllocateIPAddressInput!) {
            allocateIpAddress(input: $input) {
                app {
                    sharedIpAddress
                }
            }
        }
    `

    const ip_variables = {
        "input": {
            "appId": app_name,
            "type": "shared_v4",
            "region": "bos"
        }
    }
    const ip_request_data = await graphQLClient.request(ip_query, ip_variables)

    // Set secrets

    const secrets_query = gql`
        mutation($input: SetSecretsInput!) {
        setSecrets(input: $input) {
            release {
                id
                version
                reason
                description
                user {
                    id
                    email
                    name
                }
                evaluationId
                createdAt
            }
        }
    }`

    const secrets_variables = {
        "input": {
            "appId": app_name,
            "secrets": [
                {"key": "MATRIX_ACCESS_TOKEN", "value": beeperToken},
                {"key": "BRIDGE_NAME", "value": app_name}
            ]
        }
    }

    const secrets_request_data = await graphQLClient.request(secrets_query, secrets_variables)

    // Create machine

    const res_create_machine = await fetch(`https://api.machines.dev/v1/apps/${app_name}/machines`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${flyToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "config": {
                "image": "griffinli/bridge-manager",
                "env": {
                    "APP_ENV": "production"
                },
                "services": [
                    {
                    "ports": [
                        {
                            "port": 443,
                            "handlers": [
                                "tls",
                                "http"
                            ]
                        },
                        {
                            "port": 80,
                            "handlers": [
                                "http"
                            ]
                        }
                    ],
                    "protocol": "tcp",
                    "internal_port": 8080
                    }
                ],
                // "checks": {
                //     "httpget": {
                //         "type": "http",
                //         "port": 8080,
                //         "method": "GET",
                //         "path": "/",
                //         "interval": "15s",
                //         "timeout": "10s"
                //     }
                // }
            }
        })
    })

    // const create_machine_data = await res_create_machine.json()
    // console.log(create_machine_data)

    return NextResponse.json({"appName": app_name})
}