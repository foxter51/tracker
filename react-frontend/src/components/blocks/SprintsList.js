import React, { Fragment, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronDown, faTrash } from "@fortawesome/free-solid-svg-icons"
import SprintForm from "../forms/SprintForm"
import SprintBacklogContent from "./SprintBacklogContent"
import SprintModal from "../modals/SprintModal"
import UserService from "../../services/UserService"
import AuthService from "../../services/AuthService"
import ProjectService from "../../services/ProjectService"
import { useParams } from "react-router"
import SprintService from "../../services/SprintService"

export default function SprintsList({projectId, sprints, addSprint, removeSprint}) {

    const [activeSprint, setActiveSprint] = useState(null)
    const [showSprintForm, setShowSprintForm] = useState(false)

    const [selectedSprint, setSelectedSprint] = useState(null)
    const [showSprintModal, setShowSprintModal] = useState(false)

    const [isDeveloper, setIsDeveloper] = useState(false)

    const [removedSprintId, setRemovedSprintId] = useState(null)

    const { id } = useParams()

    useEffect(() => {
        const fetchIsDeveloper = async () => {
            const userResponse = await UserService.getUser(AuthService.getAuthUserId())
            const projectResponse = await ProjectService.getProject(id)

            setIsDeveloper(projectResponse.data.project.Team.userRoles.some(role => {
                return role.UserId === userResponse.data.user.id && role.RoleId === 3
            }))
        }
        fetchIsDeveloper()
    }, [id])

    useEffect(() => {
        if (removedSprintId) {
            removeSprint(removedSprintId)
            setRemovedSprintId(null)
        }
    }, [removeSprint, removedSprintId])

    const onSetActiveSprint = (sprint) => {
        sprint === activeSprint ? setActiveSprint(null) : setActiveSprint(sprint)
    }

    const onSubmitRemoveSprint = async (sprintId) => {
        try {
            setRemovedSprintId(sprintId)
            await SprintService.deleteSprint(sprintId)
        } catch (error) {
            console.log(error)
        }
    }

    const showModal = (sprint) => {
        setSelectedSprint(sprint)
        setShowSprintModal(true)
    }

    return (
        <div>
            <div className="card-header d-flex justify-content-between align-items-center">
                Sprints
                {!showSprintForm && isDeveloper &&
                    <button className="btn btn-primary" onClick={() => setShowSprintForm(true)}>
                        Create Sprint
                    </button>
                }
                {showSprintForm &&
                    <button className="btn btn-primary" onClick={() => setShowSprintForm(false)}>
                        Cancel
                    </button>
                }
            </div>

            <div className="card-body">
                {showSprintForm &&
                    <SprintForm
                        projectId={projectId}
                        setShowSprintForm={setShowSprintForm}
                        addSprint={addSprint}
                    />
                }

                <ul className="list-group">
                    {sprints
                        .sort((a, b) => {return Date.parse(a.startDate) - Date.parse(b.startDate)})
                        .map((sprint) => (
                            <Fragment key={sprint.id}>
                                <div className="list-group-item d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center">
                                        <Link to="" className="me-2">
                                            <FontAwesomeIcon icon={faChevronDown}
                                                             onClick={() => onSetActiveSprint(sprint)}
                                            />
                                        </Link>
                                        <Link to="" onClick={() => showModal(sprint)}>
                                            {sprint.name}
                                        </Link>
                                    </div>
                                    {isDeveloper &&
                                        <Link to="">
                                            <FontAwesomeIcon icon={faTrash}
                                                             onClick={() => onSubmitRemoveSprint(sprint.id)}
                                            />
                                        </Link>
                                    }
                                </div>
                                {activeSprint?.id === sprint.id &&
                                    <SprintBacklogContent
                                        sprint={sprint}
                                    />
                                }
                            </Fragment>
                        ))
                    }
                    {showSprintModal &&
                        <SprintModal
                            sprint={selectedSprint}
                            show={showSprintModal}
                            onClose={() => setShowSprintModal(false)}
                        />
                    }
                </ul>
            </div>
        </div>
    )
}