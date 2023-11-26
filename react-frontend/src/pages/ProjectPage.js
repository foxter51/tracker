import React, { useEffect, useState } from "react"
import { useParams } from "react-router"
import ProjectService from "../services/ProjectService"
import LoadingEffect from "../components/effects/LoadingEffect"
import classNames from "classnames"
import ProductBacklogContent from "../components/blocks/ProductBacklogContent"
import SprintsContent from "../components/blocks/SprintsContent"
import ScrumBoard from "../components/blocks/ScrumBoard"
import { Link } from "react-router-dom"

export default function ProjectPage() {

    const [project, setProject] = useState(null)
    const [active, setActive] = useState('board')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const { id } = useParams()

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await ProjectService.getProject(id)
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
            <div>{error}</div>
            <div className="h1">Project {project.name}</div>
            <div className="card mb-1">
                <div className="card-body">
                    <div className="row">
                        <div className="col">Description</div>
                        <div className="col">{project.description}</div>
                    </div>
                    <div className="row">
                        <div className="col">Team</div>
                        <div className="col">
                            <Link className="text-decoration-none" to={`/teams/${project.Team.id}`}>{project.Team.name}</Link>
                        </div>
                    </div>
                    {project.currentSprint &&
                        <div className="row">
                            <div className="col">Current Sprint</div>
                            <div className="col">{project.currentSprint.name}</div>
                        </div>
                    }
                </div>
            </div>
            <ul className="nav nav-tabs">
                <li className="nav-item rounded-top">
                    <button className={classNames("nav-link", active === "board" ? "active" : "")}
                            onClick={() => setActive('board')} id="board-tab">Board</button>
                </li>
                <li className="nav-item rounded-top">
                    <button className={classNames("nav-link", active === "productBacklog" ? "active" : "")}
                            onClick={() => setActive('productBacklog')} id="board-tab">Product Backlog</button>
                </li>
                <li className="nav-item rounded-top">
                    <button className={classNames("nav-link", active === "sprints" ? "active" : "")}
                            onClick={() => setActive('sprints')} id="board-tab">Sprints</button>
                </li>
            </ul>
            <div className="tab-content">
                <div className={classNames("tab-pane fade", active === "board" ? "show active" : "")}>
                    <ScrumBoard
                        project={project}
                    />
                </div>
                <div className={classNames("tab-pane fade", active === "productBacklog" ? "show active" : "")}>
                    <ProductBacklogContent/>
                </div>
                <div className={classNames("tab-pane fade", active === "sprints" ? "show active" : "")}>
                    <SprintsContent/>
                </div>
            </div>
        </div>
    )
}