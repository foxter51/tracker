import { request } from "../utils/axios_helper"

class UserStoryService {
    async createUserStory(userStory) {
        try{
            return await request(
                "POST",
                `/epics/${userStory.epicId}/userStories`,
                userStory
            )
        } catch (err) {
            console.log(err)
            throw err
        }
    }

    async getEpicUserStories(epicId){
        try{
            return await request(
                "GET",
                `/epics/${epicId}/userStories`
            )
        } catch (err) {
            console.log(err)
            throw err
        }
    }
}

const userStoryService = new UserStoryService()
export default userStoryService