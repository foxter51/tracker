import React, { useEffect, useState } from "react"
import { useParams } from "react-router"
import teamService from "../services/TeamService"
import LoadingEffect from "../components/effects/LoadingEffect"

export default function TeamPage() {
    const [team, setTeam] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const { id } = useParams()

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const response = await teamService.getTeam(id)
                setTeam(response.data.team)
                setLoading(false)
            } catch (error) {
                setError(error.response.data.message)
            }
        }

        fetchTeam()
    }, [id])

    if(loading){
        return <LoadingEffect/>
    }

    return (
        <div>
            <div className="h2">Team: {team.name}</div>
            <div>
                <div className="h4">Team Members</div>
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
            </div>
        </div>
    )
}