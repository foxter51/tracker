import React, { useEffect, useState } from "react"
import LoadingEffect from "../components/effects/LoadingEffect"
import authService from "../services/AuthService"
import { Navigate } from "react-router-dom"

export default function AuthLoadingPage() {

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const approveGoogleAuthorization = async () => {
            if(window.localStorage.getItem("access_code")) {
                window.localStorage.removeItem("access_code")
                setLoading(false)
                return
            }

            const searchParams = new URLSearchParams(document.location.search)

            try{
                await authService.approveGoogleAuthorization(searchParams.get('code'))
                window.localStorage.setItem("access_code", 'approved')
            } catch(err){
                console.log(err)
            }
            setLoading(false)
        }
        approveGoogleAuthorization()
    }, [])

    if(loading) {
        return <LoadingEffect/>
    } else {
        return <Navigate to="/" />
    }
}