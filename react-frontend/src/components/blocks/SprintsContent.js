import React, { useEffect, useState } from "react"
import SprintService from "../../services/SprintService"
import LoadingEffect from "../effects/LoadingEffect"
import { useParams } from "react-router"
import SprintsList from "./SprintsList"

export default function SprintsContent() {

    const [sprints, setSprints] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const { id } = useParams()

    useEffect(() => {
        const fetchSprints = async () => {
            try {
                const response = await SprintService.getProjectSprints(id)
                setSprints(response.data.sprints)
                setLoading(false)
            } catch (error) {
                setError(error.response.data.message)
            }
        }
        fetchSprints()
    }, [id])

    const addSprint = (sprint) => {
        setSprints([...sprints, sprint])
    }

    const removeSprint = (sprintId) => {
        setSprints(prevState => prevState.filter(sprint => sprint.id !== sprintId))
    }

    if(loading){
        return <LoadingEffect/>
    }

    return (
        <div className="container p-2">
            <div className="card">
                <div className="text-danger">{ error }</div>
                <SprintsList
                    projectId={id}
                    sprints={sprints}
                    addSprint={addSprint}
                    removeSprint={removeSprint}
                />
            </div>
        </div>
    )
}