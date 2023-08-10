export default function FlyLogin({setFlyToken}) {

    function handleSubmit(event: any) {
        event.preventDefault();

        setFlyToken(event.target[0].value);
    }
    return (
        <>
            <p>Generate a fly.io auth token in the <a href={"https://fly.io/user/personal_access_tokens"}>personal access tokens section of the dashboard.</a></p>
            <p>Your fly.io token:</p>
            <form onSubmit={handleSubmit}>
                <input type={"password"} />
            </form>
        </>
    )
}