import {NextResponse} from 'next/server'
import {gql, GraphQLClient} from 'graphql-request'

export async function POST(req: Request) {
    const {beeperToken, flyToken} = await req.json()

    const beeper_whoami = await fetch('https://api.beeper.com/whoami', {
        headers: {
            'Authorization': `Bearer ${beeperToken}`,
            'Content-Type': 'application/json',
        },
    })

    if (beeper_whoami.status != 200) {
        const beeper_bridge_data = await beeper_whoami.json();
        return NextResponse.json({ error: JSON.stringify(beeper_bridge_data) }, { status: 500 })
    }

    const beeper_bridge_response = await beeper_whoami.json();
    const beeper_bridges = Object.keys(beeper_bridge_response.user.bridges);

    const graphQLClient = new GraphQLClient('https://api.fly.io/graphql', {
        headers: {
            authorization: `Bearer ${flyToken}`,
        },
    })

    const fly_bridge_query = gql`
        query PersonalOrganization {
            personalOrganization {
                apps {
                    nodes {
                        id
                    }
                }
            }
        }
    `

    try {
        const fly_bridge_response: any = await graphQLClient.request(fly_bridge_query)

        const fly_bridges_json = fly_bridge_response.personalOrganization.apps.nodes;
        const fly_bridges = fly_bridges_json.map((bridge: any) => bridge.id)

        const bridges: { id: string, onFly: boolean }[] = []
        beeper_bridges.forEach((bridge: any) => {
            if (bridge.startsWith("sh-")) {

                const deployedOnFly = fly_bridges.includes(bridge)

                bridges.push({
                    id: bridge,
                    onFly: deployedOnFly
                })
            }
        })

        return NextResponse.json({"bridges": bridges})
    } catch (error: any) {
        return NextResponse.json({ error: JSON.stringify(error.response.errors[0].message) }, { status: 500 })
    }
}