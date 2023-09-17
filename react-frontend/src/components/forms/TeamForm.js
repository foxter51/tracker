import React, { useState } from "react"
import TeamService from "../../services/TeamService"
import UserService from "../../services/UserService"
import { Multiselect } from "multiselect-react-dropdown"
import LoadingEffect from "../effects/LoadingEffect"
import UserRoleService from "../../services/UserRoleService"
import { Navigate } from "react-router"
import teamService from "../../services/TeamService"

export default function TeamForm() {
    const [team, setTeam] = useState(null)
    const [users, setUsers] = useState([])
    const [selectedUsers, setSelectedUsers] = useState([])
    const roles =[
        {name: 'Product Owner', id: 1},
        {name: 'Scrum Master', id: 2},
        {name: 'Developer', id: 3}
    ]
    const [selectedUserRoles, setSelectedUserRoles] = useState({})
    const [showMembers, setShowMembers] = useState(false)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [cancel, setCancel] = useState(false)
    const [save, setSave] = useState(false)

    const onSubmitTeam = async (e) => {
        e.preventDefault()
        try{
            const teamName = e.target.elements.teamName.value
            const response = await TeamService.createTeam({
                name: teamName
            })
            setTeam(response.data.team)
            await getAllUsers()
        } catch (error) {
            setError(error.response.data.message)
        }
    }

    const getAllUsers = async () => {
        try{
            setLoading(true)
            const response = await UserService.getAllUsers()
            setUsers(response.data.users)
        } catch (error) {
            setError(error.response.data.message)
        }
        setLoading(false)
    }

    const onUserSelect = (selectedList, selectedItem) => {
        setSelectedUsers(prev => [...prev, selectedItem])
    }

    const onUserRemove = (selectedList, removedItem) => {
        setSelectedUsers(prev =>
            prev.filter(user => user.id !== removedItem.id)
        )
    }

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
            setShowMembers(true)
        } catch (error) {
            setError(error.response.data.message)
        }
        setLoading(false)
    }

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

    if(loading) {
        return <LoadingEffect/>
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

            {!team &&
                <form onSubmit={onSubmitTeam}>
                    <div>{error}</div>
                    <div className="form-outline">
                        <label className="form-label" htmlFor="teamName">Team Name</label>
                        <input type="text" id="teamName" name="teamName" className="form-control" maxLength="32" required/>
                    </div>
                    <button type="submit" className="btn btn-primary">Next</button>
                </form>
            }
            {team && <div className="mb-5">Team created: {team.name}</div>}

            {team && !team.userRoles &&
                <div className="mb-5">
                    <div className="h2">Add Team Members</div>
                    <Multiselect
                        options={users}
                        selectedValues={selectedUsers}
                        selectionLimit="8"
                        loading={loading}
                        onSelect={onUserSelect}
                        onRemove={onUserRemove}
                        displayValue="username"
                    />
                </div>
            }

            {selectedUsers.length > 0 && !showMembers &&
                <div>
                    <div className="h2">Selected Team Members</div>
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
            }

            {showMembers && team.userRoles.length > 0 &&
                <div>
                    <div className="h2">Team Members</div>
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
            }
        </div>
    )
}