"use client"

import BeeperLogin from "@/app/components/BeeperLogin"
import {useState} from "react";
import FlyLogin from "@/app/components/FlyLogin";

export default function Home() {

    const [token, setToken] = useState("");
    const [flyToken, setFlyToken] = useState("");

    if (!token) {
        return (
            <div>
                <BeeperLogin setToken={setToken} />
                <p>token:</p>
                <p>{token}</p>
            </div>
        )
    }

    if (!flyToken) {
        return (
            <FlyLogin setFlyToken={setFlyToken} />
        )
    }

    return (
        <p>hi</p>
    )
}
