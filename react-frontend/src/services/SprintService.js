import { request } from "../utils/axios_helper"

class SprintService {
    async createSprint(sprint) {
        try{
            return await request(
                "POST",
                `/projects/${sprint.projectId}/sprints`,
                sprint
            )
        } catch (err) {
            console.log(err)
            throw err
        }
    }

    async getProjectSprints(projectId) {
        try{
            return await request(
                "GET",
                `/projects/${projectId}/sprints`,
                {}
            )
        } catch (err) {
            console.log(err)
            throw err
        }
    }

    async findAllSprintTasksByStatus(sprintId, status) {
        try{
            return await request(
                "GET",
                `/sprints/${sprintId}/tasks?status=${status}`,
                {}
            )
        } catch (err) {
            console.log(err)
            throw err
        }
    }
}

const sprintService = new SprintService()
export default sprintService