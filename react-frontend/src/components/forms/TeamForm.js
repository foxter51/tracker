import React, { useState } from "react"
import TeamService from "../../services/TeamService"

export default function TeamForm({setTeam}) {

    const [error, setError] = useState(null)

    const onSubmitTeam = async (e) => {
        e.preventDefault()
        try{
            const teamName = e.target.elements.teamName.value
            const response = await TeamService.createTeam({
                name: teamName
            })
            setTeam(response.data.team)
        } catch (error) {
            setError(error.response.data.message)
        }
    }

    return (
        <>
            <div>{error}</div>
            <form onSubmit={onSubmitTeam}>
                <div className="form-outline mb-2">
                    <label className="form-label" htmlFor="teamName">Team Name</label>
                    <input type="text" id="teamName" name="teamName" className="form-control" maxLength="32" required/>
                </div>
                <button type="submit" className="btn btn-primary">Next</button>
            </form>
        </>
    )
}