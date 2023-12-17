import React, { useEffect, useState } from "react"
import ProductBacklogService from "../../services/ProductBacklogService"
import LoadingEffect from "../effects/LoadingEffect"
import { useParams } from "react-router"
import AuthService from "../../services/AuthService"
import EpicList from "./EpicsList"
import { socket } from "../../utils/socket"

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

    useEffect(() => {
        socket.on('user story update', (data) => {
            const updatedEpic = epics.find(epic => epic.id === data.epicId)
            if (updatedEpic) {
                updatedEpic.status = data.epicStatus

                setEpics(prevEpics => {
                    return prevEpics.map(epic => {
                        if (epic.id === updatedEpic.id) {
                            return updatedEpic
                        }
                        return epic
                    })
                })
            }

            return () => {
                socket.off('user story update')
            }
        })
    })

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