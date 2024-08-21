import * as React from "react"
import AuthService from "../../services/AuthService"
import {Link} from "react-router-dom"
import { ThemeContext } from "../effects/Theme"
import { useContext, useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMoon } from "@fortawesome/free-solid-svg-icons/faMoon"
import { faSun } from "@fortawesome/free-solid-svg-icons/faSun"
import UserService from 'services/UserService'

export default function Header(props) {

    const { theme, toggleTheme } = useContext(ThemeContext)

    const isAuthenticated = AuthService.isAuthenticated()

    const [authUsername, setAuthUsername] = useState("")

    useEffect(() => {
        if (isAuthenticated) {
            UserService.getUser(AuthService.getAuthUserId()).then((response) => {
                setAuthUsername(response.data.user.username)
            })
        }
    })

    return (
        <div className={`App-header ${theme} shadow-sm rounded mb-5 ms-1 me-1 mt-1`}>
            <div className="left-side">
                <Link to="/" className="text-decoration-none text-white">
                <div className="d-flex align-items-center">
                    <img src={props.logoSrc} className="App-logo" alt="logo"/>
                    <div className="h2 text-stroke">{props.pageTitle}</div>
                </div>
                </Link>
            </div>
            <ul className="nav nav-pills align-items-center">
                <li className="nav-item rounded me-1">
                    <Link to="/" className="nav-link">Home</Link>
                </li>
                {isAuthenticated && (
                    <>
                        <Link to={ `/users/${AuthService.getAuthUserId()}` } className="profile-badge rounded me-1 text-decoration-none">
                            <span className="nav-link">My Profile</span>
                            <span className="badge badge-pill badge-info">{ authUsername }</span>
                        </Link>
                        <li className="nav-item rounded me-1">
                            <Link to={`/projects/my/${AuthService.getAuthUserId()}`} className="nav-link">My Projects</Link>
                        </li>
                        <li className="nav-item rounded me-1">
                            <Link to={`/teams/my/${AuthService.getAuthUserId()}`} className="nav-link">My Teams</Link>
                        </li>
                    </>
                )}
                <li className="nav-item border rounded">
                    { isAuthenticated ?
                        <a href="/" onClick={AuthService.logout} className="nav-link active">Logout</a>
                        :
                        <Link to="/auth" className="nav-link active">Login</Link> }
                </li>
                <li>
                    <div className="d-flex align-items-center ms-3">
                        <FontAwesomeIcon icon={faMoon} className="switcherIcons me-2"/>
                        <div className="form-check form-switch">
                            <input className="form-check-input" type="checkbox" role="switch" id="themeSwitcher"
                                   checked={theme === 'light'}
                                   onChange={() => toggleTheme()}/>
                        </div>
                        <FontAwesomeIcon icon={faSun} className="switcherIcons"/>
                    </div>
                </li>
            </ul>
        </div>
    )
}