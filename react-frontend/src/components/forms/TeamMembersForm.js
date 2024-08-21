import React, { useEffect, useState } from "react"
import { Multiselect } from "multiselect-react-dropdown"
import UserService from "../../services/UserService"
import getStyledMultiselect from "../../utils/multiselect_style"

export default function TeamMembersForm({ selectedUsers, setSelectedUsers, setSelectedUserRoles, teamToUpdate }) {

    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const [teamToUpdateUsersCount, setTeamToUpdateUsersCount] = useState(0)

    useEffect(() => {
        const getAllUsers = async () => {
            try{
                setLoading(true)

                let response

                if (teamToUpdate !== null) {
                    const teamMembersIds = teamToUpdate.userRoles.map(userRole => userRole.User.id)
                    setTeamToUpdateUsersCount(teamMembersIds.length)

                    response = await UserService.getAllUsers(teamMembersIds)
                } else response = await UserService.getAllUsers()

                setUsers(response.data.users)
            } catch (error) {
                setError(error.response.data.message)
            }
            setLoading(false)
        }
        getAllUsers()
    }, [])

    const onUserSelect = (selectedList, selectedItem) => {
        setSelectedUsers(prev => [...prev, selectedItem])
    }

    const onUserRemove = (selectedList, removedItem) => {
        setSelectedUserRoles(prev => {
            return prev.filter(userRole => userRole.userId !== removedItem.id)
        })
        setSelectedUsers(prev =>
            prev.filter(user => user.id !== removedItem.id)
        )
    }

    return (
        <div className="mb-5">
            <div className="h2">Add Team Members</div>
            <div className="text-danger">{ error }</div>
            <Multiselect
                options={users}
                selectedValues={selectedUsers}
                selectionLimit={8 - teamToUpdateUsersCount}
                loading={loading}
                onSelect={onUserSelect}
                onRemove={onUserRemove}
                displayValue="username"
                style={getStyledMultiselect()}
            />
        </div>
    )
}