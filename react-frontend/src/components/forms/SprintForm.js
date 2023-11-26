import React, { useEffect, useState } from "react"
import SprintService from "../../services/SprintService"

export default function SprintForm({projectId, setShowSprintForm, addSprint}) {
    const [sprint, setSprint] = useState(null)
    const [error, setError] = useState(null)
    const [save, setSave] = useState(false)

    const minDate = new Date((new Date()).getTime() + (24 * 60 * 60 * 1000))

    useEffect(() => {
        if (save) {
            setShowSprintForm(false)
            setSave(false)
        }
    }, [save, setShowSprintForm])

    const onSubmitSprint = async (e) => {
        e.preventDefault()
        try{
            const response = await SprintService.createSprint({
                ...sprint,
                projectId
            })
            addSprint(response.data.sprint)
            setSave(true)
        } catch (error) {
            setError(error.response.data.message)
        }
    }

    return (
        <div className="mb-3">
            <div>
                <div className="h1">Create Sprint</div>
            </div>
            <div>{error}</div>
            <form onSubmit={onSubmitSprint}>
                <div className="mb-3">
                    <label className="form-label" htmlFor="sprintTitle">Sprint Title</label>
                    <input type="text" id="sprintTitle" name="sprintTitle" className="form-control" maxLength="32" required onChange={(e) => setSprint({...sprint, name: e.target.value })}/>
                </div>
                <div className="mb-3">
                    <label className="form-label" htmlFor="sprintStartDate">Sprint Start Date</label>
                    <input type="date" id="sprintStartDate" name="sprintStartDate" className="form-control" min={minDate.toISOString().split("T")[0]} required onChange={(e) => setSprint({...sprint, startDate: e.target.value })}/>
                </div>
                <div className="mb-3">
                    <label className="form-label" htmlFor="sprintDuration">Sprint Duration (weeks)</label>
                    <input type="number" id="sprintDuration" name="sprintDuration" className="form-control" required onChange={(e) => setSprint({...sprint, duration: e.target.value })}/>
                </div>
                <div className="mb-3">
                    <label className="form-label" htmlFor="sprintGoal">Sprint Goal</label>
                    <input type="text" id="sprintGoal" name="sprintGoal" className="form-control" required onChange={(e) => setSprint({...sprint, goal: e.target.value })}/>
                </div>
                <div className="d-flex justify-content-end">
                    <button type="submit" className="btn btn-primary">Create</button>
                </div>
            </form>
        </div>
    )
}