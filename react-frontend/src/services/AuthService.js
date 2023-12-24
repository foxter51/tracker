import {request} from "../utils/axios_helper"
import Cookies from 'js-cookie'

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
        Cookies.remove("auth_token")
        Cookies.remove("user_id")
    }

    getAuthToken() {
        return Cookies.get('auth_token')
    }

    setAuthToken(token) {
        Cookies.set('auth_token', token, { expires: 0.5, secure: false })
        window.location.reload()
    }

    getAuthUserId() {
        return +Cookies.get("user_id")
    }

    setAuthUserId(id) {
        Cookies.set('user_id', id, { expires: 0.5, secure: false })
    }

    isAuthenticated() {
        return this.getAuthToken() !== undefined && this.getAuthToken() !== null && this.getAuthToken() !== "null"
    }
}

const authService = new AuthService()
export default authService