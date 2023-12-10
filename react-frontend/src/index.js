import React, { Fragment, useContext, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './components/App'
import 'bootstrap/dist/css/bootstrap.min.css'
import {BrowserRouter, Route, Routes, Navigate, Outlet} from "react-router-dom"
import AuthPage from "./pages/AuthPage"
import AuthService from "./services/AuthService"
import UserPage from "./pages/UserPage"
import Header from "./components/blocks/Header"
import logo from "./logo.svg"
import TeamCreatePage from "./pages/TeamCreatePage"
import TeamPage from "./pages/TeamPage"
import ProjectCreatePage from "./pages/ProjectCreatePage"
import ProjectPage from "./pages/ProjectPage"
import UserProjectsPage from "./pages/UserProjectsPage"
import UserTeamsPage from "./pages/UserTeamsPage"
import AuthLoadingPage from "./pages/AuthLoadingPage"
import { ThemeContext, ThemeProvider } from "./components/effects/Theme"

function Layout() {
    const { theme } = useContext(ThemeContext)

    useEffect(() => {
        document.body.style.backgroundColor = theme === 'light' ? 'white' : 'var(--bs-dark)'
    }, [theme]);

    return (
        <Fragment className={`${theme}`} >
            <Header pageTitle = "Tracker" logoSrc={logo} />
            <div className={`app container ${theme}`}>
                <Outlet/>
            </div>
        </Fragment>
    )
}

const PrivateRoute = ({ children }) => {
    const isAuthenticated = AuthService.isAuthenticated()

    if(!isAuthenticated) {
        window.localStorage.removeItem("auth_token")
        window.localStorage.removeItem("user_id")
    }

    return isAuthenticated ? children : <Navigate to="/auth" />
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <ThemeProvider>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route index element={<PrivateRoute><App/></PrivateRoute>}/>
                    <Route path="/auth" element={<AuthPage/>}/>
                    <Route path="/auth/google" element={<AuthLoadingPage/>}/>
                    <Route path="/users/:id" element={<PrivateRoute><UserPage/></PrivateRoute>}/>
                    <Route path="/teams" element={<PrivateRoute><TeamCreatePage/></PrivateRoute>}/>
                    <Route path="/teams/:id" element={<PrivateRoute><TeamPage/></PrivateRoute>}/>
                    <Route path="/projects" element={<PrivateRoute><ProjectCreatePage/></PrivateRoute>}/>
                    <Route path="/projects/:id" element={<PrivateRoute><ProjectPage/></PrivateRoute>}/>
                    <Route path="/projects/my/:id" element={<PrivateRoute><UserProjectsPage/></PrivateRoute>}/>
                    <Route path="/teams/my/:id" element={<PrivateRoute><UserTeamsPage/></PrivateRoute>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    </ThemeProvider>
)