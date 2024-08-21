import axios from "axios"
import AuthService from "../services/AuthService"

axios.defaults.baseURL = 'http://localhost:8080/api'
axios.defaults.headers.post["Content-Type"] = 'application/json'

export const request = (method, url, data) => {
    let headers = {}
    if (AuthService.getAuthToken() !== null && AuthService.getAuthToken() !== "null"){
        headers = {"Authorization": `Bearer ${AuthService.getAuthToken()}`}
    }

    return axios({
        method: method,
        headers: headers,
        url: url,
        data: data
    })
}
