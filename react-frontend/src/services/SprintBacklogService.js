import { request } from "../utils/axios_helper"

class SprintBacklogService {
    async getSprintBacklog(sprintId){
        try{
            return await request(
                "GET",
                `/sprints/${sprintId}/sprintBacklog`,
                {}
            )
        } catch (err) {
            console.log(err)
            throw err
        }
    }

    async addUserStories(sprintBacklogId, userStoriesIds){
        try{
            return await request(
                "POST",
                `/sprintBacklogs/${sprintBacklogId}/userStories`,
                { userStoriesIds }
            )
        } catch (err) {
            console.log(err)
            throw err
        }
    }
}

const sprintBacklogService = new SprintBacklogService()
export default sprintBacklogService