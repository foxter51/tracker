import React, { useEffect, useState } from "react"
import ProductBacklogService from "../../services/ProductBacklogService"
import EpicService from "../../services/EpicService"
import LoadingEffect from "../effects/LoadingEffect"
import { useParams } from "react-router"
import EpicForm from "../forms/EpicForm"
import AuthService from "../../services/AuthService"
import EpicList from "./EpicsList"

export default function ProductBacklogContent() {

    const [productBacklog, setProductBacklog] = useState({})
    const [loading, setLoading] = useState(true)
    const [isProductOwner, setIsProductOwner] = useState(false)
    const [showEpicForm, setShowEpicForm] = useState(false)

    const { id } = useParams()

    useEffect(() => {
        const fetchProductBacklog = async () => {
            try {
                const response = await ProductBacklogService.getProductBacklog(id)
                setProductBacklog(response.data.productBacklog)
                setIsProductOwner(response.data.productBacklog.ownerId === AuthService.getAuthUserId())
                setLoading(false)
            } catch (error) {
                console.log(error)
            }
        }
        fetchProductBacklog()
    }, [id])

    const fetchEpics = async () => {
        try {
            const response = await EpicService.getProductBacklogEpics(productBacklog.id)
            setProductBacklog( {
                ...productBacklog,
                epics: response.data.epics
            })
        } catch (error) {
            console.log(error)
        }
    }

    if(loading){
        return <LoadingEffect/>
    }

    return (
        <div className="container p-2">
            <div className="card">
                <div className="card-header">
                    Epics
                </div>
                <div className="card-body">
                    {isProductOwner && !showEpicForm &&
                        <button className="btn btn-primary mb-3" onClick={() => setShowEpicForm(true)}>
                            Create Epic
                        </button>
                    }
                    {isProductOwner && showEpicForm &&
                        <button className="btn btn-primary mb-3" onClick={() => setShowEpicForm(false)}>
                            Cancel
                        </button>
                    }
                    {showEpicForm &&
                        <EpicForm
                            productBacklogId={productBacklog.id}
                            projectId={id}
                            setShowEpicForm={setShowEpicForm}
                            refreshEpics={fetchEpics}
                        />
                    }
                    <EpicList epics={productBacklog.epics}/>
                </div>
            </div>
        </div>
    )
}