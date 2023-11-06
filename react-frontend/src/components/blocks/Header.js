import * as React from "react"
import AuthService from "../../services/AuthService"
import {Link} from "react-router-dom"

export default function Header(props) {

    const isAuthenticated = AuthService.isAuthenticated()

    return (
        <div className="App-header shadow-sm rounded mb-5 ms-1 me-1 mt-1">
            <div className="left-side">
                <Link to="/" className="text-decoration-none text-white">
                <div className="d-flex align-items-center">
                    <img src={props.logoSrc} className="App-logo" alt="logo"/>
                    <div className="h2 text-stroke">{props.pageTitle}</div>
                </div>
                </Link>
            </div>
            <ul className="nav nav-pills align-items-center">
                <li className="nav-item border rounded me-1">
                    <Link to="/" className="nav-link">Home</Link>
                </li>
                {isAuthenticated && (
                    <>
                        <li className="nav-item border rounded me-1">
                            <Link to={`/users/${AuthService.getAuthUserId()}`} className="nav-link">My Profile</Link>
                        </li>
                        <li className="nav-item border rounded me-1">
                            <Link to={`/projects/my/${AuthService.getAuthUserId()}`} className="nav-link">My Projects</Link>
                        </li>
                        <li className="nav-item border rounded me-1">
                            <Link to={`/teams/my/${AuthService.getAuthUserId()}`} className="nav-link">My Teams</Link>
                        </li>
                    </>
                )}
                <li className="nav-item">
                    { isAuthenticated ?
                        <a href="/" onClick={AuthService.logout} className="nav-link active">Logout</a>
                        : <Link to="/auth" className="nav-link active">Login</Link> }
                </li>
            </ul>
        </div>
    )
}