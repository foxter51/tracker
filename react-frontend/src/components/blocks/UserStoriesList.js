import React, { useState } from "react"
import UserStoryForm from "../forms/UserStoryForm"
import statusColor from "../../utils/status_color"
import classNames from "classnames"
import UserStoryContent from "./UserStoryContent"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronDown } from "@fortawesome/free-solid-svg-icons"
import { Link } from "react-router-dom"
import UserStoryModal from "../modals/UserStoryModal"

export default function UserStoriesList({epicId, isProductOwner, userStories, addUserStory}) {

    const [activeUserStory, setActiveUserStory] = useState(null)
    const [showUserStoryForm, setShowUserStoryForm] = useState(false)

    const [selectedUserStory, setSelectedUserStory] = useState(null)
    const [showUserStoryModal, setShowUserStoryModal] = useState(false)

    const onSetActiveUserStory = (userStory) => {
        userStory === activeUserStory ? setActiveUserStory(null) : setActiveUserStory(userStory)
    }

    const showModal = (userStory) => {
        setSelectedUserStory(userStory)
        setShowUserStoryModal(true)
    }

    return (
        <div>
            <div className="card-header d-flex justify-content-between align-items-center">
                User Stories
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
            </div>
            <div className="card-body">
                {showUserStoryForm &&
                    <UserStoryForm
                        epicId={epicId}
                        addUserStory={addUserStory}
                        setShowUserStoryForm={setShowUserStoryForm}
                    />
                }

                <ul className="list-group">
                    {userStories
                        .sort((a, b) => a.title.localeCompare(b.title))
                        .map((userStory) => (
                            <>
                                <div key={userStory.id}
                                     className="list-group-item d-flex justify-content-between align-items-center"
                                >
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
                                    <div className={classNames( statusColor(userStory.status))}>
                                        {userStory.status}
                                    </div>
                                </div>
                                {activeUserStory?.id === userStory.id &&
                                    <UserStoryContent
                                        userStoryId={activeUserStory.id}
                                        isProductOwner={isProductOwner}
                                    />
                                }
                            </>
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