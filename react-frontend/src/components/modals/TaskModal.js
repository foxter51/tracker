import { Modal } from "react-bootstrap"
import classNames from "classnames"
import statusColor from "../../utils/status_color"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGripLines } from "@fortawesome/free-solid-svg-icons/faGripLines"
import priorityColor from "../../utils/priority_color"
import { Link } from "react-router-dom"
import { useContext } from "react"
import { ThemeContext } from "../effects/Theme"

export default function TaskModal({task, show, onClose}) {

    const {theme} = useContext(ThemeContext)

    return (
        <Modal
            show={show}
            onHide={onClose}
            className={`${theme}`}
        >
            <Modal.Header closeButton>
                <Modal.Title>Task: {task.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <div className="col">
                        <div className="h6">Description</div>
                    </div>
                    <div className="col">
                        <div className="h6">{task.description}</div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="h6">Priority</div>
                    </div>
                    <div className="col">
                        <div className="d-flex align-content-center">
                            <FontAwesomeIcon icon={faGripLines} className="me-1"/>
                            <div className={classNames( "h6", priorityColor(task.priority))}>{task.priority}</div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="h6">Story Points</div>
                    </div>
                    <div className="col">
                        <div className="h6 d-inline-block">
                            <div className="border rounded-circle border-danger p-1">{task.storyPoints}</div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="h6">Status</div>
                    </div>
                    <div className="col">
                        <div className={classNames( "h6", statusColor(task.status))}>{task.status}</div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="h6">Assignee</div>
                    </div>
                    <div className="col">
                        {task.assignee &&
                            <Link to={`/users/${task.assignee.id}`} className="h6">{task.assignee.firstname} {task.assignee.lastname}</Link>
                        }
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}