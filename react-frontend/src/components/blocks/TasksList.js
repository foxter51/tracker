import React, { useState } from "react"
import classNames from "classnames"
import statusColor from "../../utils/status_color"
import TaskForm from "../forms/TaskForm"
import { Link } from "react-router-dom"
import TaskModal from "../modals/TaskModal"

export default function TasksList({userStoryId, isProductOwner, tasks, addTask}) {

    const [showTaskForm, setShowTaskForm] = useState(false)

    const [selectedTask, setSelectedTask] = useState(null)
    const [showTaskModal, setShowTaskModal] = useState(false)

    const showModal = (task) => {
        setSelectedTask(task)
        setShowTaskModal(true)
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
                                <Link to="" onClick={() => showModal(task)}>
                                    {task.title}
                                </Link>
                                <div className={classNames( statusColor(task.status))}>
                                    {task.status}
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
                </ul>
            </div>

        </div>
    )
}