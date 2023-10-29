import React, { useState } from "react"
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronDown } from "@fortawesome/free-solid-svg-icons"
import SprintForm from "../forms/SprintForm"
import SprintBacklogContent from "./SprintBacklogContent"
import SprintModal from "../modals/SprintModal"

export default function SprintsList({projectId, sprints, addSprint}) {

    const [activeSprint, setActiveSprint] = useState(null)
    const [showSprintForm, setShowSprintForm] = useState(false)

    const [selectedSprint, setSelectedSprint] = useState(null)
    const [showSprintModal, setShowSprintModal] = useState(false)

    const onSetActiveSprint = (sprint) => {
        sprint === activeSprint ? setActiveSprint(null) : setActiveSprint(sprint)
    }

    const showModal = (sprint) => {
        setSelectedSprint(sprint)
        setShowSprintModal(true)
    }

    return (
        <div>
            <div className="card-header d-flex justify-content-between align-items-center">
                Sprints
                {!showSprintForm &&
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
                            <>
                                <div key={sprint.id}
                                     className="list-group-item d-flex justify-content-between align-items-center"
                                >
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
                                </div>
                                {activeSprint?.id === sprint.id &&
                                    <SprintBacklogContent
                                        sprint={sprint}
                                    />
                                }
                            </>
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