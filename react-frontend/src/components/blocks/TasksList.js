import React, { useEffect, useState } from "react"
import classNames from "classnames"
import statusColor from "../../utils/status_color"
import TaskForm from "../forms/TaskForm"
import { Link } from "react-router-dom"
import TaskModal from "../modals/TaskModal"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash } from "@fortawesome/free-solid-svg-icons"
import TaskService from "../../services/TaskService"
import ConfirmModal from "../modals/ConfirmModal"

export default function TasksList({userStoryId, isProductOwner, tasks, addTask, removeTask}) {

    const [showTaskForm, setShowTaskForm] = useState(false)

    const [selectedTask, setSelectedTask] = useState(null)
    const [showTaskModal, setShowTaskModal] = useState(false)

    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [taskToRemove, setTaskToRemove] = useState(0)

    const [removedTaskId, setRemovedTaskId] = useState(null)

    useEffect(() => {
        if (removedTaskId) {
            removeTask(removedTaskId)
            setRemovedTaskId(null)
        }
    }, [removeTask, removedTaskId])

    const onShowTaskModal = (task) => {
        setSelectedTask(task)
        setShowTaskModal(true)
    }

    const onSubmitRemoveTask = async () => {
        try {
            setShowConfirmModal(false)
            setRemovedTaskId(taskToRemove)
            await TaskService.removeTask(taskToRemove)
            setTaskToRemove(0)
        } catch (err) {
            console.log(err)
        }
    }

    const onCancelRemoveTask = () => {
        setTaskToRemove(0)
        setShowConfirmModal(false)
    }

    return (
        <div>
            <div className="card-header d-flex justify-content-between align-items-center">
                Tasks
                {isProductOwner && !showTaskForm &&
                    <button className="btn btn-primary" onClick={() => setShowTaskForm(true)}>
                        Create Task
                    </button>
                }
                {isProductOwner && showTaskForm &&
                    <button className="btn btn-primary" onClick={() => setShowTaskForm(false)}>
                        Cancel
                    </button>
                }
            </div>
            <div className="card-body">
                {showTaskForm &&
                    <TaskForm
                        userStoryId={userStoryId}
                        addTask={addTask}
                        setShowTaskForm={setShowTaskForm}
                    />
                }

                <ul className="list-group">
                    {tasks
                        .sort((a, b) => a.title.localeCompare(b.title))
                        .map((task) => (
                            <div key={task.id}
                                 className="list-group-item d-flex justify-content-between align-items-center">
                                <Link to="" onClick={() => onShowTaskModal(task)}>
                                    {task.title}
                                </Link>
                                <div className="d-flex align-items-center">
                                    <div className={classNames(classNames(statusColor(task.status)),
                                        isProductOwner ? "me-3" : "")}>
                                        {task.status}
                                    </div>
                                    {isProductOwner &&
                                        <Link to="">
                                            <FontAwesomeIcon icon={faTrash}
                                                             onClick={() => {
                                                                 setTaskToRemove(task.id)
                                                                 setShowConfirmModal(true)
                                                             }}
                                            />
                                        </Link>
                                    }
                                </div>
                            </div>
                        ))
                    }
                    {showTaskModal &&
                        <TaskModal
                            task={selectedTask}
                            show={showTaskModal}
                            onClose={() => setShowTaskModal(false)}
                        />
                    }
                    {showConfirmModal &&
                        <ConfirmModal
                            showModal={showConfirmModal}
                            onConfirm={onSubmitRemoveTask}
                            onCancel={onCancelRemoveTask}
                            question="Are you sure you want to delete this task?"
                        />
                    }
                </ul>
            </div>

        </div>
    )
}