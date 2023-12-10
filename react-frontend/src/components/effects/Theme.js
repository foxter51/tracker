import React, { createContext, useEffect, useState } from "react"

const ThemeContext = createContext()

const getTheme = () => {
    const theme = localStorage.getItem('theme')

    if(!theme) {
        localStorage.setItem('theme', 'dark')
        return 'dark'
    } else return theme
}

const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(getTheme())

    useEffect(() => {
        const refreshTheme = () => {
            localStorage.setItem('theme', theme)
        }
        refreshTheme()
    }, [theme])

    function toggleTheme() {
        if (theme === 'dark') {
            setTheme('light')
        } else setTheme('dark')
    }

    return (
        <ThemeContext.Provider
            value={{
                theme,
                setTheme,
                toggleTheme
            }}
        >
            {children}
        </ThemeContext.Provider>
    )
}

export { ThemeContext, ThemeProvider, getTheme }

