import {useState} from "react";

export default function Bridge({name, value, beeperToken, flyToken}: any) {

    const [deployed, setDeployed] = useState(false)
    const [deployInProgress, setDeployInProgress] = useState(false)
    const [appId, setAppId] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    async function deploy() {
        setDeployInProgress(true)

        const res = await fetch("/api/deploy", {
            method: 'POST',
            body: JSON.stringify({beeperToken: beeperToken, flyToken: flyToken, bridge: value})
        })

        if (res.status === 500) {
            const error_data = await res.json();
            setErrorMessage(error_data.error);
            return;
        }

        const {appName} = await res.json();

        setAppId(appName);
        setDeployed(true)
        setDeployInProgress(false)
    }


    return (
        <tr>
            <td className={"border p-2"}>
                <p className={"p-2"}>{name}</p>
            </td>
            <td className={"border p-2"}>
                {!deployInProgress ? <button className={"p-2 rounded-md m-4 bg-purple-600 border-0 text-white hover:bg-purple-500"} onClick={deploy}>Deploy</button> :
                    <button className={"p-2 rounded-md m-4 bg-purple-300 border-0 text-white"} disabled={true}>Deploying...</button>}
            </td>
            <td className={"border p-2"}>
                { deployed && <a href={`https://fly.io/apps/${appId}/monitoring`}>Machine</a> }
                { errorMessage }
            </td>

            <td className={"border p-2"}>
                { deployed && <p>{`@${appId}bot:beeper.local`}</p> }
            </td>

        </tr>
    )
}