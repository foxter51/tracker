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

    async setNextSprint(projectId) {
        try{
            return await request(
                "PATCH",
                `/projects/${projectId}/nextSprint`,
                {}
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

    async findAllSprintTasksByStatus(sprintId, status, assigneeId) {
        try{
            return await request(
                "GET",
                `/sprints/${sprintId}/assignee/${assigneeId}/tasks?status=${status}`,
                {}
            )
        } catch (err) {
            console.log(err)
            throw err
        }
    }

    async deleteSprint(sprintId) {
        try{
            return await request(
                "DELETE",
                `/sprints/${sprintId}`,
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