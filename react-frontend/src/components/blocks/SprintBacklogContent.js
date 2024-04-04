import React, { useEffect, useState } from "react"
import SprintBacklogService from "../../services/SprintBacklogService"
import LoadingEffect from "../effects/LoadingEffect"
import UserStoriesList from "./UserStoriesList"
import { useParams } from "react-router"
import UserService from "../../services/UserService"
import AuthService from "../../services/AuthService"
import ProjectService from "../../services/ProjectService"
import { socket } from "../../utils/socket"

export default function SprintBacklogContent({sprint}) {

    const [sprintBacklogId, setSprintBacklogId] = useState(null)
    const [userStories, setUserStories] = useState([])
    const [isDeveloper, setIsDeveloper] = useState(false)
    const [loading, setLoading] = useState(true)

    const { id } = useParams()

    useEffect(() => {
        const fetchUserStories = async () => {
            try {
                const sprintBacklogResponse = await SprintBacklogService.getSprintBacklog(sprint.id)
                setSprintBacklogId(sprintBacklogResponse.data.sprintBacklog.id)
                setUserStories(sprintBacklogResponse.data.sprintBacklog.userStories)

                const userResponse = await UserService.getUser(AuthService.getAuthUserId())
                const projectResponse = await ProjectService.getProject(id)

                setIsDeveloper(projectResponse.data.project.Team.userRoles.some(role => {
                    return role.UserId === userResponse.data.user.id && role.RoleId === 3
                }))

                setLoading(false)
            } catch (err) {
                console.log(err)
            }
        }
        fetchUserStories()
    }, [id, sprint.id])

    useEffect(() => {
        socket.on('task update', (data) => {
            const updatedUserStory = userStories.find(us => us.id === data.userStoryId)
            if (updatedUserStory) {
                updatedUserStory.status = data.userStoryStatus

                setUserStories(prevUserStories => {
                    return prevUserStories.map(us => {
                        if (us.id === updatedUserStory.id) {
                            return updatedUserStory
                        }
                        return us
                    })
                })
            }

            return () => {
                socket.off('user story update')
            }
        })
    })

    const addUserStories = (newUserStories) => {
        setUserStories([...userStories, ...newUserStories])
    }

    const removeUserStory = (userStoryId) => {
        setUserStories(prevState => prevState.filter(userStory => userStory.id !== userStoryId))
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
                    isDeveloper={isDeveloper}
                    userStories={userStories}
                    addUserStory={addUserStories}
                    isSprintBacklogEdit={true}
                    removeUserStory={removeUserStory}
                />
            </div>
        </div>
    )
}