import {NextResponse} from 'next/server'
import {gql, GraphQLClient} from 'graphql-request'

export async function POST(req: Request) {

    const {beeperToken, flyToken, bridge} = await req.json()
    const app_name = `sh-${bridge}-${Date.now()}`

    console.log("Received request")

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
        const create_app_data = await res_create_app.json();
        return NextResponse.json({ error: JSON.stringify(create_app_data) }, { status: 500 })
    }
    console.log("Successfully created app")

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
            "region": "iad"
        }
    }
    const ip_request_data: any = await graphQLClient.request(ip_query, ip_variables)

    if (!ip_request_data.allocateIpAddress?.app?.sharedIpAddress) {
        return NextResponse.json({ error: JSON.stringify(ip_request_data) }, { status: 500 })
    }

    console.log("Allocated IP")

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

    const secrets_request_data: any = await graphQLClient.request(secrets_query, secrets_variables)

    if (!secrets_request_data?.setSecrets?.hasOwnProperty('release')) {
        return NextResponse.json({ error: JSON.stringify(secrets_request_data) }, { status: 500 })
    }

    console.log("Created secrets")

    // Create machine

    const res_create_machine = await fetch(`https://api.machines.dev/v1/apps/${app_name}/machines`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${flyToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "region": "iad",
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

    if (res_create_machine.status != 200) {
        const create_machine_data = await res_create_machine.json()
        return NextResponse.json({ error: JSON.stringify(create_machine_data) }, { status: 500 })
    }
    console.log("Created machine")

    return NextResponse.json({"appName": app_name})
}