import Link from "next/link";

export default function Home() {

    function sendLoginEmail(event: any) {
        event.preventDefault()
        console.log(event.target[0].value)
    }

    return (
        <div>
            <Link href={"beeper/email"}>Log in</Link>
        </div>
    )
}
