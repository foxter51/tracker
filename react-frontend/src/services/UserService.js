import { request } from "../utils/axios_helper"

class UserService {
    async getUser(id) {
        try{
            return await request(
                "GET",
                `/users/${id}`,
                {}
            )
        } catch (err) {
            console.log(err)
            throw err
        }
    }

    async getAllUsers(exceptUserIds = []) {
        try{
            const queryParams = exceptUserIds.length > 0 ? `?exceptUserIds=${exceptUserIds.join(",")}` : ""
            return await request(
                "GET",
                `/users${queryParams}`
            )
        } catch (err) {
            console.log(err)
            throw err
        }
    }

    async updateUser(user) {
        try {
            return await request(
                "PATCH",
                `/users/${user.id}`,
                user
            )
        } catch (err) {
            console.log(err)
            throw err
        }
    }

    async deleteUser(id) {
        try {
            return await request(
                "DELETE",
                `/users/${id}`,
            )
        } catch (err) {
            console.log(err)
            throw err
        }
    }
}

const userService = new UserService()
export default userService