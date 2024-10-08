import { Modal } from "react-bootstrap"
import { useContext } from "react"
import { ThemeContext } from "../effects/Theme"

export default function SprintModal({sprint, show, onClose}) {

    const {theme} = useContext(ThemeContext)

    return (
        <Modal
            show={show}
            onHide={onClose}
            className={`${theme}`}
        >
            <Modal.Header closeButton>
                <Modal.Title>Sprint: {sprint.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <div className="col">
                        <div className="h6">Start Date</div>
                    </div>
                    <div className="col">
                        <div className="h6">{sprint.startDate.substring(0, 10)}</div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="h6">Duration</div>
                    </div>
                    <div className="col">
                        <div className="h6">{sprint.duration} weeks</div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="h6">Goal</div>
                    </div>
                    <div className="col">
                        <div className="h6">{sprint.goal}</div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}