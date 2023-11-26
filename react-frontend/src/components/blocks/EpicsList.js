import React, { Fragment, useEffect, useState } from "react"
import EpicContent from "./EpicContent"
import EpicForm from "../forms/EpicForm"
import classNames from "classnames"
import statusColor from "../../utils/status_color"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronDown, faTrash } from "@fortawesome/free-solid-svg-icons"
import { Link } from "react-router-dom"
import EpicModal from "../modals/EpicModal"
import EpicService from "../../services/EpicService"
import ConfirmModal from "../modals/ConfirmModal"

export default function EpicList({productBacklogId, epics, addEpic, isProductOwner, removeEpic}) {
    const [activeEpic, setActiveEpic] = useState(null)
    const [showEpicForm, setShowEpicForm] = useState(false)

    const [selectedEpic, setSelectedEpic] = useState(null)
    const [showEpicModal, setShowEpicModal] = useState(false)

    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [epicToRemove, setEpicToRemove] = useState(0)

    const [removedEpicId, setRemovedEpicId] = useState(null)

    useEffect(() => {
        if (removedEpicId) {
            removeEpic(removedEpicId)
            setRemovedEpicId(null)
        }
    }, [removeEpic, removedEpicId])

    const onSetActiveEpic = (epic) => {
        epic === activeEpic ? setActiveEpic(null) : setActiveEpic(epic)
    }

    const onSubmitRemoveEpic = async () => {
        try {
            setShowConfirmModal(false)
            setRemovedEpicId(epicToRemove)
            await EpicService.removeEpic(epicToRemove)
            setEpicToRemove(0)
        } catch (err) {
            console.log(err)
        }
    }

    const onCancelRemoveEpic = () => {
        setEpicToRemove(0)
        setShowConfirmModal(false)
    }

    const onShowEpicModal = (epic) => {
        setSelectedEpic(epic)
        setShowEpicModal(true)
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
                            <Fragment key={epic.id}>
                                <div className="list-group-item d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center">
                                        <Link to="" className="me-2">
                                            <FontAwesomeIcon icon={faChevronDown}
                                                             onClick={() => onSetActiveEpic(epic)}
                                            />
                                        </Link>
                                        <Link to="" onClick={() => onShowEpicModal(epic)}>
                                            {epic.title}
                                        </Link>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <div className={classNames(classNames(statusColor(epic.status)),
                                            isProductOwner ? "me-3" : "")}>
                                            {epic.status}
                                        </div>
                                        {isProductOwner &&
                                           <Link to="">
                                               <FontAwesomeIcon icon={faTrash}
                                                                onClick={() => {
                                                                    setEpicToRemove(epic.id)
                                                                    setShowConfirmModal(true)
                                                                }}
                                               />
                                           </Link>
                                        }
                                    </div>
                                </div>
                                {activeEpic?.id === epic.id &&
                                    <EpicContent
                                        epicId={activeEpic.id}
                                        isProductOwner={isProductOwner}
                                    />
                                }
                            </Fragment>
                        ))
                    }
                    {showEpicModal &&
                        <EpicModal
                            epic={selectedEpic}
                            show={showEpicModal}
                            onClose={() => setShowEpicModal(false)}
                        />
                    }
                    {showConfirmModal &&
                        <ConfirmModal
                            showModal={showConfirmModal}
                            onConfirm={onSubmitRemoveEpic}
                            onCancel={onCancelRemoveEpic}
                            question="Are you sure you want to delete this epic?"
                        />
                    }
                </ul>
            </div>
        </div>
    )
}