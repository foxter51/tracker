import React, { useEffect, useState } from "react"
import UserStoryService from "../../services/UserStoryService"
import { Multiselect } from "multiselect-react-dropdown"
import AuthService from "../../services/AuthService"
import getStyledMultiselect from "../../utils/multiselect_style"

export default function EpicUserStoryForm({epicId, setShowUserStoryForm, addUserStory}) {

    const [userStory, setUserStory] = useState(null)
    const [error, setError] = useState(null)
    const [save, setSave] = useState(false)

    useEffect(() => {
        if (save) {
            setShowUserStoryForm(false)
            setSave(false)
        }
    }, [save, setShowUserStoryForm])

    const priorityOptions = [
        {name: 'LOW'},
        {name: 'MEDIUM'},
        {name: 'HIGH'}
    ]

    const storyPointsOptions = [
        { name: 1 },
        { name: 2 },
        { name: 3 },
        { name: 5 },
        { name: 8 },
        { name: 13 }
    ]

    const statusOptions = [
        {name: 'TO DO'},
        {name: 'IN PROGRESS'},
        {name: 'IN REVIEW'},
        {name: 'DONE'}
    ]

    const onSubmitUserStory = async (e) => {
        e.preventDefault()
        try{
            const response = await UserStoryService.createUserStory({
                ...userStory,
                ownerId: AuthService.getAuthUserId(),
                epicId
            })
            addUserStory(response.data.userStory)
            setSave(true)
        } catch (error) {
            setError(error.response.data.message)
        }
    }

    return (
        <div className="mb-3">
            <div>
                <div className="h1">Create User Story</div>
            </div>
            <div className="text-danger">{ error }</div>
            <form onSubmit={onSubmitUserStory}>
                <div className="mb-3">
                    <label className="form-label" htmlFor="userStoryTitle">User Story Title</label>
                    <input type="text" id="userStoryTitle" name="userStoryTitle" className="form-control" minLength="3" maxLength="32" required onChange={(e) => setUserStory({...userStory, title: e.target.value })}/>
                </div>
                <div className="mb-3">
                    <label className="form-label" htmlFor="userStoryDescription">User Story Description</label>
                    <textarea id="userStoryDescription" name="userStoryDescription" className="form-control" minLength="3" maxLength="512" required onChange={(e) => setUserStory({...userStory, description: e.target.value })}/>
                </div>
                <div className="mb-3 row">
                    <div className="col">
                        User Story Priority
                    </div>
                    <div className="col">
                        <Multiselect
                            options={priorityOptions}
                            selectedValues={[]}
                            singleSelect="true"
                            onSelect={(selectedList, selectedItem) =>
                                setUserStory({...userStory, priority: selectedItem.name})
                            }
                            displayValue="name"
                            style={getStyledMultiselect()}
                        />
                    </div>
                </div>
                <div className="mb-3 row">
                    <div className="col">
                        User Story Story Points
                    </div>
                    <div className="col">
                        <Multiselect
                            options={storyPointsOptions}
                            selectedValues={[]}
                            singleSelect="true"
                            onSelect={(selectedList, selectedItem) =>
                                setUserStory({...userStory, storyPoints: selectedItem.name})
                            }
                            displayValue="name"
                            style={getStyledMultiselect()}
                        />
                    </div>
                </div>
                <div className="mb-3 row">
                    <div className="col">
                        User Story Status
                    </div>
                    <div className="col">
                        <Multiselect
                            options={statusOptions}
                            selectedValues={[]}
                            singleSelect="true"
                            onSelect={(selectedList, selectedItem) =>
                                setUserStory({...userStory, status: selectedItem.name})
                            }
                            displayValue="name"
                            style={getStyledMultiselect()}
                        />
                    </div>
                </div>
                <div className="d-flex justify-content-end">
                    <button type="submit" className="btn btn-primary">Create</button>
                </div>
            </form>
        </div>
    )
}