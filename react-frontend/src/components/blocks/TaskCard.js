import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars, faClipboard, faUser } from "@fortawesome/free-solid-svg-icons"
import classNames from "classnames"
import priorityColor from "../../utils/priority_color"
import { Link } from "react-router-dom"

export default function TaskCard({ task, showModalTask, showModalUserStory }) {
    
    return (
        <div className="card">
            <div className="card-body m-1">
                <div className="row mb-2">
                    <div className="col">
                        <div className="d-flex align-items-center">
                            <FontAwesomeIcon icon={ faClipboard } className="me-1" />
                            <div className="text-primary" onClick={ () => showModalTask(task) }>
                                { task.title }
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="d-flex align-items-center justify-content-end">
                            <div className="d-flex align-items-center me-1">
                                <div className="d-flex border rounded-pill border-danger p-2 align-items-center justify-content-center" style={ { width: '24px', height: '24px' } }>
                                    { task.storyPoints }
                                </div>
                            </div>
                            <div className={ classNames(priorityColor(task.priority)) }>
                                { task.priority.substring(0, 3) }
                            </div>
                        </div>
                    </div>
                </div>
                <div className={ classNames(task.assignee ? "mb-2" : "") }>
                    <div className="row">
                        <div className="col">
                            <div className="d-flex align-items-center">
                                <FontAwesomeIcon icon={ faBars } className="me-1" />
                                <div className="text-success" onClick={ () => showModalUserStory(task.UserStory) }>
                                    { ` ${task.UserStory.title}` }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    { task.assignee &&
                        <div className="d-flex align-items-center">
                            <FontAwesomeIcon icon={ faUser } className="me-1" />
                            <Link to={ `/users/${task.assignee.id}` } className="text-decoration-none">
                                { `${task.assignee.lastname} ${task.assignee.firstname}` }
                            </Link>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}