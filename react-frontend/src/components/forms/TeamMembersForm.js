import React, { useEffect, useState } from "react"
import { Multiselect } from "multiselect-react-dropdown"
import UserService from "../../services/UserService"

export default function TeamMembersForm({selectedUsers, setSelectedUsers}) {

    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
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
        getAllUsers()
    }, [])

    const onUserSelect = (selectedList, selectedItem) => {
        setSelectedUsers(prev => [...prev, selectedItem])
    }

    const onUserRemove = (selectedList, removedItem) => {
        setSelectedUsers(prev =>
            prev.filter(user => user.id !== removedItem.id)
        )
    }

    return (
        <div className="mb-5">
            <div className="h2">Add Team Members</div>
            <div>{error}</div>
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
    )
}