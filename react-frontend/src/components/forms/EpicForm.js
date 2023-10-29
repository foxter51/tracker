import React, { useState } from "react"
import EpicService from "../../services/EpicService"
import { Multiselect } from "multiselect-react-dropdown"

export default function EpicForm({productBacklogId, setShowEpicForm, addEpic}) {

    const [epic, setEpic] = useState(null)
    const [error, setError] = useState(null)
    const [save, setSave] = useState(false)

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

    const onSubmitEpic = async (e) => {
        e.preventDefault()
        try{
            const response = await EpicService.createEpic({
                ...epic,
                productBacklogId
            })
            addEpic(response.data.epic)
            setSave(true)
        } catch (error) {
            setError(error.response.data.message)
        }
    }

    if (save) {
        setShowEpicForm(false)
    }

    return (
        <div className="mb-3">
            <div>
                <div className="h1">Create Epic</div>
            </div>
            <div>{error}</div>
            <form onSubmit={onSubmitEpic}>
                <div className="mb-3">
                    <label className="form-label" htmlFor="epicTitle">Epic Title</label>
                    <input type="text" id="epicTitle" name="epicTitle" className="form-control" maxLength="32" required onChange={(e) => setEpic({...epic, title: e.target.value })}/>
                </div>
                <div className="mb-3">
                    <label className="form-label" htmlFor="epicDescription">Epic Description</label>
                    <input type="text" id="epicDescription" name="epicDescription" className="form-control" maxLength="32" required onChange={(e) => setEpic({...epic, description: e.target.value })}/>
                </div>
                <div className="mb-3 row">
                    <div className="col">
                        Epic Priority
                    </div>
                    <div className="col">
                        <Multiselect
                            options={priorityOptions}
                            selectedValues={[]}
                            singleSelect="true"
                            onSelect={(selectedList, selectedItem) =>
                                setEpic({...epic, priority: selectedItem.name})
                            }
                            displayValue="name"
                        />
                    </div>
                </div>
                <div className="mb-3 row">
                    <div className="col">
                        Epic Story Points
                    </div>
                    <div className="col">
                        <Multiselect
                            options={storyPointsOptions}
                            selectedValues={[]}
                            singleSelect="true"
                            onSelect={(selectedList, selectedItem) =>
                                setEpic({...epic, storyPoints: selectedItem.name})
                            }
                            displayValue="name"
                        />
                    </div>
                </div>
                <div className="mb-3 row">
                    <div className="col">
                        Epic Status
                    </div>
                    <div className="col">
                        <Multiselect
                            options={statusOptions}
                            selectedValues={[]}
                            singleSelect="true"
                            onSelect={(selectedList, selectedItem) =>
                                setEpic({...epic, status: selectedItem.name})
                            }
                            displayValue="name"
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