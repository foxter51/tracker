import React, { useState } from "react"
import TeamForm from "../components/forms/TeamForm"
import TeamMembersForm from "../components/forms/TeamMembersForm"
import TeamMembersRolesForm from "../components/forms/TeamMembersRolesForm"
import TeamPreviewContent from "../components/blocks/TeamPreviewContent"
import teamService from "../services/TeamService"
import { Navigate } from "react-router"

export default function TeamCreatePage() {

    const [team, setTeam] = useState(null)
    const [selectedUsers, setSelectedUsers] = useState([])
    const [showPreview, setShowPreview] = useState(false)

    const [cancel, setCancel] = useState(false)
    const [save, setSave] = useState(false)
    const [error, setError] = useState(null)

    // TODO fix delete team on page close

    const onCancel = async () => {
        try{
            setCancel(true)
            await teamService.deleteTeam(team.id)
        } catch (error) {
            setError(error.response.data.message)
        }
    }

    const onSave = () => {
        setSave(true)
    }

    if(cancel){
        return <Navigate to="/"/>
    }

    if(save){
        return <Navigate to={`/teams/${team.id}`}/>
    }

    return (
        <div>
            <div className="h1">Create Team</div>

            <div>{error}</div>

            {!team && <TeamForm setTeam={setTeam}/>}

            {team && <div className="mb-5">Team created: {team.name}</div>}

            {team && !team.userRoles &&
                <TeamMembersForm
                    selectedUsers={selectedUsers}
                    setSelectedUsers={setSelectedUsers}/>
            }

            {selectedUsers.length > 0 && !showPreview &&
                <TeamMembersRolesForm selectedUsers={selectedUsers}
                                      team={team}
                                      setTeam={setTeam}
                                      setShowPreview={setShowPreview}/>
            }

            {showPreview && team.userRoles.length > 0 &&
                <TeamPreviewContent
                    team={team}
                    onSave={onSave}
                    onCancel={onCancel}
                />
            }
        </div>
    )
}