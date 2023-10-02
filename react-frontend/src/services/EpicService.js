import { request } from "../utils/axios_helper"

class EpicService {
    async createEpic(epic) {
        try{
            const response = await request(
                "POST",
                `/productBacklogs/${epic.productBacklogId}/epics`,
                epic
            )
            return response
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
}

const epicService = new EpicService()
export default epicService