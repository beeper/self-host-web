"use client"

import BeeperLogin from "@/app/components/BeeperLogin"
import {useState} from "react";
import FlyLogin from "@/app/components/FlyLogin";
import Deployment from "@/app/components/Deployment";

export default function Home() {

    const [beeperToken, setBeeperToken] = useState("");
    const [flyToken, setFlyToken] = useState("");

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
        <Deployment beeperToken={beeperToken} flyToken={flyToken} />
    )
}
