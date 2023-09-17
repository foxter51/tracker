import { request } from "../utils/axios_helper"

class UserRoleService {
    async createTeamMembers(userRoles) {
        try {
            return await request(
                "POST",
                "/teams/userRoles",
                userRoles
            )
        } catch (err) {
            console.log(err)
            throw err
        }
    }
}

const userRoleService = new UserRoleService()
export default userRoleService