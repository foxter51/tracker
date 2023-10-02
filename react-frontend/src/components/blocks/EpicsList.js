import React from "react"

export default function EpicList({epics}) {
    return (
        <div>
            <ul className="list-group">
                {epics
                    .sort((a, b) => a.title.localeCompare(b.title))
                    .map((epic) => (
                        <li key={epic.id} className="list-group-item">{epic.title}</li>
                    ))}
            </ul>
        </div>
    )
}