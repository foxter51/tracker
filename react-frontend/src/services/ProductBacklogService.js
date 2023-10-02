import { request } from "../utils/axios_helper"

class ProductBacklogService {
    async getProductBacklog(projectId) {
        try {
            return await request(
                "GET",
                `/projects/${projectId}/productBacklog`,
                {}
            )
        } catch (err) {
            console.log(err)
            throw err
        }
    }
}

const productBacklogService = new ProductBacklogService()
export default productBacklogService