"use client"

import BeeperLogin from "@/app/components/BeeperLogin"
import {useEffect, useState} from "react";
import FlyLogin from "@/app/components/FlyLogin";
import Console from "@/app/components/Console";
import Welcome from "@/app/components/Welcome";

export default function Home() {

    const [beeperToken, setBeeperToken] = useState("");
    const [flyToken, setFlyToken] = useState("");
    const [seenWelcome, setSeenWelcome] = useState(false);

    useEffect(() => {

        const beeperTokenLocalStorage = window.localStorage.getItem("beeperToken")
        if (beeperTokenLocalStorage) {
            setBeeperToken(beeperTokenLocalStorage);
        }

        const flyTokenLocalStorage = window.localStorage.getItem("flyToken")
        if (flyTokenLocalStorage) {
            setFlyToken(flyTokenLocalStorage);
        }
    }, [])

    if (!seenWelcome && !flyToken) {
        return (
            <Welcome setSeenWelcome={setSeenWelcome} />
        )
    }

    if (!beeperToken) {
        return (
            <div>
                <BeeperLogin setBeeperToken={setBeeperToken} />
            </div>
        )
    }

    if (!flyToken) {
        return (
            <FlyLogin setFlyToken={setFlyToken} />
        )
    }

    return (
        <Console beeperToken={beeperToken} flyToken={flyToken} />
    )
}
