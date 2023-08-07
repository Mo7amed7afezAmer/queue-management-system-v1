import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// pages
import Dashboard from "./Dashboard";
import Projects from "./Projects";
import Tasks from "./Tasks";

// compponents
import Sidebar from "../components/Sidebar"

const Layout = () => {
    return (
        <>
          <Sidebar />
          <div className="modify-flex"></div>
          <BrowserRouter>
            <Routes>
                <Route path="/dashboard" element={ <Dashboard pageName="dashboard" /> } />
                <Route path="/projects" element={ <Projects  pageName="project" /> } />        
                <Route path="tasks" element={ <Tasks /> } />        
            </Routes>
          </BrowserRouter>
        </>
    );
}

// export default Layout;