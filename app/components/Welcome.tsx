import Image from "next/image";

export default function Welcome({ setSeenWelcome }: any) {

    function acceptWelcome() {
        setSeenWelcome(true);
    }
    return (
        <div className={"m-20"}>
            <Image
                src={"/beeper_icon.svg"}
                alt={"Beeper Logo"}
                width={100}
                height={100}
                className={"mx-auto"}
            />
            <p className={"text-center text-4xl font-bold mt-5"}>Easy self-hosted bridges.</p>

            <div className={"px-20"}>
                <p className={"mt-10"}>Use this web app to self-host bridges on your <a href={"https://fly.io/"}>fly.io</a> account. Simply sign into Beeper and Fly, and this web app will run the bridge on your Fly account and install it in Beeper.</p>
                <p className={"mt-5"}>This site is open-source at <a href={"https://github.com/beeper/bridge-deployer"}>https://github.com/beeper/bridge-deployer</a>. This webpage is being auto-deployed, however, you can run it from the GitHub if you prefer. Just follow the instructions in the README.</p>
            </div>

            <div className={"text-center mt-10"}>
                <button onClick={acceptWelcome} className={"border-0 bg-purple-600 text-white p-4 rounded-md hover:bg-purple-500"}>Continue</button>
            </div>
        </div>
    )
}