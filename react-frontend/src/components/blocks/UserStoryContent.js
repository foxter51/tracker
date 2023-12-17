import React, { useEffect, useState } from "react"
import LoadingEffect from "../effects/LoadingEffect"
import TaskService from "../../services/TaskService"
import TasksList from "./TasksList"
import { socket } from "../../utils/socket"

export default function UserStoryContent({userStoryId, isProductOwner}) {

    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await TaskService.getUserStoryTasks(userStoryId)
                setTasks(response.data.tasks)
                setLoading(false)
            } catch (err) {
                console.log(err)
            }
        }
        fetchTasks()
    }, [userStoryId])

    useEffect(() => {
        socket.on('task update', (data) => {
            const updatedTask = tasks.find(task => task.id === data.taskId)
            if (updatedTask) {
                updatedTask.status = data.taskStatus

                setTasks(prevTasks => {
                    return prevTasks.map(task => {
                        if (task.id === updatedTask.id) {
                            return updatedTask
                        }
                        return task
                    })
                })
            }

            return () => {
                socket.off('user story update')
            }
        })
    })

    if(loading){
        return <LoadingEffect/>
    }

    const addTask = (task) => {
        setTasks([...tasks, task])
    }

    const removeTask = (taskId) => {
        setTasks(prevState => prevState.filter(task => task.id !== taskId))
    }

    return (
        <div className="container p-2">
            <div className="card">
                <TasksList
                    userStoryId={userStoryId}
                    isProductOwner={isProductOwner}
                    tasks={tasks}
                    addTask={addTask}
                    removeTask={removeTask}
                />
            </div>
        </div>
    )
}