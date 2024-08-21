import React, { useEffect } from "react"
import { useTimer } from "react-timer-hook"

export default function Timer({ expiryTimestamp }) {
    const {
        seconds,
        minutes,
        hours,
        days,
        start,
    } = useTimer({ expiryTimestamp, onExpire: () => window.location.reload() })

    useEffect(() => {
        start()
    }, [start])

    return (
        <div>
            <div>
                {days !== 0 && <span>{days} days </span>}
                <span>{hours}</span>
                :
                <span>{minutes}</span>
                :
                <span>{seconds}</span>
            </div>
        </div>
    )
}