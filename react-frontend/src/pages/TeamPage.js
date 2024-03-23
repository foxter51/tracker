import React, { useEffect, useState } from "react"
import { Navigate, useParams } from "react-router"
import teamService from "../services/TeamService"
import LoadingEffect from "../components/effects/LoadingEffect"
import authService from 'services/AuthService'
import { faDoorOpen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ConfirmModal from 'components/modals/ConfirmModal'
import { Link } from 'react-router-dom'

export default function TeamPage() {
    const [team, setTeam] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [isUserPresentInTeam, setIsUserPresentInTeam] = useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [authUserId, setAuthUserId] = useState(0)
    const [userToLeave, setUserToLeave] = useState(-1)

    const { id } = useParams()

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const response = await teamService.getTeam(id)
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

    const onSubmitDelete = async () => {
        try {
            setShowConfirmModal(false)
            setUserToLeave(0)
            await teamService.removeUserFromTeam(team.id, userToLeave)
        } catch (error) {
            setError(error.response.data.message)
        }
    }

    const onCancelDelete = () => {
        setUserToLeave(-1)
        setShowConfirmModal(false)
    }

    if (userToLeave === 0) {
        return <Navigate to={`/teams/my/${authUserId}`} />
    }

    if(loading){
        return <LoadingEffect/>
    }

    return (
        <div>
            <div className="text-danger">{ error }</div>
            <div className="d-flex align-items-center">
                <div className="h2 me-2">Team: { team.name }</div>
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
            <div>
                <div className="h4">Team Members</div>
                {team.userRoles.map(teamMember => (
                    <div className="card mb-1">
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
                    onConfirm={ onSubmitDelete }
                    onCancel={ onCancelDelete }
                    question="Are you sure you want to leave the team?"
                />
            }
        </div>
    )
}