import {BeatLoader} from "react-spinners"
import React from "react"

export default function LoadingEffect() {
    return (
        <div className="d-flex justify-content-center align-items-center">
            <BeatLoader color="#0c69cc" />
        </div>
    )
}