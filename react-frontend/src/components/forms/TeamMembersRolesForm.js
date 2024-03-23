import React from "react"
import { Multiselect } from "multiselect-react-dropdown"
import getStyledMultiselect from "../../utils/multiselect_style"

export default function TeamMembersRolesForm({ selectedUsers, selectedUserRoles, setSelectedUserRoles, onCancel, onSubmit }) {

    const roles = [
        {name: 'Product Owner', id: 1},
        {name: 'Scrum Master', id: 2},
        {name: 'Developer', id: 3}
    ]

    const onRoleSelect = (selectedList, selectedItem, userId) => {
        const existingUser = selectedUserRoles.find(ur => ur.userId === userId)

        if (existingUser) {
            setSelectedUserRoles(prev =>
                prev.map(ur =>
                    ur.userId === userId ? { ...ur, roleId: selectedItem.id } : ur
                )
            )
        } else {
            setSelectedUserRoles(prev => [
                ...prev,
                { userId, roleId: selectedItem.id }
            ])
        }
    }

    const onRoleRemove = (selectedList, removedItem, userId) => {
        setSelectedUserRoles(prev =>
            prev.filter(userRole => userRole.userId !== userId)
        )
    }

    return (
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
                                    selectedValues={selectedUserRoles
                                        .filter(ur => ur.userId === user.id)
                                        .map(ur => roles.find(r => r.id === ur.roleId))}
                                    singleSelect={true}
                                    onSelect={(selectedList, selectedItem) =>
                                        onRoleSelect(selectedList, selectedItem, user.id, user.username)
                                    }
                                    onRemove={(selectedList, removedItem) =>
                                        onRoleRemove(selectedList, removedItem, user.id)
                                    }
                                    displayValue="name"
                                    style={getStyledMultiselect()}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            { selectedUsers.length === selectedUserRoles.length &&
                <button className="btn btn-primary me-2" onClick={ onSubmit }>Save</button>
            }
            <button className="btn btn-danger" onClick={onCancel}>Cancel</button>
        </div>
    )
}