import {useState} from "react";

export default function BeeperLogin({ setBeeperToken }: any) {

    const [sentCode, setSentCode] = useState(false)
    const [loginIdentifier, setLoginIdentifier] = useState("")

    async function sendLoginEmail(event: any) {
        event.preventDefault();

        const email = event.target[0].value;

        const loginResponse = await fetch("https://api.beeper.com/user/login", {
            method: "POST",
            headers: {
                Authorization: "Bearer BEEPER-PRIVATE-API-PLEASE-DONT-USE",
            },
        });
        const {request} = await loginResponse.json();

        await fetch("https://api.beeper.com/user/login/email", {
            method: "POST",
            headers: {
                Authorization: "Bearer BEEPER-PRIVATE-API-PLEASE-DONT-USE",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({request, email}),
        });

        setSentCode(true);
        setLoginIdentifier(request);
    }

    async function getToken(event: any) {
        event.preventDefault()

        const code = event.target[0].value;

        const loginChallengeResponse = await fetch(
            "https://api.beeper.com/user/login/response",
            {
                method: "POST",
                headers: {
                    Authorization: "Bearer BEEPER-PRIVATE-API-PLEASE-DONT-USE",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ request: loginIdentifier, response: code }),
            }
        );
        const { token } = await loginChallengeResponse.json();

        const accessTokenResponse = await fetch(
            "https://matrix.beeper.com/_matrix/client/v3/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    type: "org.matrix.login.jwt",
                    initial_device_display_name: "Beeper Bridge Self-Host",
                    token: token
                })
            }
        )

        const { access_token } = await accessTokenResponse.json();

        setBeeperToken(access_token);
        window.localStorage.setItem("beeperToken", access_token)
    }

    return (
        <div className="m-20">
            <p className="text-center text-4xl font-bold">Sign in to Beeper</p>
            <p className="text-center mt-5">This will be used to connect your self-hosted bridge to your Beeper account. Your credentials will be passed directly to Fly.</p>
            { sentCode ? (
                <div className="mx-auto w-72 mt-16">
                    <p>{"We've emailed you a login code."}</p>
                    <form className="mt-2" onSubmit={getToken}>
                        <p>Enter it here:</p>
                        <input className="p-2 border-2 rounded-md w-full" name="code" type="number" />
                    </form>
                </div>
                ) : (
                <div className="mx-auto w-72 mt-16">
                    <form onSubmit={sendLoginEmail}>
                        <p>Email:</p>
                        <input className="p-2 border-2 rounded-md w-full" name="email" type="email" />
                    </form>
                </div>
            )}
        </div>
    )
}