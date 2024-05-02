import React, { useEffect, useState } from "react"
import SprintService from "../../services/SprintService"
import { DragDropContext } from "react-beautiful-dnd"
import LoadingEffect from "../effects/LoadingEffect"
import DragDropColumn from "./DragDropColumn"
import AuthService from "../../services/AuthService"
import UserService from "../../services/UserService"
import TaskService from "../../services/TaskService"
import DevelopersListTab from "./DevelopersListTab"
import Timer from "./Timer"
import { socket } from "../../utils/socket"

export default function ScrumBoard({ project }) {

    const [toDoTasks, setToDoTasks] = useState([])
    const [inProgressTasks, setInProgressTasks] = useState([])
    const [inReviewTasks, setInReviewTasks] = useState([])
    const [doneTasks, setDoneTasks] = useState([])

    const [currentUser, setCurrentUser] = useState(null)
    const [currentUserRole, setCurrentUserRole] = useState(null)
    const [assigneeId, setAssigneeId] = useState(null)

    const [currentSprintEndDate, setCurrentSprintEndDate] = useState(null)

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const getStoredAssigneeId = () => {
        return window.localStorage.getItem(`project${project.id}BoardUserFilter`)
    }

    const fetchTasks = async(currentSprintId, storedAssigneeId) => {
        const toDoResponse = await SprintService.findAllSprintTasksByStatus(currentSprintId, "TO DO", storedAssigneeId)
        const inProgressResponse = await SprintService.findAllSprintTasksByStatus(currentSprintId, "IN PROGRESS", storedAssigneeId)
        const inReviewResponse = await SprintService.findAllSprintTasksByStatus(currentSprintId, "IN REVIEW", storedAssigneeId)
        const doneResponse = await SprintService.findAllSprintTasksByStatus(currentSprintId, "DONE", storedAssigneeId)

        setToDoTasks(toDoResponse.data.tasks)
        setInProgressTasks(inProgressResponse.data.tasks)
        setInReviewTasks(inReviewResponse.data.tasks)
        setDoneTasks(doneResponse.data.tasks)
    }

    useEffect(() => {
        const fetchProjectInfo = async () => {
            try {
                const storedAssigneeId = getStoredAssigneeId()
                setAssigneeId(storedAssigneeId)

                const currentSprintId = project.currentSprint?.id ?? -1

                const currUserId = AuthService.getAuthUserId()
                const userResponse = await UserService.getUser(currUserId)

                const currUserRole = project.Team.userRoles.find(role => role.UserId === currUserId).Role.scrumRole

                await fetchTasks(currentSprintId, storedAssigneeId)
                setCurrentUser(userResponse.data.user)
                setCurrentUserRole(currUserRole)
                
                if (project.currentSprint){
                    const currentSprintStartDate = (new Date(project.currentSprint.startDate)).getTime()
                    const currentSprintDuration = project.currentSprint.duration * 7 * 24 * 60 * 60 * 1000
                    setCurrentSprintEndDate(new Date(currentSprintStartDate + currentSprintDuration))
                }
            } catch (error) {
                setError(error.response.data.message)
            }
            setLoading(false)
        }
        fetchProjectInfo()
    }, [project.id])

    useEffect(() => {
        const handleTaskUpdate = async (data) => {
            if (project.currentSprint?.SprintBacklog?.id === data.sprintBacklogId) {
                console.log('gg')
                await fetchTasks(project.currentSprint?.id, getStoredAssigneeId())
            }
        }

        socket.on('task update', (data) => handleTaskUpdate(data))

        return () => {
            socket.off('task update', handleTaskUpdate)
        }
    }, [project.currentSprint?.id])

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
        const draggedTask = getTasksListByStatus(source.droppableId)[source.index]

        if (currentUserRole !== "Scrum Master" && currentUserRole !== "Developer") {
            return
        }

        if (currentUserRole === "Developer" && (draggedTask.assignee && draggedTask.assignee.id !== currentUser.id)) {
            return
        }
        
        if (currentUserRole === "Scrum Master" && !draggedTask.assignee) {
            return
        }

        if (source.droppableId === destination.droppableId) {
            reorderTasksList(source, destination)
        } else {
            moveBetweenLists(source, destination)
        }
    }

    const moveBetweenLists = (source, destination) => {
        const sourceList = getTasksListByStatus(source.droppableId)
        const [draggedItem] = sourceList.splice(source.index, 1)

        if(destination.droppableId !== 'toDo') {
            if (currentUserRole !== "Scrum Master") {
                draggedItem.assigneeId = currentUser.id
                draggedItem.assignee = currentUser
            }

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

        const destinationList = getTasksListByStatus(destination.droppableId)
        destinationList.splice(destination.index, 0, draggedItem);

        (async () => {
            await updateTaskStatus(draggedItem.id, destination.droppableId, draggedItem.assigneeId)
        })()
    }

    const reorderTasksList = (source, destination) => {
        const list = getTasksListByStatus(source.droppableId)

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

    const getTasksListByStatus = (status) => {
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
            window.localStorage.removeItem(`project${project.id}BoardUserFilter`)
            window.location.reload()
        } else {
            setToDoTasks(toDoTasks.filter(task => task.assigneeId === assigneeId))
            setInProgressTasks(inProgressTasks.filter(task => task.assigneeId === assigneeId))
            setInReviewTasks(inReviewTasks.filter(task => task.assigneeId === assigneeId))
            setDoneTasks(doneTasks.filter(task => task.assigneeId === assigneeId))

            window.localStorage.setItem(`project${project.id}BoardUserFilter`, assigneeId)
            setAssigneeId(assigneeId)
        }
    }

    const onStartSprints = async () => {
        try {
            await SprintService.setNextSprint(project.id)
            window.location.reload()
        } catch (error) {
            setError(error.response.data.message)
        }
    }

    if (loading) {
        return <LoadingEffect/>
    }

    return (
        <div className="container p-2">
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <DevelopersListTab
                        team={project.Team}
                        filterTasksByAssignee={filterTasksByAssignee}
                        selectedAssigneeId={assigneeId}
                    />
                    <div className="text-danger">{ error }</div>
                    {!project.currentSprint &&
                        <button className="btn btn-success float-end" onClick={() => onStartSprints()}>
                            Start
                        </button>
                    }
                    {project.currentSprint &&
                        <div className="d-flex">
                            <div className="me-1">
                                Time to next sprint:
                            </div>
                            <Timer
                                expiryTimestamp={currentSprintEndDate}
                                // expiryTimestamp={ new Date((new Date(project.currentSprint.startDate)).getTime() + 60 * 1000)}  // for testing
                            />
                        </div>
                    }
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