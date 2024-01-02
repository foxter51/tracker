import * as React from "react"
import Particles, { initParticlesEngine } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"
import { useContext, useEffect, useMemo, useState } from "react"
import { ThemeContext } from "../effects/Theme"
import { TypeAnimation } from "react-type-animation"

export default function RootContent () {
    const [init, setInit] = useState(false)
    const { theme } = useContext(ThemeContext)

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine)
        }).then(() => {
            setInit(true)
        })
    }, [])

    const options = useMemo(
        () => ({
            background: {
                color: {
                    value: "transparent",
                }
            },
            fpsLimit: 120,
            interactivity: {
                events: {
                    onClick: {
                        enable: true,
                        mode: "push",
                    },
                    onHover: {
                        enable: true,
                        mode: "repulse",
                    },
                },
                modes: {
                    push: {
                        quantity: 4,
                    },
                    repulse: {
                        distance: 200,
                        duration: 0.4,
                    },
                },
            },
            particles: {
                color: {
                    value: theme === 'dark' ? "#ffffff" : "#000000",
                },
                links: {
                    color: theme === 'dark' ? "#ffffff" : "#000000",
                    distance: 150,
                    enable: true,
                    opacity: 0.5,
                    width: 1,
                },
                move: {
                    direction: "none",
                    enable: true,
                    outModes: {
                        default: "bounce",
                    },
                    random: false,
                    speed: 2,
                    straight: false,
                },
                number: {
                    density: {
                        enable: true,
                    },
                    value: 80,
                },
                opacity: {
                    value: 0.5,
                },
                shape: {
                    type: "circle",
                },
                size: {
                    value: { min: 1, max: 5 },
                },
            },
            detectRetina: true,
        }),
        [theme],
    )

    if (init) {
        return (
            <>
                <Particles className="Animated-particles"
                           id="tsparticles"
                           options={options}
                />
                <div className="App-name">
                    <TypeAnimation
                        sequence={['TrackedPath']}
                        speed={20}
                        cursor={false}
                        style={{ userSelect: 'none' }}
                    />
                </div>
            </>
        )
    }

    return <></>
}