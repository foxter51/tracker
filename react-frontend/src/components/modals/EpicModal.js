import { Modal } from "react-bootstrap"
import classNames from "classnames"
import statusColor from "../../utils/status_color"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGripLines } from "@fortawesome/free-solid-svg-icons/faGripLines"
import priorityColor from "../../utils/priority_color"
import { useContext } from "react"
import { ThemeContext } from "../effects/Theme"

export default function EpicModal({epic, show, onClose}) {

    const {theme} = useContext(ThemeContext)

    return (
        <Modal
            show={show}
            onHide={onClose}
            className={`${theme}`}
        >
            <Modal.Header closeButton>
                <Modal.Title>Epic: {epic.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <div className="col">
                        <div className="h6">Description</div>
                    </div>
                    <div className="col">
                        <div className="h6">{epic.description}</div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="h6">Priority</div>
                    </div>
                    <div className="col">
                        <div className="d-flex align-content-center">
                            <FontAwesomeIcon icon={faGripLines} className="me-1"/>
                            <div className={classNames( "h6", priorityColor(epic.priority))}>{epic.priority}</div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="h6">Story Points</div>
                    </div>
                    <div className="col">
                        <div className="h6 d-inline-block">
                            <div className="border rounded-circle border-danger p-1">{epic.storyPoints}</div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="h6">Status</div>
                    </div>
                    <div className="col">
                        <div className={classNames( "h6", statusColor(epic.status))}>{epic.status}</div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}