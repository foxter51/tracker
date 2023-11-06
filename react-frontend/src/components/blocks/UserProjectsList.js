import React from "react"
import { Link } from "react-router-dom"

export default function UserProjectsList({projects}) {
    return (
        <div className="card col-8">
            <div className="card-header d-flex justify-content-between align-items-center">
                <div className="h2">Projects</div>
                <button className="btn btn-primary">
                    <Link to="/projects" className="text-decoration-none text-white">
                        Create Project
                    </Link>
                </button>
            </div>
            <div className="card-body">
                <ul className="list-group">
                    {projects
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map(project => (
                            <Link to={`/projects/${project.id}`} key={project.id} className="list-group-item text-primary">
                                {project.name}
                            </Link>
                        ))}
                </ul>
            </div>
        </div>
    )
}