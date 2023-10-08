import React, { useState } from "react"
import UserStoryForm from "../forms/UserStoryForm"
import statusColor from "../../utils/status_color"
import classNames from "classnames"

export default function UserStoriesList({epicId, isProductOwner, userStories, addUserStory}) {

    const [showUserStoryForm, setShowUserStoryForm] = useState(false)

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
                            <div key={userStory.id}
                                 className="list-group-item d-flex justify-content-between align-items-center">
                                <div>
                                    {userStory.title}
                                </div>
                                <div className={classNames( statusColor(userStory.status))}>
                                    {userStory.status}
                                </div>
                            </div>
                        ))}
                </ul>
            </div>

        </div>
    )
}