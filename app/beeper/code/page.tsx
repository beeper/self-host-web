export async function getToken(event: any) {
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
            body: JSON.stringify({ request, response: code }),
        }
    );
    const { token } = await loginChallengeResponse.json();

    console.log("Your JWT Token: ", token);
}

export default function Code() {
    return (
        <>
            <p>We sent you a login code.</p>
            <form onSubmit={getToken}>
                <p>Enter your code:</p>
                <input name={"thing"}/>
            </form>
        </>
    )
}