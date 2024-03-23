import React, { useState } from "react"
import TeamForm from "../components/forms/TeamForm"
import TeamMembersForm from "../components/forms/TeamMembersForm"
import TeamMembersRolesForm from "../components/forms/TeamMembersRolesForm"
import TeamService from "../services/TeamService"
import { Navigate } from "react-router"
import LoadingEffect from "../components/effects/LoadingEffect"
import authService from "services/AuthService"

export default function TeamCreatePage() {

    const [team, setTeam] = useState(null)
    const [selectedUsers, setSelectedUsers] = useState([])
    const [selectedUserRoles, setSelectedUserRoles] = useState([])

    const [cancel, setCancel] = useState(false)
    const [saved, setSaved] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const onSubmitTeam = async () => {
        try {
            setLoading(true)
            const response = await TeamService.createTeam(team, selectedUserRoles, authService.getAuthUserId())
            setTeam(response.data.team)
            setSaved(true)
        } catch (err) {
            console.log(err)
            setError(err.response.data.message)
        }
        setLoading(false)
    }

    const onCancel = async () => {
        setCancel(true)
    }

    if (cancel) {
        return <Navigate to="/" />
    }

    if (saved) {
        return <Navigate to={`/teams/${team.id}`} />
    }

    if (loading) {
        return <LoadingEffect />
    }

    return (
        <div>
            <div className="h1">Create Team</div>

            {!team && <TeamForm setTeam={setTeam}/>}

            {team && <div>Team created: {team.name}</div>}

            <div className="text-danger">{ error }</div>

            {team &&
                <TeamMembersForm
                    selectedUsers={selectedUsers}
                    setSelectedUsers={setSelectedUsers}
                    setSelectedUserRoles={setSelectedUserRoles}
                    />
            }

            {selectedUsers.length > 0 &&
                <TeamMembersRolesForm selectedUsers={selectedUsers}
                                      selectedUserRoles={selectedUserRoles}
                                      setSelectedUserRoles={setSelectedUserRoles}
                                      onCancel={onCancel}
                                      onSubmit={onSubmitTeam}
                                      />
            }
        </div>
    )
}