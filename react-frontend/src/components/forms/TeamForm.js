import React from "react"

export default function TeamForm({setTeam}) {

    const onSubmitTeam = (e) => {
        e.preventDefault()
        setTeam({ name: e.target.elements.teamName.value })
    }

    return (
        <form onSubmit={onSubmitTeam}>
            <div className="form-outline mb-2">
                <label className="form-label" htmlFor="teamName">Team Name</label>
                <input type="text" id="teamName" name="teamName" className="form-control" minLength="3" maxLength="32" required />
            </div>
            <button type="submit" className="btn btn-primary">Next</button>
        </form>
    )
}