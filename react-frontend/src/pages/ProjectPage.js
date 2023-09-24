import React, { useEffect, useState } from "react"
import { useParams } from "react-router"
import ProjectService from "../services/ProjectService"
import LoadingEffect from "../components/effects/LoadingEffect"

export default function ProjectPage() {

    const [project, setProject] = useState(null)
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
    }, [id]);

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
                        <div className="col">{project.Team.name}</div>
                    </div>
                </div>
            </div>
            <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item" role="presentation">
                    <button className="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">Home</button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">Profile</button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact" type="button" role="tab" aria-controls="contact" aria-selected="false">Contact</button>
                </li>
            </ul>
            {/*TO DO*/}
            <div className="tab-content" id="myTabContent">
                <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">...</div>
                <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">...</div>
                <div class="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">...</div>
            </div>
        </div>
    )
}