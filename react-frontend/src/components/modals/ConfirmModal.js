import { Modal } from "react-bootstrap"

export default function ConfirmModal({ showModal, onConfirm, onCancel, question }) {

    return (
        <Modal
            show={showModal}
            onHide={onCancel}
        >
            <Modal.Header closeButton>
                <Modal.Title>{question}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex justify-content-end">
                    <button className="btn btn-danger me-3" onClick={onConfirm}>Yes</button>
                    <button className="btn btn-primary" onClick={onCancel}>No</button>
                </div>
            </Modal.Body>
        </Modal>
    )
}