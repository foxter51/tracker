import React, { useEffect, useState } from "react"
import LoadingEffect from "../components/effects/LoadingEffect"
import ProjectService from "../services/ProjectService"
import { useParams } from "react-router"
import UserProjectsList from "../components/blocks/UserProjectsList"

export default function UserProjectsPage() {
    const [projects, setProjects] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    const { id } = useParams()

    useEffect(() => {
        const fetchProjects = async () => {
            try{
                const response = await ProjectService.getUserProjects(id)
                setProjects(response.data.projects)
            } catch (error) {
                setError(error.response.data.message)
            }
            setLoading(false)
        }
        fetchProjects()
    }, [id])

    if(loading){
        return <LoadingEffect/>
    }

    return (
        <div className="container d-flex justify-content-center">
            <div style={{marginRight: "auto"}}>
                <div className="h1">My Projects</div>
                <div>{error}</div>
            </div>
            <UserProjectsList projects={projects}/>
        </div>
    )
}