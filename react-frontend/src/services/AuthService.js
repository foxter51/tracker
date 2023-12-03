import {request} from "../utils/axios_helper"

class AuthService {

    async login(username, password) {
        try {
            const response = await request(
                "POST",
                "/login",
                {  username: username,
                        password: password }
            )
            this.setAuthUserId(response.data.id)
            this.setAuthToken(response.data.token)
        } catch (err) {
            console.log(err)
            throw err
        }
    }

     async register(firstname, lastname, username, email, password) {
        try {
            const response = await request(
                "POST",
                "/register",
                {  firstname: firstname,
                        lastname: lastname,
                        username: username,
                        email: email,
                        password: password }
            )
            this.setAuthUserId(response.data.id)
            this.setAuthToken(response.data.token)
        } catch (err) {
            console.log(err)
            throw err
        }
    }

    async doGoogleRequestUrl() {
        try {
            return await request(
                "POST",
                "/login/google",
                {}
            )
        } catch (err) {
            console.log(err)
            throw err
        }
    }

    async approveGoogleAuthorization(code) {
        try {
            const response = await request(
                "POST",
                `/login/google/approve?code=${code}`,
                {}
            )
            this.setAuthUserId(response.data.id)
            this.setAuthToken(response.data.token)
        } catch (err) {
            console.log(err)
            throw err
        }
    }

    logout() {
        window.localStorage.removeItem("auth_token")
        window.localStorage.removeItem("user_id")
        window.location.reload()
    }

    getAuthToken() {
        return window.localStorage.getItem("auth_token")
    }

    setAuthToken(token) {
        window.localStorage.setItem("auth_token", token)
        window.location.reload()
    }

    getAuthUserId() {
        return +window.localStorage.getItem("user_id")
    }

    setAuthUserId(id) {
        window.localStorage.setItem("user_id", id)
    }

    isAuthenticated() {
        return this.getAuthToken() !== null
    }
}

const authService = new AuthService()
export default authService