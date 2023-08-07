"use client"

import { useRouter } from 'next/navigation'

export default function Email() {

    const router = useRouter()

    async function sendLoginEmail(event: any) {
        event.preventDefault();

        const email = event.target[0].value;

        const loginResponse = await fetch("https://api.beeper.com/user/login", {
            method: "POST",
            headers: {
                Authorization: "Bearer BEEPER-PRIVATE-API-PLEASE-DONT-USE",
            },
        });
        const { request } = await loginResponse.json();

        await fetch("https://api.beeper.com/user/login/email", {
            method: "POST",
            headers: {
                Authorization: "Bearer BEEPER-PRIVATE-API-PLEASE-DONT-USE",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ request, email }),
        });

        router.push("/beeper/code")
    }

    return (
        <form onSubmit={sendLoginEmail}>
            <p>Email:</p>
            <input />
        </form>
    )
}