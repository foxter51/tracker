import React, { useEffect, useState } from "react"
import { Multiselect } from "multiselect-react-dropdown"
import TaskService from "../../services/TaskService"
import getStyledMultiselect from "../../utils/multiselect_style"

export default function TaskForm({userStoryId, setShowTaskForm, addTask}) {

    const [task, setTask] = useState(null)
    const [error, setError] = useState(null)
    const [save, setSave] = useState(false)

    useEffect(() => {
        if (save) {
            setShowTaskForm(false)
            setSave(false)
        }
    }, [save, setShowTaskForm])

    const priorityOptions = [
        {name: 'LOW'},
        {name: 'MEDIUM'},
        {name: 'HIGH'}
    ]

    const storyPointsOptions = [
        {name: '1'},
        {name: '2'},
        {name: '3'},
        {name: '5'},
        {name: '8'},
        {name: '13'}
    ]

    const statusOptions = [
        {name: 'TO DO'},
        {name: 'IN PROGRESS'},
        {name: 'IN REVIEW'},
        {name: 'DONE'}
    ]

    const onSubmitTask = async (e) => {
        e.preventDefault()
        try{
            const response = await TaskService.createTask({
                ...task,
                userStoryId
            })
            addTask(response.data.task)
            setSave(true)
        } catch (error) {
            setError(error.response.data.message)
        }
    }

    return (
        <div className="mb-3">
            <div>
                <div className="h1">Create Task</div>
            </div>
            <div>{error}</div>
            <form onSubmit={onSubmitTask}>
                <div className="mb-3">
                    <label className="form-label" htmlFor="taskTitle">Task Title</label>
                    <input type="text" id="taskTitle" name="taskTitle" className="form-control" maxLength="32" required onChange={(e) => setTask({...task, title: e.target.value })}/>
                </div>
                <div className="mb-3">
                    <label className="form-label" htmlFor="taskDescription">Task Description</label>
                    <input type="text" id="taskDescription" name="taskDescription" className="form-control" maxLength="32" required onChange={(e) => setTask({...task, description: e.target.value })}/>
                </div>
                <div className="mb-3 row">
                    <div className="col">
                        Task Priority
                    </div>
                    <div className="col">
                        <Multiselect
                            options={priorityOptions}
                            selectedValues={[]}
                            singleSelect="true"
                            onSelect={(selectedList, selectedItem) =>
                                setTask({...task, priority: selectedItem.name})
                            }
                            displayValue="name"
                            style={getStyledMultiselect()}
                        />
                    </div>
                </div>
                <div className="mb-3 row">
                    <div className="col">
                        Task Story Points
                    </div>
                    <div className="col">
                        <Multiselect
                            options={storyPointsOptions}
                            selectedValues={[]}
                            singleSelect="true"
                            onSelect={(selectedList, selectedItem) =>
                                setTask({...task, storyPoints: selectedItem.name})
                            }
                            displayValue="name"
                            style={getStyledMultiselect()}
                        />
                    </div>
                </div>
                <div className="mb-3 row">
                    <div className="col">
                        Task Status
                    </div>
                    <div className="col">
                        <Multiselect
                            options={statusOptions}
                            selectedValues={[]}
                            singleSelect="true"
                            onSelect={(selectedList, selectedItem) =>
                                setTask({...task, status: selectedItem.name})
                            }
                            displayValue="name"
                            style={getStyledMultiselect()}
                        />
                    </div>
                </div>
                <div className="d-flex justify-content-end">
                    <button type="submit" className="btn btn-primary">Create</button>
                </div>
            </form>
        </div>
    )
}