import React, { useState } from "react"
import EpicContent from "./EpicContent"
import EpicForm from "../forms/EpicForm"
import classNames from "classnames"
import statusColor from "../../utils/status_color"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronDown } from "@fortawesome/free-solid-svg-icons"
import { Link } from "react-router-dom"

export default function EpicList({productBacklogId, epics, addEpic, isProductOwner}) {
    const [activeEpic, setActiveEpic] = useState(null)
    const [showEpicForm, setShowEpicForm] = useState(false)

    const onSetActiveEpic = (epic) => {
        epic === activeEpic ? setActiveEpic(null) : setActiveEpic(epic)
    }

    return (
        <div>
            <div className="card-header d-flex justify-content-between align-items-center">
                Epics
                {isProductOwner && !showEpicForm &&
                    <button className="btn btn-primary" onClick={() => setShowEpicForm(true)}>
                        Create Epic
                    </button>
                }
                {isProductOwner && showEpicForm &&
                    <button className="btn btn-primary" onClick={() => setShowEpicForm(false)}>
                        Cancel
                    </button>
                }
            </div>

            <div className="card-body">
                {showEpicForm &&
                    <EpicForm
                        productBacklogId={productBacklogId}
                        setShowEpicForm={setShowEpicForm}
                        addEpic={addEpic}
                    />
                }

                <ul className="list-group">
                    {epics
                        .sort((a, b) => a.title.localeCompare(b.title))
                        .map((epic) => (
                            <>
                                <div key={epic.id}
                                     className="list-group-item d-flex justify-content-between align-items-center"
                                >
                                    <div className="d-flex align-items-center">
                                        <Link to="" className="me-2">
                                            <FontAwesomeIcon icon={faChevronDown}
                                                             onClick={() => onSetActiveEpic(epic)}
                                            />
                                        </Link>
                                        <div>
                                            {epic.title}
                                        </div>
                                    </div>
                                    <div className={classNames( statusColor(epic.status))}>
                                        {epic.status}
                                    </div>
                                </div>
                                {activeEpic?.id === epic.id &&
                                    <EpicContent
                                        epicId={activeEpic.id}
                                        isProductOwner={isProductOwner}
                                    />
                                }
                            </>
                        ))}
                </ul>
            </div>
        </div>
    )
}