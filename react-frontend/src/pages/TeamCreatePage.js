import React, { useState } from "react"
import TeamForm from "../components/forms/TeamForm"
import TeamMembersForm from "../components/forms/TeamMembersForm"
import TeamMembersRolesForm from "../components/forms/TeamMembersRolesForm"
import TeamPreview from "../components/forms/TeamPreview"

export default function TeamCreatePage() {

    const [team, setTeam] = useState(null)
    const [selectedUsers, setSelectedUsers] = useState([])
    const [showPreview, setShowPreview] = useState(false)

    return (
        <div>
            <div className="h1">Create Team</div>

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

            {showPreview && team.userRoles.length > 0 && <TeamPreview team={team}/>}
        </div>
    )
}