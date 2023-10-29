import React, { useEffect, useState } from "react"
import SprintBacklogService from "../../services/SprintBacklogService"
import { Multiselect } from "multiselect-react-dropdown"
import LoadingEffect from "../effects/LoadingEffect"
import UserStoryService from "../../services/UserStoryService"
import { useParams } from "react-router"

export default function SprintBacklogUserStoriesForm({sprintBacklogId, addUserStory, setShowSprintBacklogUserStoryForm}) {

    const [userStories, setUserStories] = useState([])
    const [selectedUserStories, setSelectedUserStories] = useState([])

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [save, setSave] = useState(false)

    const { id } = useParams()

    useEffect(() => {
        const fetchUserStories = async () => {
            try{
                const response = await UserStoryService.getProjectUserStories(id)
                setUserStories(response.data.userStories)
                setLoading(false)
            } catch (error) {
                setError(error.response.data.message)
            }
        }
        fetchUserStories()
    }, [id])

    const onSubmitUserStories = async (e) => {
        e.preventDefault()
        try{
            const response = await SprintBacklogService.addUserStories(sprintBacklogId, selectedUserStories)
            addUserStory(response.data.userStories)
            setSave(true)
        } catch (error) {
            setError(error.response.data.message)
        }
    }

    const onUserStorySelect = (selectedList, selectedItem) => {
        setSelectedUserStories(prev => [...prev, selectedItem.id])
    }

    const onUserStoryRemove = (selectedList, removedItem) => {
        setSelectedUserStories(prev =>
            prev.filter(userStory => userStory !== removedItem.id)
        )
    }

    if(loading) {
        return <LoadingEffect/>
    }

    if(save) {
        setShowSprintBacklogUserStoryForm(false)
    }

    return (
        <div className="mb-3">
            <div>
                <div className="h1">Add User Stories</div>
                {error}
            </div>
            <div>{error}</div>
            <form onSubmit={onSubmitUserStories}>
                <div className="mb-3">
                    <Multiselect
                        options={userStories}
                        selectedValues={setSelectedUserStories}
                        onSelect={onUserStorySelect}
                        onRemove={onUserStoryRemove}
                        displayValue="title"
                    />
                </div>
                <button className="btn btn-primary" type="submit">Add User Stories</button>
            </form>
        </div>
    )
}