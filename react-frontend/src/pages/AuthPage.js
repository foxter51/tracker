import * as React from "react"
import classNames from "classnames"
import AuthService from "../services/AuthService"
import { Navigate } from "react-router"
import LoginForm from "../components/forms/LoginForm"
import RegisterForm from "../components/forms/RegisterForm"
import { useState } from "react"

export default function AuthPage () {

    const [active, setActive] = useState("login")

    if (AuthService.isAuthenticated()) {
        return <Navigate to="/"/>
    }

    return (
        <div className="d-flex align-content-center">
            <div className="container d-flex justify-content-center">
                <div className="card col-4">
                    <ul className="nav nav-pills nav-justified">
                        <li className="nav-item rounded">
                            <button className={classNames("nav-link", active === "login" ? "active" : "")} id="tab-login"
                                    onClick={() => setActive("login")}>Login</button>
                        </li>
                        <li className="nav-item rounded">
                            <button className={classNames("nav-link", active === "register" ? "active" : "")} id="tab-register"
                                    onClick={() => setActive("register")}>Register</button>
                        </li>
                    </ul>
                    <div className="card-body tab-content">
                        <div className={classNames("tab-pane", "fade", active === "login" ? "show active" : "")}>
                            <LoginForm/>
                        </div>
                        <div className={classNames("tab-pane", "fade", active === "register" ? "show active" : "")}>
                            <RegisterForm/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}