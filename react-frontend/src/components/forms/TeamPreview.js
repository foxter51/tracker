import React, { useState } from "react"
import teamService from "../../services/TeamService"
import { Navigate } from "react-router"

export default function TeamPreview({team}) {

    const [cancel, setCancel] = useState(false)
    const [save, setSave] = useState(false)
    const [error, setError] = useState(null)

    const onCancel = async () => {
        try{
            setCancel(true)
            await teamService.deleteTeam(team.id)
        } catch (error) {
            setError(error.response.data.message)
        }
    }

    window.addEventListener("beforeunload", onCancel)

    const onSave = () => {
        setSave(true)
    }

    if(cancel){
        return <Navigate to="/"/>
    }

    if(save){
        return <Navigate to={`/teams/${team.id}`}/>
    }

    return(
        <div>
            <div className="h2">Team Members</div>
            <div>{error}</div>
            {team.userRoles.map(teamMember => (
                <div className="card mb-1">
                    <div className="card-body">
                        <div className="row">
                            <div className="col">{teamMember.User.username}</div>
                            <div className="col">{teamMember.Role.scrumRole}</div>
                        </div>
                    </div>
                </div>
            ))}
            <button className="btn btn-primary" onClick={onSave}>Save</button>
            <button className="btn btn-danger" onClick={onCancel}>Cancel</button>
        </div>
    )
}