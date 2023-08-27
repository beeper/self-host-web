import {useState} from "react";

export default function BridgeDeploy({beeperToken, flyToken, onCreate}: any) {

    const [deployInProgress, setDeployInProgress] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const regions: Record<string, string> = {
        ams: 'Amsterdam, Netherlands',
        arn: 'Stockholm, Sweden',
        atl: 'Atlanta, Georgia (US)',
        bog: 'Bogotá, Colombia',
        bos: 'Boston, Massachusetts (US)',
        cdg: 'Paris, France',
        den: 'Denver, Colorado (US)',
        dfw: 'Dallas, Texas (US)',
        ewr: 'Secaucus, NJ (US)',
        eze: 'Ezeiza, Argentina',
        gdl: 'Guadalajara, Mexico',
        gig: 'Rio de Janeiro, Brazil',
        gru: 'Sao Paulo, Brazil',
        hkg: 'Hong Kong, Hong Kong',
        iad: 'Ashburn, Virginia (US)',
        jnb: 'Johannesburg, South Africa',
        lax: 'Los Angeles, California (US)',
        lhr: 'London, United Kingdom',
        mad: 'Madrid, Spain',
        mia: 'Miami, Florida (US)',
        nrt: 'Tokyo, Japan',
        ord: 'Chicago, Illinois (US)',
        otp: 'Bucharest, Romania',
        phx: 'Phoenix, Arizona (US)',
        qro: 'Querétaro, Mexico',
        scl: 'Santiago, Chile',
        sea: 'Seattle, Washington (US)',
        sin: 'Singapore, Singapore',
        sjc: 'San Jose, California (US)',
        syd: 'Sydney, Australia',
        waw: 'Warsaw, Poland',
        yul: 'Montreal, Canada',
        yyz: 'Toronto, Canada'
    };

    const bridges: Record<string, string> = {
        whatsapp: "WhatsApp",
        gmessages: "Google Messages",
        instagram: "Instagram",
        discord: "Discord",
        slack: "Slack",
        telegram: "Telegram",
        twitter: "Twitter",
        heisenbridge: "Heisenbridge",
        facebook: "Facebook",
        instagram: "Instagram",
        imessage: "iMessage"
    }


    async function deploy(event: any) {
        event.preventDefault();

        setDeployInProgress(true)

        const res = await fetch("/api/deploy", {
            method: 'POST',
            body: JSON.stringify({
                beeperToken: beeperToken,
                flyToken: flyToken,
                bridge: event.target.bridge.value,
                region: event.target.region.value
            })
        })

        if (res.status === 500) {
            const error_data = await res.json();
            setErrorMessage(error_data.error);
            return;
        }

        setDeployInProgress(false)
        onCreate();
    }

    return (
        <div className="m-20">
            <p className="text-center text-2xl font-bold">Deploy a new bridge</p>
            <form onSubmit={deploy} className="text-center">
                <select className="border-2 p-2 m-2" name="bridge" defaultValue="whatsapp">
                    {Object.keys(bridges).map((bridge) => (
                        <option key={bridge} value={bridge}>{bridges[bridge]}</option>
                    ))}
                </select>
                <select className="border-2 p-2 m-2" name="region" defaultValue="iad">
                    {Object.keys(regions).map((region) => (
                        <option key={region} value={region}>{regions[region]}</option>
                    ))}
                </select>
                {!deployInProgress ? <button
                        className="p-2 rounded-md m-4 bg-purple-600 border-0 text-white hover:bg-purple-500">Deploy</button> :
                    <button className="p-2 rounded-md m-4 bg-purple-300 border-0 text-white"
                            disabled={true}>Deploying...</button>}
                {errorMessage}
            </form>
        </div>
    )

}
