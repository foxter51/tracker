import * as React from "react"
import WelcomeContent from "./WelcomeContent"
import AuthContent from "./AuthContent"

export default function AppContent () {

    return (
        <div className="container">
            <WelcomeContent/>
            <AuthContent/>
        </div>
    )
}