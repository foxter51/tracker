import React, { useEffect, useState } from "react"
import { useParams } from "react-router"
import ProjectService from "../services/ProjectService"
import LoadingEffect from "../components/effects/LoadingEffect"
import classNames from "classnames"
import ProductBacklogContent from "../components/blocks/ProductBacklogContent"
import SprintsContent from "../components/blocks/SprintsContent"
import ScrumBoard from "../components/blocks/ScrumBoard"
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import AuthService from 'services/AuthService'
import ErrorCard from 'components/blocks/ErrorCard'

export default function ProjectPage() {

    const [project, setProject] = useState(null)
    const [active, setActive] = useState('board')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [hasAccess, setHasAccess] = useState(false)

    const { id } = useParams()

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await ProjectService.getProject(id)

                const authUserId = AuthService.getAuthUserId()
                const isAuthUserPresentInTeam = response.data.project.Team.userRoles.some(teamMember => teamMember.User.id === authUserId)

                setHasAccess(isAuthUserPresentInTeam)
                setProject(response.data.project)
                setLoading(false)
            } catch (error) {
                setError(error.response.data.message)
            }
        }
        fetchProject()
    }, [id])

    if(loading){
        return <LoadingEffect/>
    }

    return (
        <div>
            { hasAccess ? 
                <div>
                    <div className="text-danger">{ error }</div>
                    <div className="h1">Project { project.name }</div>
                    <div className="card mb-2">
                        <div className="card-body">
                            <div className="row">
                                <div className="col">Description</div>
                                <div className="col">{ project.description }</div>
                            </div>
                            <div className="row">
                                <div className="col">Team</div>
                                <div className="col">
                                    <Link className="text-decoration-none" to={ `/teams/${project.Team.id}` }>{ project.Team.name }</Link>
                                </div>
                            </div>
                            { project.currentSprint &&
                                <div className="row">
                                    <div className="col">Current Sprint</div>
                                    <div className="col">{ project.currentSprint.name }</div>
                                </div>
                            }
                            <div className="row">
                                <div className="col">Github Repository</div>
                                <div className="col">
                                    <a className="text-decoration-none d-flex align-items-center" href={ project.githubLink } target="_blank" rel="noreferrer">
                                        <FontAwesomeIcon icon={ faGithub } className="me-1" />
                                        { project.githubRepoName }
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ul className="nav nav-tabs">
                        <li className="nav-item rounded-top">
                            <button className={ classNames("nav-link", active === "board" ? "active" : "") }
                                onClick={ () => setActive('board') } id="board-tab">Board</button>
                        </li>
                        <li className="nav-item rounded-top">
                            <button className={ classNames("nav-link", active === "productBacklog" ? "active" : "") }
                                onClick={ () => setActive('productBacklog') } id="board-tab">Product Backlog</button>
                        </li>
                        <li className="nav-item rounded-top">
                            <button className={ classNames("nav-link", active === "sprints" ? "active" : "") }
                                onClick={ () => setActive('sprints') } id="board-tab">Sprints</button>
                        </li>
                    </ul>
                    <div className="tab-content">
                        <div className={ classNames("tab-pane fade", active === "board" ? "show active" : "") }>
                            <ScrumBoard
                                project={ project }
                            />
                        </div>
                        <div className={ classNames("tab-pane fade", active === "productBacklog" ? "show active" : "") }>
                            <ProductBacklogContent />
                        </div>
                        <div className={ classNames("tab-pane fade", active === "sprints" ? "show active" : "") }>
                            <SprintsContent />
                        </div>
                    </div>
                </div>
                :
                <ErrorCard
                    message={ "You don't have access to view this project" }
                />
            }
        </div>
    )
}