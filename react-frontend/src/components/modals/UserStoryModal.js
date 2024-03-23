import { Modal } from "react-bootstrap"
import classNames from "classnames"
import statusColor from "../../utils/status_color"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGripLines } from "@fortawesome/free-solid-svg-icons/faGripLines"
import priorityColor from "../../utils/priority_color"
import { Link } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import UserService from "../../services/UserService"
import LoadingEffect from "../effects/LoadingEffect"
import { ThemeContext } from "../effects/Theme"

export default function UserStoryModal({userStory, show, onClose}) {

    const {theme} = useContext(ThemeContext)

    const [userStoryOwner, setUserStoryOwner] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchUserStoryOwner = async () => {
            try {
                const response = await UserService.getUser(userStory.ownerId)
                setUserStoryOwner(response.data.user)
                setLoading(false)
            } catch (error) {
                setError(error.response.data.message)
            }
        }
        fetchUserStoryOwner()
    }, [userStory.ownerId])

    if(loading){
        return <LoadingEffect/>
    }

    return (
        <Modal
            show={show}
            onHide={onClose}
            className={`${theme}`}
        >
            <Modal.Header closeButton>
                <Modal.Title>User Story: {userStory.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="text-danger">{ error }</div>
                <div className="row">
                    <div className="col">
                        <div className="h6">Description</div>
                    </div>
                    <div className="col">
                        <div className="h6">{userStory.description}</div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="h6">Priority</div>
                    </div>
                    <div className="col">
                        <div className="d-flex align-content-center">
                            <FontAwesomeIcon icon={faGripLines} className="me-1"/>
                            <div className={classNames( "h6", priorityColor(userStory.priority))}>{userStory.priority}</div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="h6">Story Points</div>
                    </div>
                    <div className="col">
                        <div className="h6 d-inline-block">
                            <div className="border rounded-circle border-danger p-1">{userStory.storyPoints}</div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="h6">Status</div>
                    </div>
                    <div className="col">
                        <div className={classNames( "h6", statusColor(userStory.status))}>{userStory.status}</div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="h6">Owner</div>
                    </div>
                    <div className="col">
                        <Link to={`/users/${userStoryOwner.id}`} className="h6">{userStoryOwner.firstname} {userStoryOwner.lastname}</Link>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}