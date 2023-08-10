import {useState} from "react";

export default function BeeperLogin({ setBeeperToken }) {

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
    }

    return (
        <>
            { sentCode ? (
                <div>
                    <p>We sent you a login code.</p>
                    <form onSubmit={getToken}>
                        <p>Enter your code:</p>
                        <input name="code" type="number" />
                    </form>
                </div>
                ) : (
                <div>
                    <form onSubmit={sendLoginEmail}>
                        <p>Email:</p>
                        <input name="email" type="email" />
                    </form>
                </div>
            )}
        </>
    )
}