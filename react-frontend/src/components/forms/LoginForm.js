import React, { useState } from "react"
import AuthService from "../../services/AuthService"

export default function LoginForm() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)

    const onSubmitLogin = async (e) => {
        e.preventDefault()
        try{
            await AuthService.login(username, password)
        } catch (error) {
            setError(error.response.data.message)
        }
    }

    return (
        <form onSubmit={onSubmitLogin}>
            <div>{error}</div>
            <div className="form-outline mb-2">
                <label className="form-label" htmlFor="loginName">Username</label>
                <input type="text" id="loginName" name="username" className="form-control" maxLength="32" required onChange={(e) => setUsername(e.target.value)}/>
            </div>
            <div className="form-outline mb-2">
                <label className="form-label" htmlFor="loginPassword">Password</label>
                <input type="password" id="loginPassword" name="password" className="form-control" maxLength="64" required onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <button type="submit" className="btn btn-primary">Sign in</button>
        </form>
    )
}