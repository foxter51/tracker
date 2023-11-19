import React, { useEffect, useState } from "react"
import UserStoriesList from "./UserStoriesList"
import UserStoryService from "../../services/UserStoryService"
import LoadingEffect from "../effects/LoadingEffect"

export default function EpicContent({epicId, isProductOwner}) {

    const [userStories, setUserStories] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUserStories = async () => {
            try {
                const response = await UserStoryService.getEpicUserStories(epicId)
                setUserStories(response.data.userStories)
                setLoading(false)
            } catch (err) {
                console.log(err)
            }
        }
        fetchUserStories()
    }, [epicId])

    if(loading){
        return <LoadingEffect/>
    }

    const addUserStory = (userStory) => {
        setUserStories([...userStories, userStory])
    }

    const removeUserStory = (userStoryId) => {
        setUserStories(prevState => prevState.filter(us => us.id !== userStoryId))
    }

    return (
        <div className="container p-2">
            <div className="card">
                <UserStoriesList
                    parentId={epicId}
                    isProductOwner={isProductOwner}
                    isDeveloper={false}
                    userStories={userStories}
                    addUserStory={addUserStory}
                    isSprintBacklogEdit={false}
                    removeUserStory={removeUserStory}
                />
            </div>
        </div>
    )
}