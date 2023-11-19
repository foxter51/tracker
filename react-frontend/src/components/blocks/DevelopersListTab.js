import React, { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleUser } from "@fortawesome/free-solid-svg-icons/faCircleUser"
import { faReplyAll } from "@fortawesome/free-solid-svg-icons/faReplyAll"
import { Link } from "react-router-dom"
import classNames from "classnames"

export default function DevelopersListTab({team, filterTasksByAssignee, selectedAssigneeId}) {

    const [developers, setDevelopers] = useState([])

    useEffect(() => {
        const retrieveDevelopers = () => {
            setDevelopers(team.userRoles.filter(userRole => userRole.RoleId === 3)
                .map(userRole => ({
                    id: userRole.User.id,
                    name: `${userRole.User.firstname} ${userRole.User.lastname}`
                })))
        }
        retrieveDevelopers()
    }, [team.userRoles])

    return (
        <div className="d-flex align-items-center">
            {developers.map(developer => (
                <Link to="" key={developer.id}
                      className={classNames("me-2", developer.id === +selectedAssigneeId ? "text-danger" : "")}>
                    <FontAwesomeIcon icon={faCircleUser}
                                     title={developer.name}
                                     onClick={() => filterTasksByAssignee(developer.id)}
                    />
                </Link>
            ))}
            <Link to="">
                <FontAwesomeIcon icon={faReplyAll}
                                 title="All"
                                 onClick={() => filterTasksByAssignee(null)}
                />
            </Link>
        </div>
    )
}