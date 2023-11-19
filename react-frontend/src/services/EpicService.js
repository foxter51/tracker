import { request } from "../utils/axios_helper"

class EpicService {
    async createEpic(epic) {
        try{
            return await request(
                "POST",
                `/productBacklogs/${epic.productBacklogId}/epics`,
                epic
            )
        } catch (err) {
            console.log(err)
            throw err
        }
    }

    async getProductBacklogEpics(productBacklogId) {
        try {
            return await request(
                "GET",
                `/productBacklogs/${productBacklogId}/epics`,
                {}
            )
        } catch (err) {
            console.log(err)
            throw err
        }
    }

    async removeEpic(epicId) {
        try {
            return await request(
                "DELETE",
                `/epics/${epicId}`,
                {}
            )
        } catch (err) {
            console.log(err)
            throw err
        }
    }
}

const epicService = new EpicService()
export default epicService