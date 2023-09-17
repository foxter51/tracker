import { request } from "../utils/axios_helper"

class TeamService {
    async createTeam(team) {
        try {
            return await request(
                "POST",
                "/teams",
                team
            )
        } catch (err) {
            console.log(err)
            throw err
        }
    }

    async getTeam(id){
        try{
            return await request(
                "GET",
                `/teams/${id}`,
                {}
            )
        } catch (err) {
            console.log(err)
            throw err
        }
    }

    async deleteTeam(id) {
        try {
            return await request(
                "DELETE",
                `/teams/${id}`,
            )
        } catch (err) {
            console.log(err)
            throw err
        }
    }
}

const teamService = new TeamService()
export default teamService