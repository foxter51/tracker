import * as React from "react"
import classNames from "classnames"
import AuthService from "../../services/AuthService"
import {Navigate} from "react-router"

export default class LoginForm extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            active: "login",
            firstname: "",
            lastname: "",
            username: "",
            email: "",
            password: "",
            error: null
        }
    }

    onChangeHandler = (event) => {
        let name = event.target.name
        let value = event.target.value;
        this.setState({[name]: value})
        this.error = null
    }

    onSubmitLogin = (e) => {
        e.preventDefault();
        AuthService.login(
            this.state.username,
            this.state.password
        ).catch((error) => {
            this.setState({error: error.response.data.message})})
    }

    onSubmitRegister = (e) => {
        e.preventDefault();
        AuthService.register(
            this.state.firstname,
            this.state.lastname,
            this.state.username,
            this.state.email,
            this.state.password
        ).catch((error) => {
            this.setState({error: error.response.data.message})})
    }

    render() {
        if (AuthService.isAuthenticated()) return <Navigate to="/"/>
        return (
            <div className="d-flex align-content-center">
                <div className="container d-flex justify-content-center">
                    <div className="card col-4">
                        <ul className="nav nav-pills nav-justified">
                            <li className="nav-item">
                                <button className={classNames("nav-link", this.state.active === "login" ? "active" : "")} id="tab-login"
                                        onClick={() => {this.setState({active: "login"}); this.error = null}}>Login</button>
                            </li>
                            <li className="nav-item">
                                <button className={classNames("nav-link", this.state.active === "register" ? "active" : "")} id="tab-register"
                                        onClick={() => {this.setState({active: "register", error: null}); this.error = null}}>Register</button>
                            </li>
                        </ul>
                        <div className="card-body tab-content">
                            <div className={classNames("tab-pane", "fade", this.state.active === "login" ? "show active" : "")}>
                                <form onSubmit={this.onSubmitLogin}>
                                    <div className="form-outline">
                                        <label className="form-label" htmlFor="loginName">Username</label>
                                        <input type="text" id="loginName" name="username" className="form-control" maxLength="32" required onChange={this.onChangeHandler}/>
                                    </div>
                                    <div className="form-outline">
                                        <label className="form-label" htmlFor="loginPassword">Password</label>
                                        <input type="password" id="loginPassword" name="password" className="form-control" maxLength="64" required onChange={this.onChangeHandler}/>
                                    </div>
                                    <button type="submit" className="btn btn-primary">Sign in</button>
                                </form>
                            </div>
                            <div className={classNames("tab-pane", "fade", this.state.active === "register" ? "show active" : "")}>
                                <form onSubmit={this.onSubmitRegister}>
                                    <div className="form-outline">
                                        <label className="form-label" htmlFor="firstName">Firstname</label>
                                        <input type="text" id="firstName" name="firstname" className="form-control" maxLength="32" required onChange={this.onChangeHandler}/>
                                    </div>
                                    <div className="form-outline">
                                        <label className="form-label" htmlFor="lastName">Lastname</label>
                                        <input type="text" id="lastName" name="lastname" className="form-control" maxLength="32" required onChange={this.onChangeHandler}/>
                                    </div>
                                    <div className="form-outline">
                                        <label className="form-label" htmlFor="registerLogin">Username</label>
                                        <input type="text" id="registerLogin" name="username" className="form-control" maxLength="32" required onChange={this.onChangeHandler}/>
                                    </div>
                                    <div className="form-outline">
                                        <label className="form-label" htmlFor="registerEmail">Email</label>
                                        <input type="email" id="registerEmail" name="email" className="form-control" maxLength="32" required onChange={this.onChangeHandler}/>
                                    </div>
                                    <div className="form-outline">
                                        <label className="form-label" htmlFor="registerPassword">Password</label>
                                        <input type="password" id="registerPassword" name="password" className="form-control" maxLength="64" required onChange={this.onChangeHandler}/>
                                    </div>
                                    <button type="submit" className="btn btn-primary">Sign up</button>
                                </form>
                            </div>
                            <div>{this.state.error}</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}