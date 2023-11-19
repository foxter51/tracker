import React, { useEffect, useState } from "react"
import SprintService from "../../services/SprintService"
import { DragDropContext } from "react-beautiful-dnd"
import LoadingEffect from "../effects/LoadingEffect"
import DragDropColumn from "./DragDropColumn"
import AuthService from "../../services/AuthService"
import UserService from "../../services/UserService"
import { useParams } from "react-router"
import ProjectService from "../../services/ProjectService"
import TaskService from "../../services/TaskService"
import DevelopersListTab from "./DevelopersListTab"

export default function ScrumBoard({sprintId}) {

    const [toDoTasks, setToDoTasks] = useState([])
    const [inProgressTasks, setInProgressTasks] = useState([])
    const [inReviewTasks, setInReviewTasks] = useState([])
    const [doneTasks, setDoneTasks] = useState([])

    const [currentUser, setCurrentUser] = useState(null)
    const [currentProject, setCurrentProject] = useState(null)
    const [assigneeId, setAssigneeId] = useState(null)

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const { id } = useParams()

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const storedAssigneeId = window.localStorage.getItem(`project${id}BoardUserFilter`)
                setAssigneeId(storedAssigneeId)

                const toDoResponse = await SprintService.findAllSprintTasksByStatus(sprintId, "TO DO", storedAssigneeId)
                const inProgressResponse = await SprintService.findAllSprintTasksByStatus(sprintId, "IN PROGRESS", storedAssigneeId)
                const inReviewResponse = await SprintService.findAllSprintTasksByStatus(sprintId, "IN REVIEW", storedAssigneeId)
                const doneResponse = await SprintService.findAllSprintTasksByStatus(sprintId, "DONE", storedAssigneeId)
                const userResponse = await UserService.getUser(AuthService.getAuthUserId())
                const projectResponse = await ProjectService.getProject(id)

                setToDoTasks(toDoResponse.data.tasks)
                setInProgressTasks(inProgressResponse.data.tasks)
                setInReviewTasks(inReviewResponse.data.tasks)
                setDoneTasks(doneResponse.data.tasks)
                setCurrentUser(userResponse.data.user)
                setCurrentProject(projectResponse.data.project)
            } catch (error) {
                setError(error.response.data.message)
            }
            setLoading(false)
        }
        fetchTasks()
    }, [sprintId, id])

    const updateTaskStatus = async (taskId, rawStatus, assigneeId) => {
        let status

        // eslint-disable-next-line default-case
        switch (rawStatus) {
            case "toDo":
                status = "TO DO"
                break
            case "inProgress":
                status = "IN PROGRESS"
                break
            case "inReview":
                status = "IN REVIEW"
                break
            case "done":
                status = "DONE"
                break
        }

        try {
            await TaskService.updateTaskStatus(taskId, status, assigneeId)
        } catch (error) {
            setError(error.response.data.message)
        }
    }

    const onDragEnd = (result) => {
        const { source, destination } = result

        if (!destination) return

        // restrict drag on conditions
        const draggedTask = getList(source.droppableId)[source.index]
        const isCurrentUserDeveloper = currentProject.Team.userRoles.some(role => {
            return role.UserId === currentUser.id && role.RoleId === 3
        })

        if((draggedTask.assignee && (currentUser.id !== draggedTask.assignee.id))
            || !isCurrentUserDeveloper
        ) return

        if (source.droppableId === destination.droppableId) {
            reorderList(source, destination)
        } else {
            moveBetweenLists(source, destination)
        }
    }

    const moveBetweenLists = (source, destination) => {
        const sourceList = getList(source.droppableId)
        const [draggedItem] = sourceList.splice(source.index, 1)

        if(destination.droppableId !== 'toDo') {
            draggedItem.assigneeId = currentUser.id
            draggedItem.assignee = currentUser

            if(destination.droppableId === 'done') {
                draggedItem.status = 'DONE'
            } else if (destination.droppableId === 'inReview') {
                draggedItem.status = 'IN REVIEW'
            } else {
                draggedItem.status = 'IN PROGRESS'
            }
        } else {
            draggedItem.assigneeId = null
            draggedItem.assignee = null
            draggedItem.status = 'TO DO'
        }

        const destinationList = getList(destination.droppableId)
        destinationList.splice(destination.index, 0, draggedItem);

        (async () => {
            await updateTaskStatus(draggedItem.id, destination.droppableId, currentUser.id)
        })()
    }

    const reorderList = (source, destination) => {
        const list = getList(source.droppableId)

        const newList = [...list]

        const [draggedItem] = newList.splice(source.index, 1)

        newList.splice(destination.index, 0, draggedItem)

        // eslint-disable-next-line default-case
        switch (source.droppableId) {
            case 'toDo': setToDoTasks(newList); break
            case 'inProgress': setInProgressTasks(newList); break
            case 'inReview': setInReviewTasks(newList); break
            case 'done': setDoneTasks(newList); break
        }
    }

    const getList = (status) => {
        // eslint-disable-next-line default-case
        switch (status) {
            case 'toDo': return toDoTasks
            case 'inProgress': return inProgressTasks
            case 'inReview': return inReviewTasks
            case 'done': return doneTasks
        }
    }

    const filterTasksByAssignee = (assigneeId) => {
        if (assigneeId === null) {
            window.localStorage.removeItem(`project${currentProject.id}BoardUserFilter`)
            window.location.reload()
        } else {
            setToDoTasks(toDoTasks.filter(task => task.assigneeId === assigneeId))
            setInProgressTasks(inProgressTasks.filter(task => task.assigneeId === assigneeId))
            setInReviewTasks(inReviewTasks.filter(task => task.assigneeId === assigneeId))
            setDoneTasks(doneTasks.filter(task => task.assigneeId === assigneeId))

            window.localStorage.setItem(`project${currentProject.id}BoardUserFilter`, assigneeId)
            setAssigneeId(assigneeId)
        }
    }

    if (loading) {
        return <LoadingEffect/>
    }

    return (
        <div className="container p-2">
            <div className="card">
                <div className="card-header">
                    <DevelopersListTab
                        team={currentProject.Team}
                        filterTasksByAssignee={filterTasksByAssignee}
                        selectedAssigneeId={assigneeId}
                    />
                    {error}
                </div>
                <div className="card-body">
                    <div className="row">
                        <DragDropContext onDragEnd={onDragEnd}>
                            <div className="col">
                                <DragDropColumn
                                    tasks={toDoTasks}
                                    tasksType="toDo"
                                    tasksHeader="TO DO"
                                />
                            </div>
                            <div className="col">
                                <DragDropColumn
                                    tasks={inProgressTasks}
                                    tasksType="inProgress"
                                    tasksHeader="IN PROGRESS"
                                />
                            </div>
                            <div className="col">
                                <DragDropColumn
                                    tasks={inReviewTasks}
                                    tasksType="inReview"
                                    tasksHeader="IN REVIEW"
                                />
                            </div>
                            <div className="col">
                                <DragDropColumn
                                    tasks={doneTasks}
                                    tasksType="done"
                                    tasksHeader="DONE"
                                />
                            </div>
                        </DragDropContext>
                    </div>
                </div>
            </div>
        </div>
    )
}