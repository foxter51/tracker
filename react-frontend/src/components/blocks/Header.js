import * as React from "react"
import AuthService from "../../services/AuthService"
import {Link} from "react-router-dom"

export default function Header(props) {

    const isAuthenticated = AuthService.isAuthenticated()

    return (
        <div className="App-header mb-5">
            <div className="left-side">
                <Link to="/" className="text-decoration-none text-white">
                <img src={props.logoSrc} className="App-logo" alt="logo"/>
                <h1>{props.pageTitle}</h1>
                </Link>
            </div>
            <ul className="nav nav-pills">
                <li className="nav-item">
                    <Link to="/" className="nav-link">Home</Link>
                </li>
                {isAuthenticated && (
                    <li className="nav-item">
                        <Link to={`/users/${AuthService.getAuthUserId()}`} className="nav-link">My Profile</Link>
                    </li>
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