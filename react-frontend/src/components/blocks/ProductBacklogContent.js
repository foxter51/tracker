import React, { useEffect, useState } from "react"
import ProductBacklogService from "../../services/ProductBacklogService"
import LoadingEffect from "../effects/LoadingEffect"
import { useParams } from "react-router"
import AuthService from "../../services/AuthService"
import EpicList from "./EpicsList"

export default function ProductBacklogContent() {

    const [productBacklogId, setProductBacklogId] = useState(null)
    const [epics, setEpics] = useState([])
    const [isProductOwner, setIsProductOwner] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const { id } = useParams()

    useEffect(() => {
        const fetchProductBacklogEpics = async () => {
            try {
                const response = await ProductBacklogService.getProductBacklog(id)
                setProductBacklogId(response.data.productBacklog.id)
                setIsProductOwner(response.data.productBacklog.ownerId === AuthService.getAuthUserId())
                setEpics(response.data.productBacklog.epics)
                setLoading(false)
            } catch (error) {
                setError(error.response.data.message)
            }
        }
        fetchProductBacklogEpics()
    }, [id])

    const addEpic = (epic) => {
        setEpics([...epics, epic])
    }

    const removeEpic = (epicId) => {
        setEpics(prevState => prevState.filter(epic => epic.id !== epicId))
    }

    if(loading){
        return <LoadingEffect/>
    }

    return (
        <div className="container p-2">
            <div className="card">
                {error}
                <EpicList
                    productBacklogId={productBacklogId}
                    epics={epics}
                    addEpic={addEpic}
                    isProductOwner={isProductOwner}
                    removeEpic={removeEpic}
                />
            </div>
        </div>
    )
}