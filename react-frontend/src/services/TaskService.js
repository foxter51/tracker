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

    async removeTask(taskId) {
        try {
            return await request(
                "DELETE",
                `/tasks/${taskId}`
            )
        } catch (err) {
            console.log(err)
            throw err
        }
    }

    async getAttachmentCloudLink(file) {
        const formData = new FormData()
        formData.append("file", file)

        try {
            return await fetch('https://store1.gofile.io/contents/uploadfile', {
                method: 'POST',
                body: formData
            })
        } catch (err) {
            console.log(err)
            throw err
        }
    }
}

const taskService = new TaskService()
export default taskService