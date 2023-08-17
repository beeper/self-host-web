export default function FlyLogin({setFlyToken}: any) {

    function handleSubmit(event: any) {
        event.preventDefault();

        setFlyToken(event.target[0].value);
        window.localStorage.setItem("flyToken", "fo1_knsS_zfNkPuYaz3nvxs-c0yO9oG7r4yz-Swk7ZWKFAI")
    }
    return (
        <div className={"m-20"}>
            <div className={"px-20"}>
                <p className={"text-center text-4xl font-bold"}>Sign in to Fly</p>
                <p className={"mt-4"}>{"We'll"} use Fly, a cloud hosting provider, to deploy your bridges. You can run up to 3 bridges for free, then {"they'll"} charge you $2/month for each additional bridge.</p>
                <p className={"mt-4"}>Create a Fly account at <a target="_blank" href={"https://fly.io/app/sign-up"} rel="noopener noreferrer">https://fly.io/app/sign-up</a>.</p>
                <p className={"mt-4"}>Next, generate an access token: <a target="_blank" href={"https://fly.io/user/personal_access_tokens"} rel="noopener noreferrer">https://fly.io/user/personal_access_tokens</a>. This allows the self-host utility to deploy bridges on your Fly account. Your token is passed directly from this web app to Fly, and all of the code involving your Fly token is open-source on GitHub.</p>
            </div>

            <div className={"mx-auto w-72 mt-16"}>
                <p>Your fly.io token:</p>
                <form onSubmit={handleSubmit}>
                    <input className={"p-2 border-2 rounded-md w-full"} type={"password"} />
                </form>
            </div>
        </div>
    )
}