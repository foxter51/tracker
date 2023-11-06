import React, { useEffect, useState } from "react"
import { Multiselect } from "multiselect-react-dropdown"
import TeamService from "../../services/TeamService"

export default function ProjectTeamForm({project, setProject}) {

    const [teams, setTeams] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        const getAllTeams = async () => {
            try{
                setLoading(true)
                const response = await TeamService.getAllTeams()
                setTeams(response.data.teams)
            } catch (error) {
                setError(error.response.data.message)
            }
            setLoading(false)
        }
        getAllTeams()
    }, [])

    return (
        <div className="mb-3">
            <div className="h2">Select Project Team</div>
            <div>{error}</div>
            <Multiselect
                options={teams}
                selectedValues={[]}
                singleSelect="true"
                loading={loading}
                onSelect={(selectedList, selectedItem) =>
                    setProject({...project, teamId: selectedItem.id})
                }
                displayValue="name"
            />
        </div>
    )
}