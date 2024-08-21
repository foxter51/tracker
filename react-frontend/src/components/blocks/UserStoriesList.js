import React, { Fragment, useEffect, useState } from "react"
import EpicUserStoryForm from "../forms/EpicUserStoryForm"
import statusColor from "../../utils/status_color"
import classNames from "classnames"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronDown, faTrash } from "@fortawesome/free-solid-svg-icons"
import { Link } from "react-router-dom"
import UserStoryModal from "../modals/UserStoryModal"
import SprintBacklogUserStoriesForm from "../forms/SprintBacklogUserStoriesForm"
import UserStoryService from "../../services/UserStoryService"
import UserStoryContent from "./UserStoryContent"
import ConfirmModal from "../modals/ConfirmModal"

// parent id may be Epic or SprintBacklog
export default function UserStoriesList({parentId, isProductOwner, isDeveloper, userStories, addUserStory, isSprintBacklogEdit, removeUserStory}) {

    const [activeUserStory, setActiveUserStory] = useState(null)
    const [showUserStoryForm, setShowUserStoryForm] = useState(false)

    const [showSprintBacklogUserStoryForm, setShowSprintBacklogUserStoryForm] = useState(false)

    const [selectedUserStory, setSelectedUserStory] = useState(null)
    const [showUserStoryModal, setShowUserStoryModal] = useState(false)

    const [showConfirmModalForProductBacklog, setShowConfirmModalForProductBacklog] = useState(false)
    const [showConfirmModalForSprintBacklog, setShowConfirmModalForSprintBacklog] = useState(false)
    const [userStoryToRemove, setUserStoryToRemove] = useState(0)

    const [removedUserStoryId, setRemovedUserStoryId] = useState(null)

    useEffect(() => {
        if (removedUserStoryId) {
            removeUserStory(removedUserStoryId)
            setRemovedUserStoryId(null)
        }
    }, [removeUserStory, removedUserStoryId])

    const onSetActiveUserStory = (userStory) => {
        userStory === activeUserStory ? setActiveUserStory(null) : setActiveUserStory(userStory)
    }

    const onSubmitRemoveUserStoryFromEpic = async () => {
        try {
            setShowConfirmModalForProductBacklog(false)
            setRemovedUserStoryId(userStoryToRemove)
            await UserStoryService.removeUserStory(userStoryToRemove)
            setUserStoryToRemove(0)
        } catch (err) {
            console.log(err)
        }
    }

    const onCancelRemoveUserStoryFromEpic = () => {
        setUserStoryToRemove(0)
        setShowConfirmModalForProductBacklog(false)
    }

    const onSubmitRemoveUserStoryFromSprintBacklog = async () => {
        try {
            setShowConfirmModalForSprintBacklog(false)
            setRemovedUserStoryId(userStoryToRemove)
            await UserStoryService.removeUserStoryFromSprintBacklog(userStoryToRemove)
            setUserStoryToRemove(0)
        } catch (err) {
            console.log(err)
        }
    }

    const onCancelRemoveUserStoryFromSprintBacklog = () => {
        setUserStoryToRemove(0)
        setShowConfirmModalForSprintBacklog(false)
    }

    const showModal = (userStory) => {
        setSelectedUserStory(userStory)
        setShowUserStoryModal(true)
    }

    return (
        <div>
            <div className="card-header d-flex justify-content-between align-items-center">
                User Stories
                {!isSprintBacklogEdit &&
                    <>
                        {isProductOwner && !showUserStoryForm &&
                            <button className="btn btn-primary" onClick={() => setShowUserStoryForm(true)}>
                                Create User Story
                            </button>
                        }
                        {isProductOwner && showUserStoryForm &&
                            <button className="btn btn-primary" onClick={() => setShowUserStoryForm(false)}>
                                Cancel
                            </button>
                        }
                    </>
                }
                {isSprintBacklogEdit && isDeveloper &&
                    <>
                        {!showSprintBacklogUserStoryForm &&
                            <button className="btn btn-primary" onClick={() => setShowSprintBacklogUserStoryForm(true)}>
                                Add User Stories
                            </button>
                        }
                        {showSprintBacklogUserStoryForm &&
                            <button className="btn btn-primary" onClick={() => setShowSprintBacklogUserStoryForm(false)}>
                                Cancel
                            </button>
                        }
                    </>
                }
            </div>
            <div className="card-body">
                {showUserStoryForm &&
                    <EpicUserStoryForm
                        epicId={parentId}
                        addUserStory={addUserStory}
                        setShowUserStoryForm={setShowUserStoryForm}
                    />
                }
                {showSprintBacklogUserStoryForm &&
                    <SprintBacklogUserStoriesForm
                        sprintBacklogId={parentId}
                        addUserStory={addUserStory}
                        setShowSprintBacklogUserStoryForm={setShowSprintBacklogUserStoryForm}
                    />
                }

                <ul className="list-group">
                    {userStories
                        .sort((a, b) => a.title.localeCompare(b.title))
                        .map((userStory) => (
                            <Fragment key={userStory.id}>
                                <div className="list-group-item d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center">
                                        <Link to="" className="me-2">
                                            <FontAwesomeIcon icon={faChevronDown}
                                                             onClick={() => onSetActiveUserStory(userStory)}
                                            />
                                        </Link>
                                        <Link to="" onClick={() => showModal(userStory)}>
                                            {userStory.title}
                                        </Link>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <div className={classNames(classNames(statusColor(userStory.status)),
                                            (isProductOwner || isDeveloper) ? "me-3" : "")}>
                                            {userStory.status}
                                        </div>
                                        {isProductOwner &&
                                            <Link to="">
                                                <FontAwesomeIcon icon={faTrash}
                                                                 onClick={() => {
                                                                     setUserStoryToRemove(userStory.id)
                                                                     setShowConfirmModalForProductBacklog(true)
                                                                 }}
                                                />
                                            </Link>
                                        }
                                        {isDeveloper &&
                                            <Link to="">
                                                <FontAwesomeIcon icon={faTrash}
                                                                 onClick={() => {
                                                                     setUserStoryToRemove(userStory.id)
                                                                     setShowConfirmModalForSprintBacklog(true)
                                                                 }}
                                                />
                                            </Link>
                                        }
                                    </div>
                                </div>
                                {activeUserStory?.id === userStory.id &&
                                    <UserStoryContent
                                        userStoryId={activeUserStory.id}
                                        isProductOwner={isProductOwner}
                                    />
                                }
                            </Fragment>
                        ))
                    }
                    {showUserStoryModal &&
                        <UserStoryModal
                            userStory={selectedUserStory}
                            show={showUserStoryModal}
                            onClose={() => setShowUserStoryModal(false)}
                        />
                    }
                    {showConfirmModalForProductBacklog &&
                        <ConfirmModal
                            showModal={showConfirmModalForProductBacklog}
                            onConfirm={onSubmitRemoveUserStoryFromEpic}
                            onCancel={onCancelRemoveUserStoryFromEpic}
                            question="Are you sure you want to delete this user story?"
                        />
                    }
                    {showConfirmModalForSprintBacklog &&
                        <ConfirmModal
                            showModal={showConfirmModalForSprintBacklog}
                            onConfirm={onSubmitRemoveUserStoryFromSprintBacklog}
                            onCancel={onCancelRemoveUserStoryFromSprintBacklog}
                            question="Are you sure you want to delete this user story?"
                        />
                    }
                </ul>
            </div>

        </div>
    )
}