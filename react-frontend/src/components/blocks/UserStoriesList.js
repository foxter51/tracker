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

// parent id may be Epic or SprintBacklog
export default function UserStoriesList({parentId, isProductOwner, isDeveloper, userStories, addUserStory, isSprintBacklogEdit, removeUserStory}) {

    const [activeUserStory, setActiveUserStory] = useState(null)
    const [showUserStoryForm, setShowUserStoryForm] = useState(false)

    const [showSprintBacklogUserStoryForm, setShowSprintBacklogUserStoryForm] = useState(false)

    const [selectedUserStory, setSelectedUserStory] = useState(null)
    const [showUserStoryModal, setShowUserStoryModal] = useState(false)

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

    const onSubmitRemoveUserStoryFromEpic = async (userStoryId) => {
        try {
            setRemovedUserStoryId(userStoryId)
            await UserStoryService.removeUserStory(userStoryId)
        } catch (err) {
            console.log(err)
        }
    }

    const onSubmitRemoveUserStoryFromSprintBacklog = async (userStoryId) => {
        try {
            setRemovedUserStoryId(userStoryId)
            await UserStoryService.removeUserStoryFromSprintBacklog(userStoryId)
        } catch (err) {
            console.log(err)
        }
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
                                                                 onClick={() => onSubmitRemoveUserStoryFromEpic(userStory.id)}
                                                />
                                            </Link>
                                        }
                                        {isDeveloper &&
                                            <Link to="">
                                                <FontAwesomeIcon icon={faTrash}
                                                                 onClick={() => onSubmitRemoveUserStoryFromSprintBacklog(userStory.id)}
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
                </ul>
            </div>

        </div>
    )
}