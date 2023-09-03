import * as React from "react"

import { request } from "../../utils/axios_helper"
import {useEffect, useState} from "react"
import LoadingEffect from "../effects/LoadingEffect"

export default function AuthContent () {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        request(
            "GET", "/messages", {}
        ).then((response) => {
            setData(response.data)
            setLoading(false)
        }).catch((error) =>
            setError(error.response.data.message))
    }, [])

    if(loading) {
        return <LoadingEffect/>
    }

    return (
        <div>
            {data ? data.map((line) => <p>{line}</p>) : error}
        </div>
    )
}
