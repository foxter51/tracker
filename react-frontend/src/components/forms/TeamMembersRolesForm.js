import React, { useState } from "react"
import { Multiselect } from "multiselect-react-dropdown"
import UserRoleService from "../../services/UserRoleService"
import TeamService from "../../services/TeamService"
import LoadingEffect from "../effects/LoadingEffect"

export default function TeamMembersRolesForm({selectedUsers, team, setTeam, setShowPreview}) {

    const [selectedUserRoles, setSelectedUserRoles] = useState({})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const roles = [
        {name: 'Product Owner', id: 1},
        {name: 'Scrum Master', id: 2},
        {name: 'Developer', id: 3}
    ]

    const onRoleSelect = (selectedList, selectedItem, userId) => {
        setSelectedUserRoles(prev => ({
            ...prev,
            [userId]: {userId, roleId: selectedItem.id, teamId: team.id}
        }))
        setError(null)
    }

    const onSubmitTeamMembers = async (e) => {
        e.preventDefault()
        try{
            setLoading(true)
            const userRoleEntries = Object.entries(selectedUserRoles).map(([userId, {roleId, teamId}]) => ({
                userId,
                roleId,
                teamId
            }))
            await UserRoleService.createTeamMembers(userRoleEntries)
            const response = await TeamService.getTeam(team.id)
            setTeam(response.data.team)
            setShowPreview(true)
        } catch (error) {
            setError(error.response.data.message)
        }
        setLoading(false)
    }

    if(loading) {
        return <LoadingEffect/>
    }

    return (
        <div>
            <div className="h2">Selected Team Members</div>
            <div>{error}</div>
            {selectedUsers.map(user => (
                <div className="card mb-1">
                    <div className="card-body">
                        <div className="row">
                            <div className="col">{user.username}</div>
                            <div className="col">
                                <Multiselect
                                    options={roles}
                                    selectedValues={[]}
                                    singleSelect="true"
                                    onSelect={(selectedList, selectedItem) =>
                                        onRoleSelect(selectedList, selectedItem, user.id)
                                    }
                                    displayValue="name"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            <button className="btn btn-primary" onClick={onSubmitTeamMembers}>Next</button>
        </div>
    )
}