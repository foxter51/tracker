import React, { useState } from "react"
import AuthService from "../../services/AuthService"

export default function RegisterForm() {
    const [user, setUser] = useState(null)
    const [error, setError] = useState(null)

    const onSubmitRegister = async (e) => {
        e.preventDefault()
        try{
            await AuthService.register({ ...user })
        } catch (error) {
            setError(error.response.data.message)
        }
    }

    return (
        <form onSubmit={onSubmitRegister}>
            <div className="text-danger">{ error }</div>
            <div className="form-outline mb-2">
                <label className="form-label" htmlFor="firstName">Firstname</label>
                <input type="text" id="firstName" name="firstname" className="form-control" maxLength="32" required onChange={(e) => setUser({ ...user, firstname: e.target.value })}/>
            </div>
            <div className="form-outline mb-2">
                <label className="form-label" htmlFor="lastName">Lastname</label>
                <input type="text" id="lastName" name="lastname" className="form-control" maxLength="32" required onChange={(e) => setUser({ ...user, lastname: e.target.value })}/>
            </div>
            <div className="form-outline mb-2">
                <label className="form-label" htmlFor="registerLogin">Username</label>
                <input type="text" id="registerLogin" name="username" className="form-control" maxLength="32" required onChange={(e) => setUser({ ...user, username: e.target.value })}/>
            </div>
            <div className="form-outline mb-2">
                <label className="form-label" htmlFor="registerEmail">Email</label>
                <input type="email" id="registerEmail" name="email" className="form-control" maxLength="64" required onChange={(e) => setUser({ ...user, email: e.target.value })}/>
            </div>
            <div className="form-outline mb-2">
                <label className="form-label" htmlFor="registerPassword">Password</label>
                <input type="password" id="registerPassword" name="password" className="form-control" maxLength="64" required onChange={(e) => setUser({ ...user, password: e.target.value })}/>
            </div>
            <button type="submit" className="btn btn-primary">Sign up</button>
        </form>
    )
}