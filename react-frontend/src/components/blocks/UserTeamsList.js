import React from "react"
import { Link } from "react-router-dom"

export default function UserTeamsList({teams}) {
    return (
        <div className="card col-8">
            <div className="card-header d-flex justify-content-between align-items-center">
                <div className="h2">Teams</div>
                <button className="btn btn-primary">
                    <Link to="/teams" className="text-decoration-none text-white">
                        Create Team
                    </Link>
                </button>
            </div>
            <div className="card-body">
                <ul className="list-group">
                    {teams
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map(team => (
                            <Link to={`/teams/${team.id}`} key={team.id} className="list-group-item text-primary">
                                {team.name}
                            </Link>
                        ))}
                </ul>
            </div>
        </div>
    )
}