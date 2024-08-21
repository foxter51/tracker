import React, { useState } from "react"
import ProjectService from "../services/ProjectService"
import ProjectTeamForm from "../components/forms/ProjectTeamForm"
import { Navigate } from "react-router"

export default function ProjectCreatePage() {

    const [project, setProject] = useState(null)
    const [error, setError] = useState(null)
    const [save, setSave] = useState(false)

    const onSubmitProject = async (e) => {
        e.preventDefault()
        try{
            const response = await ProjectService.createProject({ ...project })
            setProject(response.data.project)
            setSave(true)
        } catch (error) {
            setError(error.response.data.message)
        }
    }

    if(save){
        return <Navigate to={`/projects/${project.id}`}/>
    }

    return (
        <div>
            <div>
                <div className="h1">Create Project</div>
            </div>
            <div className="text-danger">{ error }</div>
            <form onSubmit={onSubmitProject}>
                <div className="form-outline mb-5">
                    <label className="form-label" htmlFor="name">Project name</label>
                    <input type="text" id="name" name="projectName" className="form-control" minLength="3" maxLength="32" required onChange={(e) => setProject({ ...project, name: e.target.value })}/>
                </div>
                <div className="form-outline mb-5">
                    <label className="form-label" htmlFor="description">Project description</label>
                    <textarea id="description" name="projectDescription" className="form-control" minLength="3" maxLength="512" required onChange={(e) => setProject({ ...project, description: e.target.value })}/>
                </div>
                <div className="form-outline mb-5">
                    <label className="form-label" htmlFor="github">Github Repository Link</label>
                    <input type="text" id="github" name="githubLink" className="form-control" maxLength="2048" required
                        placeholder='https://github.com/user/repo.git'
                        onChange={(e) => setProject({ ...project, githubLink: e.target.value })}/>
                </div>
                <ProjectTeamForm project={project} setProject={setProject} />
                <button className="btn btn-primary" >Save</button>
            </form>
        </div>
    )
}