import {NextResponse} from 'next/server'

export async function DELETE(req: Request) {
    const {beeperToken, flyToken, name, onFly} = await req.json()

    if (onFly) {
        const fly_delete = await fetch(`https://api.machines.dev/v1/apps/${name}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${flyToken}`,
                'Content-Type': 'application/json',
            },
        })

        if (fly_delete.status != 202) {
            const fly_delete_data = await fly_delete.json();
            return NextResponse.json({ error: JSON.stringify(fly_delete_data) }, { status: 500 })
        }
    }

    const beeper_delete = await fetch(`https://api.beeper.com/bridge/${name}`, {
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${beeperToken}`,
            'Content-Type': 'application/json',
        },
    })

    // Wait for the app to delete before returning.
    let beeper_bridges: string[] = [name]
    while (beeper_bridges.includes(name)) {
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
        beeper_bridges = Object.keys(beeper_bridge_response.user.bridges);

        await new Promise(r => setTimeout(r, 1000));
    }

    return NextResponse.json({})
}