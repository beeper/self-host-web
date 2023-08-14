import {useState} from "react";

export default function Deployment({ beeperToken, flyToken}: any) {

    const [deployed, setDeployed] = useState(false)
    const [deployInProgress, setDeployInProgress] = useState(false)
    const [appId, setAppId] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    async function deploy(event: any) {
        event.preventDefault()

        const bridge = event.target.bridge.value
        setDeployInProgress(true)

        const res = await fetch("/api/deploy", {
            method: 'POST',
            body: JSON.stringify({ beeperToken: beeperToken, flyToken: flyToken, bridge: bridge})
        })

        if (res.status === 500) {
            const error_data = await res.json();
            setErrorMessage(error_data.error);
            return;
        }

        const { appName } = await res.json();

        setAppId(appName);
        setDeployed(true)
        setDeployInProgress(false)
    }

    return (
        <>
            { !deployed && !deployInProgress &&
                <>
                    <p>Select the chat network you would like to self-host</p>
                    <form onSubmit={deploy}>
                        <fieldset>
                            <div>
                                <input type={"radio"} name={"bridge"} value={"whatsapp"} defaultChecked />
                                <label>WhatsApp</label>
                            </div>
                            <div>
                                <input type={"radio"} name={"bridge"} value={"gmessages"} />
                                <label>Google Messages</label>
                            </div>
                            <button type={"submit"}>Deploy</button>
                        </fieldset>
                    </form>
                </> }

            { deployInProgress && <p>Deploying...</p>}

            { deployed &&
                <>
                    <p>Deployed!</p>
                    <a href={`https://fly.io/apps/${appId}/monitoring`}>View logs of your app</a>
                    <p>{`In Beeper, send a message to @${appId}bot:beeper.local`}</p>
                </>
            }

            { errorMessage }
        </>
    )
}
