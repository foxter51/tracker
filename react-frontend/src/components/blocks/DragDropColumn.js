import React, { useState } from "react"
import { Draggable, Droppable } from "react-beautiful-dnd"
import TaskModal from "../modals/TaskModal"
import UserStoryModal from "../modals/UserStoryModal"
import TaskCard from './TaskCard'

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
                                            <TaskCard
                                                task={task}
                                                showModalTask={showModalTask}
                                                showModalUserStory={showModalUserStory}
                                            />
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