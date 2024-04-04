import React, { useState, useEffect } from 'react'
import userService from '../services/UserService'
import {useParams} from "react-router"
import LoadingEffect from "../components/effects/LoadingEffect"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faTrash} from '@fortawesome/free-solid-svg-icons'
import authService from "../services/AuthService"
import EditableField from "../components/forms/EditableField"
import { Link } from "react-router-dom"
import ConfirmModal from "../components/modals/ConfirmModal"

let equal = require('fast-deep-equal')

export default function UserPage() {
    const [originalUser, setOriginalUser] = useState(null)
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [isSelf, setIsSelf] = useState(false)
    const [editingEnabled, setEditingEnabled] = useState(false)

    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [userToRemove, setUserToRemove] = useState(0)

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

    const submitUpdate = async (e) => {
        e.preventDefault()
        try {
            if (!equal(originalUser, user)){
                const response = await userService.updateUser(user)
                setOriginalUser(response.data.user)
                setError("OK")
            }
            else setError("Everything is up-to-date")
        } catch (error) {
            setError(error.response.data.message)
            setOriginalUser(originalUser)
        }
    }

    const onSubmitDelete = async () => {
        try {
            setShowConfirmModal(false)
            if (isSelf){
                authService.logout()
            }
            await userService.deleteUser(userToRemove)
            setUserToRemove(0)
        } catch (error) {
            setError(error.response.data.message)
        }
    }

    const onCancelDelete = () => {
        setShowConfirmModal(false)
        setUserToRemove(0)
    }

    if(loading) {
        return <LoadingEffect/>
    }

    return (
        <div className="container d-flex justify-content-center">
            <div style={{marginRight: "auto"}}>
                <div className="h1">Profile</div>
                <div className="text-danger">{ error }</div>
            </div>
            <div className="card col-8">
                <div className="card-header">
                    <div className="d-flex justify-content-between">
                        <div className="h2">{ originalUser.lastname } { originalUser.firstname }'s Profile</div>
                        {isSelf && !editingEnabled &&
                            <button className="btn btn-primary" onClick={() => setEditingEnabled(true)}>Edit</button>
                        }
                        {isSelf && editingEnabled &&
                            <button className="btn btn-danger" onClick={() => setEditingEnabled(false)}>Cancel</button>
                        }
                    </div>
                </div>
                <div className="card-body">
                    <div className="row align-items-center">
                        <div className="col">Fullname</div>
                        <div className="col"><strong>{ originalUser.firstname } { originalUser.lastname }</strong></div>

                        {editingEnabled &&
                            <>
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
                            </>
                        }
                    </div>

                    <hr/>

                    <div className="row align-items-center">
                        <div className="col">Username</div>
                        <div className="col-6">{ originalUser.username }</div>

                        {editingEnabled &&
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
                        }
                    </div>

                    <hr/>

                    <div className="row align-items-center">
                        <div className="col">E-mail</div>
                        <div className="col-6">{ originalUser.email }</div>

                        {!originalUser.isThirdPartyAuth && editingEnabled &&
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
                        }
                    </div>

                    <hr/>

                    {!originalUser.isThirdPartyAuth && isSelf &&
                        <>
                            <div className="row d-flex justify-content-between align-items-center">
                                <div className="col-2">Password</div>

                                { editingEnabled &&
                                    <EditableField
                                        value={ null }
                                        field="password"
                                        type="password"
                                        maxLength="64"
                                        editing={ editing }
                                        onEdit={ handleEdit }
                                        onChange={ (e) => setUser({ ...user, password: e.target.value }) }
                                        onSubmit={ submitUpdate }
                                        isSelf={ isSelf }
                                    />
                                }
                            </div>
                            <hr/>
                        </>
                    }

                    <div className="row">
                        <div className="col">Teams</div>
                        <div className="col-6">
                            {originalUser.Teams.length > 0 ?
                                originalUser.Teams.map(team => 
                                    <div key={team.id}>
                                        <Link to={ `/teams/${team.id}` } key={ team.id } className="text-primary text-decoration-none">
                                            { team.name }
                                        </Link>
                                    </div>
                                )
                                :
                                <div>no teams</div>
                            }
                        </div>
                    </div>

                    {isSelf &&
                        <>
                            <hr/>
                            <Link to=""
                                className="text-danger text-decoration-none float-end"
                                onClick={ () => {
                                    setUserToRemove(originalUser.id)
                                    setShowConfirmModal(true)
                                } }
                            >
                                Delete account <FontAwesomeIcon icon={ faTrash } />
                            </Link>
                        </>
                    }

                    {showConfirmModal &&
                        <ConfirmModal
                            showModal={showConfirmModal}
                            onConfirm={onSubmitDelete}
                            onCancel={onCancelDelete}
                            question="Are you sure you want to delete your account?"
                        />
                    }
                </div>
            </div>
        </div>
    )
}