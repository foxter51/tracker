import React, { useEffect, useState } from "react"
import userService from "../services/UserService"
import { useParams } from "react-router"
import LoadingEffect from "../components/effects/LoadingEffect"
import UserTeamsList from "../components/blocks/UserTeamsList"

export default function UserTeamsPage() {

    const [teams, setTeams] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    const { id } = useParams()

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await userService.getUser(id)
                setTeams(response.data.user.Teams)
            } catch (error) {
                setError(error.response.data.message);
            }
            setLoading(false)
        }
        fetchUser()
    }, [id])

    if(loading){
        return <LoadingEffect/>
    }

    return (
        <div className="container d-flex justify-content-center">
            <div style={{marginRight: "auto"}}>
                <div className="h1">My Teams</div>
                <div className="text-danger">{ error }</div>
            </div>
            <UserTeamsList teams={teams}/>
        </div>
    )
}