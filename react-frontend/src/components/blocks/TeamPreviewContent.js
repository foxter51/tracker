import React from "react"

export default function TeamPreviewContent({team, onSave, onCancel}) {

    return(
        <div>
            <div className="h2">Team Members</div>
            {team.userRoles.map((teamMember) => (
                <div className="card mb-1">
                    <div className="card-body">
                        <div className="row">
                            <div className="col">{teamMember.User.username}</div>
                            <div className="col">{teamMember.Role.scrumRole}</div>
                        </div>
                    </div>
                </div>
            ))}
            <button className="btn btn-primary" onClick={onSave}>Save</button>
            <button className="btn btn-danger" onClick={onCancel}>Cancel</button>
        </div>
    )
}