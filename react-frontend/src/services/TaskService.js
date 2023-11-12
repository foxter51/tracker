import { request } from "../utils/axios_helper"

class TaskService {
    async createTask(task) {
        try{
            return await request(
                "POST",
                `/userStories/${task.userStoryId}/tasks`,
                task
            )
        } catch (err) {
            console.log(err)
            throw err
        }
    }

    async getUserStoryTasks(userStoryId) {
        try {
            return await request(
                "GET",
                `/userStories/${userStoryId}/tasks`,
                {}
            )
        } catch (err) {
            console.log(err)
            throw err
        }
    }

    async updateTaskStatus(taskId, status, assigneeId) {
        try {
            return await request(
                "PATCH",
                `/tasks/${taskId}`,
                { status, assigneeId }
            )
        } catch (err) {
            console.log(err)
            throw err
        }
    }
}

const taskService = new TaskService()
export default taskService