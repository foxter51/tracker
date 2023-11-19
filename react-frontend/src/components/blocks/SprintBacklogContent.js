import React, { useEffect, useState } from "react"
import SprintBacklogService from "../../services/SprintBacklogService"
import LoadingEffect from "../effects/LoadingEffect"
import UserStoriesList from "./UserStoriesList"

export default function SprintBacklogContent({sprint}) {

    const [sprintBacklogId, setSprintBacklogId] = useState(null)
    const [userStories, setUserStories] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUserStories = async () => {
            try {
                const response = await SprintBacklogService.getSprintBacklog(sprint.id)
                setSprintBacklogId(response.data.sprintBacklog.id)
                setUserStories(response.data.sprintBacklog.userStories)
                setLoading(false)
            } catch (err) {
                console.log(err)
            }
        }
        fetchUserStories()
    }, [sprint.id])

    const addUserStories = (newUserStories) => {
        setUserStories([...userStories, ...newUserStories])
    }

    if(loading){
        return <LoadingEffect/>
    }

    return (
        <div className="container p-2">
            <div className="card">
                <UserStoriesList
                    parentId={sprintBacklogId}
                    isProductOwner={false}
                    userStories={userStories}
                    addUserStory={addUserStories}
                    isSprintBacklogEdit={true}
                />
            </div>
        </div>
    )
}