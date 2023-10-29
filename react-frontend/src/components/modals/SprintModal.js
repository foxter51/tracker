import { Modal } from "react-bootstrap"

export default function SprintModal({sprint, show, onClose}) {

    return (
        <Modal
            show={show}
            onHide={onClose}
        >
            <Modal.Header closeButton>
                <Modal.Title>{sprint.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <div className="col">
                        <div className="h6">Start Date</div>
                    </div>
                    <div className="col">
                        <div className="h6">{sprint.startDate}</div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="h6">Duration</div>
                    </div>
                    <div className="col">
                        <div className="h6">{sprint.duration}</div>
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