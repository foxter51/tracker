import React, { Fragment, useEffect, useState } from "react"
import { Navigate, useParams } from "react-router"
import TeamService from "../services/TeamService"
import LoadingEffect from "../components/effects/LoadingEffect"
import authService from 'services/AuthService'
import { faDoorOpen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ConfirmModal from 'components/modals/ConfirmModal'
import { Link } from 'react-router-dom'
import TeamMembersForm from 'components/forms/TeamMembersForm'
import TeamMembersRolesForm from 'components/forms/TeamMembersRolesForm'

export default function TeamPage() {
    const [team, setTeam] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [isUserPresentInTeam, setIsUserPresentInTeam] = useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [authUserId, setAuthUserId] = useState(0)
    const [userToLeave, setUserToLeave] = useState(-1)

    const [editingEnabled, setEditingEnabled] = useState(false)
    const [usersToAdd, setUsersToAdd] = useState([])
    const [usersToAddRoles, setUsersToAddRoles] = useState([])

    const { id } = useParams()

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const response = await TeamService.getTeam(id)
                const selfId = authService.getAuthUserId()
                const isAuthUserPresentInTeam = response.data.team.userRoles.some(userRole => userRole.User.id === selfId)

                setTeam(response.data.team)
                setAuthUserId(selfId)
                setIsUserPresentInTeam(isAuthUserPresentInTeam)
                setLoading(false)
            } catch (error) {
                setError(error.response.data.message)
            }
        }

        fetchTeam()
    }, [id])

    const onUpdateTeam = async () => {
        try {
            setLoading(true)
            const updatedTeam = await TeamService.addTeamMembers(team.id, usersToAddRoles, authUserId)
            setTeam(updatedTeam.data.team)
            setEditingEnabled(false)
            setError(null)
        } catch (err) {
            console.log(err)
            setError(err.response.data.message)
        }
        setLoading(false)
    }

    const onSubmitDeleteUser = async () => {
        try {
            setShowConfirmModal(false)
            await TeamService.removeUserFromTeam(team.id, userToLeave)
            setUserToLeave(0)
        } catch (error) {
            setError(error.response.data.message)
        }
    }

    const onCancelDeleteUser = () => {
        setShowConfirmModal(false)
        setUserToLeave(-1)
    }

    if (userToLeave === 0) {
        return <Navigate to={ `/teams/my/${authUserId}` } />
    }

    if(loading){
        return <LoadingEffect/>
    }

    return (
        <div>
            <div className="d-flex align-items-center justify-content-between ">
                <div className="h2 me-2">Team: { team.name }</div>
                <div className="text-danger">{ error }</div>
                <div>
                    { isUserPresentInTeam &&
                        <Link to=""
                            className="text-danger text-decoration-none"
                            onClick={ () => {
                                setUserToLeave(authUserId)
                                setShowConfirmModal(true)
                            } }
                        >
                            <FontAwesomeIcon icon={ faDoorOpen } /> Leave the Team
                        </Link>
                    }
                </div>
            </div>
            { editingEnabled &&
                <div className="mb-2">
                    <TeamMembersForm
                        selectedUsers={ usersToAdd }
                        setSelectedUsers={ setUsersToAdd }
                        setSelectedUserRoles={ setUsersToAddRoles }
                        teamToUpdate={ team }
                    />
                    { usersToAdd.length > 0 &&
                        <TeamMembersRolesForm
                            selectedUsers={ usersToAdd }
                            selectedUserRoles={ usersToAddRoles }
                            setSelectedUserRoles={ setUsersToAddRoles }
                            onCancel={ () => setEditingEnabled(false) }
                            onSubmit={ onUpdateTeam }
                        />
                    }
                </div>
            }
            <div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="h4">Team Members</div>
                    { isUserPresentInTeam && team.userRoles.length < 8 &&
                        <Fragment>
                            { !editingEnabled &&
                                <button className="btn btn-primary" onClick={ () => setEditingEnabled(true) }>Add members</button>
                            }
                            { editingEnabled &&
                                <button className="btn btn-danger" onClick={ () => setEditingEnabled(false) }>Cancel</button>
                            }
                        </Fragment>
                    }
                </div>
                {team.userRoles.map(teamMember => (
                    <div className="card mb-1" key={teamMember.User.id}>
                        <div className="card-body">
                            <div className="row">
                                <Link to={`/users/${teamMember.User.id}`} className="col text-decoration-none">{teamMember.User.username}</Link>
                                <div className="col">{teamMember.Role.scrumRole}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            { showConfirmModal &&
                <ConfirmModal
                    showModal={ showConfirmModal }
                    onConfirm={ onSubmitDeleteUser }
                    onCancel={ onCancelDeleteUser }
                    question="Are you sure you want to leave the team?"
                />
            }
        </div>
    )
}