import React, { useState } from "react"
import { Draggable, Droppable } from "react-beautiful-dnd"
import TaskModal from "../modals/TaskModal"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars, faUser } from "@fortawesome/free-solid-svg-icons"
import classNames from "classnames"
import priorityColor from "../../utils/priority_color"
import UserStoryModal from "../modals/UserStoryModal"
import { Link } from "react-router-dom"

export default function DragDropColumn({tasks, tasksType, tasksHeader}) {
    const [selectedTask, setSelectedTask] = useState(null)
    const [showTaskModal, setShowTaskModal] = useState(false)

    const [selectedUserStory, setSelectedUserStory] = useState(null)
    const [showUserStoryModal, setShowUserStoryModal] = useState(false)

    const showModalTask = (task) => {
        setSelectedTask(task)
        setShowTaskModal(true)
    }

    const showModalUserStory = (userStory) => {
        setSelectedUserStory(userStory)
        setShowUserStoryModal(true)
    }

    return (
        <div className="card">
            <div className="card-header">
                <div className="h6">{tasksHeader}</div>
            </div>
            <div className="card-body">
                <Droppable droppableId={`${tasksType}`}>
                    {provided => (
                        <ul className={`${tasksType} list-unstyled`} {...provided.droppableProps} ref={provided.innerRef}>
                            {tasks.map((task, index) => (
                                <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                    {provided => (
                                        <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="mb-1">
                                            <div className="card">
                                                <div className="card-body m-1">
                                                    <div className="text-primary mb-2" onClick={() => showModalTask(task)}>
                                                        {task.title}
                                                    </div>
                                                    <div className={classNames(task.assignee ? "mb-2" : "")}>
                                                        <div className="row">
                                                            <div className="col">
                                                                <div className="d-flex align-items-center">
                                                                    <FontAwesomeIcon icon={faBars} className="me-1"/>
                                                                    <div className="text-success" onClick={() => showModalUserStory(task.UserStory)}>
                                                                        {` ${task.UserStory.title}`}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-4">
                                                                <div className="d-flex align-items-center justify-content-between">
                                                                    <div className="h6 d-inline-block">
                                                                        <div className="border rounded-circle border-danger p-1">{task.storyPoints}</div>
                                                                    </div>
                                                                    <div className={classNames(priorityColor(task.priority))}>
                                                                        {task.priority}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="float-end">
                                                        {task.assignee &&
                                                            <div className="d-flex align-items-center">
                                                                <FontAwesomeIcon icon={faUser} className="me-1"/>
                                                                <Link to={`/users/${task.assignee.id}`} className="text-decoration-none">
                                                                    {`${task.assignee.lastname} ${task.assignee.firstname}`}
                                                                </Link>
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </ul>
                    )}
                </Droppable>
            </div>
            {showTaskModal &&
                <TaskModal
                    task={selectedTask}
                    show={showTaskModal}
                    onClose={() => setShowTaskModal(false)}
                />
            }
            {showUserStoryModal &&
                <UserStoryModal
                    userStory={selectedUserStory}
                    show={showUserStoryModal}
                    onClose={() => setShowUserStoryModal(false)}
                />
            }
        </div>
    )
}