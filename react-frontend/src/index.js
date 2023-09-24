import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App';
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

function Layout() {
    return (
        <>
            <Header pageTitle = "Tracker" logoSrc={logo}/>
            <div className="container">
                <Outlet/>
            </div>
        </>
    )
}

const PrivateRoute = ({ children }) => {
    const isAuthenticated = !!AuthService.isAuthenticated()

    return isAuthenticated ? children : <Navigate to="/auth" />;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Layout/>}>
                <Route index element={<PrivateRoute><App/></PrivateRoute>}/>
                <Route path="/auth" element={<AuthPage/>}/>
                <Route path="/users/:id" element={<PrivateRoute><UserPage/></PrivateRoute>}/>
                <Route path="/teams" element={<PrivateRoute><TeamCreatePage/></PrivateRoute>}/>
                <Route path="/teams/:id" element={<PrivateRoute><TeamPage/></PrivateRoute>}/>
                <Route path="/projects" element={<PrivateRoute><ProjectCreatePage/></PrivateRoute>}/>
                <Route path="/projects/:id" element={<PrivateRoute><ProjectPage/></PrivateRoute>}/>
            </Route>
        </Routes>
    </BrowserRouter>
);