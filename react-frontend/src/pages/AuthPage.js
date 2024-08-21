import * as React from "react"
import classNames from "classnames"
import AuthService from "../services/AuthService"
import { Navigate } from "react-router"
import LoginForm from "../components/forms/LoginForm"
import RegisterForm from "../components/forms/RegisterForm"
import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGoogle } from "@fortawesome/free-brands-svg-icons/faGoogle"

export default function AuthPage () {

    const [activeTab, setActiveTab] = useState("login")
    const [googleUrl, setGoogleUrl] = useState("")

    const requestGoogleUrl = async () => {
        try {
            const response = await AuthService.doGoogleRequestUrl()
            setGoogleUrl(response.data.url)
        } catch (error) {
            console.log(error)
        }
    }

    if (AuthService.isAuthenticated()) {
        return <Navigate to="/"/>
    }

    if (googleUrl !== "") {
        window.location.href = googleUrl
    }

    return (
        <div className="align-content-center">
            <div className="container d-flex justify-content-center mb-3">
                <div className="card col-4">
                    <ul className="nav nav-pills nav-justified">
                        <li className="nav-item rounded">
                            <button className={classNames("nav-link", activeTab === "login" ? "active" : "")} id="tab-login"
                                    onClick={() => setActiveTab("login")}>Login</button>
                        </li>
                        <li className="nav-item rounded">
                            <button className={classNames("nav-link", activeTab === "register" ? "active" : "")} id="tab-register"
                                    onClick={() => setActiveTab("register")}>Register</button>
                        </li>
                    </ul>
                    <div className="card-body tab-content">
                        <div className={classNames("tab-pane", "fade", activeTab === "login" ? "show active" : "")}>
                            <LoginForm/>
                        </div>
                        <div className={classNames("tab-pane", "fade", activeTab === "register" ? "show active" : "")}>
                            <RegisterForm/>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container d-flex justify-content-center">
                <button className="btn bg-transparent" onClick={requestGoogleUrl}>
                    <FontAwesomeIcon icon={faGoogle} size="2xl" className="text-primary"/>
                </button>
            </div>
        </div>
    )
}