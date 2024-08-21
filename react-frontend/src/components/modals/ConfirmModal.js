import { Modal } from "react-bootstrap"
import { ThemeContext } from "../effects/Theme"
import { useContext } from "react"

export default function ConfirmModal({ showModal, onConfirm, onCancel, question }) {

    const {theme} = useContext(ThemeContext)

    return (
        <Modal
            show={showModal}
            onHide={onCancel}
            className={`${theme}`}
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