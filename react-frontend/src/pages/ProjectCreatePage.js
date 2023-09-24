import React, { useState } from "react"
import ProjectService from "../services/ProjectService"
import ProjectTeamForm from "../components/forms/ProjectTeamForm"

export default function ProjectCreatePage() {

    const [project, setProject] = useState(null)
    const [error, setError] = useState(null)

    const onSubmitProject = async (e) => {
        e.preventDefault()
        try{
            const response = await ProjectService.createProject({
                name: project.name,
                description: project.description,
                teamId: project.teamId
            })
            setProject(response.data.project)
        } catch (error) {
            setError(error.response.data.message)
        }
    }

    return (
        <div>
            <div>
                <div className="h1">Create Project</div>
            </div>
            <div>{error}</div>
            <form onSubmit={onSubmitProject}>
                <div className="form-outline mb-5">
                    <label className="form-label" htmlFor="name">Project name</label>
                    <input type="text" id="name" name="projectName" className="form-control" maxLength="32" required onChange={(e) => setProject({ ...project, name: e.target.value })}/>
                </div>
                <div className="form-outline mb-5">
                    <label className="form-label" htmlFor="description">Project description</label>
                    <textarea id="description" name="projectDescription" className="form-control" maxLength="512" required onChange={(e) => setProject({ ...project, description: e.target.value })}/>
                </div>
                <ProjectTeamForm project={project} setProject={setProject} />
                <button className="btn btn-primary">Save</button>
            </form>
        </div>
    )
}