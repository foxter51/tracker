import { Modal } from "react-bootstrap"
import classNames from "classnames"
import statusColor from "../../utils/status_color"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGripLines } from "@fortawesome/free-solid-svg-icons/faGripLines"
import priorityColor from "../../utils/priority_color"
import { Link } from "react-router-dom"

export default function UserStoryModal({userStory, show, onClose}) {

    return (
        <Modal
            show={show}
            onHide={onClose}
        >
            <Modal.Header closeButton>
                <Modal.Title>{userStory.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
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
                        <Link to={`/users/${userStory.owner.id}`} className="h6">{userStory.owner.firstname} {userStory.owner.lastname}</Link>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}