import Bridge from "./Bridge";
import BridgeDeploy from "./BridgeDeploy";
import {useEffect, useState} from "react";

export default function Console({ beeperToken, flyToken }: any) {

    const [bridges, setBridges] = useState<any>([])
    const [bridgeDeleted, setBridgeDeleted] = useState(false);
    const [bridgeCreated, setBridgeCreated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    function signOut() {
        window.localStorage.clear()
        location.reload();
    }

    function handleBridgeDelete() {
        setBridgeDeleted(!bridgeDeleted);
    }
    function handleBridgeCreate() {
        setBridgeCreated(!bridgeCreated);
    }

    useEffect(() => {
        async function fetchBridges() {
            setLoading(true);
            const res = await fetch(`/api/bridges`, {
                method: 'POST',
                body: JSON.stringify({beeperToken: beeperToken, flyToken: flyToken})
            })

            if (res.status === 500) {
                console.log(res)

                const error_data = await res.json();
                setLoading(false);
                setError(error_data.error);
                return;
            }

            const bridge_response = await res.json();

            setBridges(bridge_response.bridges);
            setLoading(false);
        }

        fetchBridges();
    }, [bridgeDeleted, bridgeCreated]);

    return (
        <div className={"m-20"}>
            <p className={"max-w-3xl mx-auto"}>Press {"\"Deploy\""} to deploy a bridge. Then, in Beeper Desktop, send a message to the bridge bot. You may need to wait a minute for the bridge to initialize before being able to message the bot.</p>
            <p className={"max-w-3xl mx-auto mt-4"}>To experiment with bridges, check out <a target="_blank" href={"https://github.com/beeper/bridge-manager"} rel="noopener noreferrer">https://github.com/beeper/bridge-manager</a>. {"You'll"} also need it to remove bridges from your Beeper account, in addition to deleting the app on Fly.</p>
            <BridgeDeploy beeperToken={beeperToken} flyToken={flyToken} onCreate={handleBridgeCreate} />
            <p className="text-center m-10">{ error }</p>
            { loading
                ? <p className="text-center">Loading...</p>
                : (
                    bridges?.length ? (
                        <>
                            <table className={"table-auto mx-auto mt-10"}>
                                <thead>
                                <tr>
                                    <th className={"border py-2 px-8"}>Name</th>
                                    <th className={"border py-2 px-8"}>Bridge Bot ID</th>
                                    <th className={"border py-2 px-8"}>Console</th>
                                    <th className={"border py-2 px-8"}>Delete</th>
                                </tr>
                                </thead>
                                <tbody>
                                { bridges.map((bridge: {id: string, onFly: string}) => (
                                    <Bridge key={bridge.id} name={bridge.id} onFly={bridge.onFly} beeperToken={beeperToken} flyToken={flyToken} onDelete={handleBridgeDelete} />
                                )) }
                                </tbody>
                            </table>
                        </>
                    ) : <p className="text-center">You have no self-hosted bridges.</p>
            )}


            <div className={"text-center"}>
                <button className={"p-2 rounded-md mt-20 border-2 hover:bg-gray-50"} onClick={signOut}>Sign Out</button>
            </div>
        </div>
    )
}