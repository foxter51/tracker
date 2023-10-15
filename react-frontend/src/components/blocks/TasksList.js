import React, { useState } from "react"
import classNames from "classnames"
import statusColor from "../../utils/status_color"
import TaskForm from "../forms/TaskForm"

export default function TasksList({userStoryId, isProductOwner, tasks, addTask}) {

    const [showTaskForm, setShowTaskForm] = useState(false)

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
                                <div>
                                    {task.title}
                                </div>
                                <div className={classNames( statusColor(task.status))}>
                                    {task.status}
                                </div>
                            </div>
                        ))}
                </ul>
            </div>

        </div>
    )
}