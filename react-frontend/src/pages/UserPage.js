import React, { useState, useEffect } from 'react'
import userService from '../services/UserService'
import {useParams} from "react-router"
import LoadingEffect from "../components/effects/LoadingEffect"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faTrash} from '@fortawesome/free-solid-svg-icons'
import authService from "../services/AuthService"
import EditableField from "../components/forms/EditableField"

let equal = require('fast-deep-equal')

export default function UserPage() {
    const [originalUser, setOriginalUser] = useState(null)
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [isSelf, setIsSelf] = useState(false)

    const { id } = useParams()

    const [editing, setEditing] = useState({
        firstname: false,
        lastname: false,
        username: false,
        email: false,
        password: false
    })

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await userService.getUser(id)
                setOriginalUser(response.data.user)
                setUser(response.data.user)
                setIsSelf(response.data.user.id === authService.getAuthUserId())
                setLoading(false)
            } catch (error) {
                setError(error.response.data.message);
            }
        }

        fetchUser()
    }, [id])

    const handleEdit = (field) => {
        setError(null)
        setEditing((prevState) => ({
            ...prevState,
            [field]: !prevState[field],
        }))
    }

    const submitUpdate = async () => {
        try {
            if (!equal(originalUser, user)){
                const response = await userService.updateUser(user)
                setUser(response.data.user)
                setError("OK")
            }
            else setError("Everything is up-to-date")
        } catch (error) {
            setError(error.response.data.message)
            setUser(originalUser)
        }
    }

    const submitDelete = async () => {
        try {
            if(window.confirm('Are you sure you want to delete this user?')){
                if (isSelf){
                    authService.logout()
                }
                await userService.deleteUser(user.id)
            } else setError("Deletion canceled")
        } catch (error) {
            setError(error.response.data.message)
        }
    }

    if(loading) {
        return <LoadingEffect/>
    }

    return (
        <div className="container d-flex justify-content-center">
            <div style={{marginRight: "auto"}}>
                <div className="h1">Profile</div>
                <div>{error}</div>
            </div>
            <div className="card col-8">
                <div className="card-header">
                    <div className="h2">{user.lastname} {user.firstname}'s Profile</div>
                </div>
                <div className="card-body">
                    <div className="row align-items-center">
                        <div className="col">Fullname</div>
                        <div className="col"><strong>{user.firstname} {user.lastname}</strong></div>

                        <EditableField
                            value={user.firstname}
                            field="firstname"
                            type="text"
                            maxLength="32"
                            editing={editing}
                            onEdit={handleEdit}
                            onChange={(e) => setUser({ ...user, firstname: e.target.value })}
                            onSubmit={submitUpdate}
                            isSelf={isSelf}
                        />

                        <EditableField
                            value={user.lastname}
                            field="lastname"
                            type="text"
                            maxLength="32"
                            editing={editing}
                            onEdit={handleEdit}
                            onChange={(e) => setUser({ ...user, lastname: e.target.value })}
                            onSubmit={submitUpdate}
                            isSelf={isSelf}
                        />
                    </div>

                    <div className="row align-items-center">
                        <div className="col">Username</div>
                        <div className="col">{user.username}</div>

                        <EditableField
                            value={user.username}
                            field="username"
                            type="text"
                            maxLength="32"
                            editing={editing}
                            onEdit={handleEdit}
                            onChange={(e) => setUser({ ...user, username: e.target.value })}
                            onSubmit={submitUpdate}
                            isSelf={isSelf}
                        />
                    </div>

                    <div className="row align-items-center">
                        <div className="col">E-mail</div>
                        <div className="col">{user.email}</div>

                        <EditableField
                            value={user.email}
                            field="email"
                            type="email"
                            maxLength="32"
                            editing={editing}
                            onEdit={handleEdit}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                            onSubmit={submitUpdate}
                            isSelf={isSelf}
                        />
                    </div>

                    <div className="row align-items-center">
                        <div className="col-2">Password</div>

                        <EditableField
                            value={user.password}
                            field="password"
                            type="password"
                            maxLength="64"
                            editing={editing}
                            onEdit={handleEdit}
                            onChange={(e) => setUser({ ...user, password: e.target.value })}
                            onSubmit={submitUpdate}
                            isSelf={isSelf}
                        />
                    </div>

                    <div className="row">
                        <div className="col">Teams</div>
                        <div className="col">
                            {user.Teams ?
                                user.Teams.map(team => <div key={team.id}>{team.name}</div>)
                                :
                                <div>no teams</div>
                            }
                        </div>
                        {isSelf && <div className="col-1"/>}
                    </div>

                    {isSelf &&
                        <a href="#" className="text-danger text-decoration-none" onClick={() => {
                            submitDelete()
                        }}>
                           Delete account <FontAwesomeIcon icon={faTrash}/>
                        </a>
                    }
                </div>
            </div>
        </div>
    )
}