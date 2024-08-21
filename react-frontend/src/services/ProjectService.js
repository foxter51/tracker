import { request } from "../utils/axios_helper"

class ProjectService {
    async createProject(project) {
        try {
            return await request(
                "POST",
                "/projects",
                project
            )
        } catch (err) {
            console.log(err)
            throw err
        }
    }

    async getProject(id){
        try{
            return await request(
                "GET",
                `/projects/${id}`,
                {}
            )
        } catch (err) {
            console.log(err)
            throw err
        }
    }

    async getUserProjects(id) {
        try {
            return await request(
                "GET",
                `/projects/my/${id}`,
                {}
            )
        } catch (err) {
            console.log(err)
            throw err
        }
    }
}

const projectService = new ProjectService()
export default projectService