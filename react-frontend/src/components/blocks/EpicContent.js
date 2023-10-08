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
            } catch (error) {
                console.log(error)
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

    return (
        <div className="container p-2">
            <div className="card">
                <UserStoriesList
                    epicId={epicId}
                    isProductOwner={isProductOwner}
                    userStories={userStories}
                    addUserStory={addUserStory}
                />
            </div>
        </div>
    )
}