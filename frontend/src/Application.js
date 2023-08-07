import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

// External data
import { linksName } from "./DataHelper";

// style files
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'font-awesome/css/font-awesome.min.css';
import "./assets/sass/main.scss";

// admin pages
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Clinics from "./pages/Clinics";
import Doctor from "./pages/Doctor";
import Patient from "./pages/Patient";
import Login from "./pages/Login";
import MediaDisplay from "./pages/MediaDisplay";
import Ticket from "./pages/Ticket";
import ProtectedRoute from "./components/ProtectedRoute";
import NotImplementedPage from "./pages/NotImplementedPage";

// doctor pages
import DPagePatient from "./doctor-pages/patient";

// compponents
// import Sidebar from './components/Sidebar';
// import NavbarTop from "./components/NavbarTop";

function NotFound() {
  return (
    <>
      <h1>NotFound page</h1>
    </>
  );
}

// create page router
const routes = [
  {
    path: "/admin",
    element: <ProtectedRoute><Layout sidebarLinks={ linksName.adminRole } /></ProtectedRoute>,
    children: [
      { path: "/admin/dashboard", element: <Dashboard pageName="dashboard" /> },
      { path: "/admin/clinics", element: <Clinics pageName="clinic" /> },
      { path: "/admin/doctor", element: <Doctor pageName="doctor" /> },
      { path: "/admin/patient", element: <Patient pageName="patient" /> },
      { path: "/admin/*", element: <NotFound /> },
    ],
  },
  {
    path: "/doctor",
    element: <ProtectedRoute><Layout sidebarLinks={ linksName.doctorRole } /></ProtectedRoute>,
    children: [
      { path: "/doctor/dashboard", element: <NotImplementedPage pageName="dashboard" /> },
      { path: "/doctor/patient", element: <DPagePatient pageName="patient" /> },
      { path: "/doctor/medications", element: <NotImplementedPage /> },
      { path: "/doctor/documents", element: <NotImplementedPage /> },
      { path: "/doctor/finances", element: <NotImplementedPage /> },
      { path: "/doctor/settings", element: <NotImplementedPage /> },
      { path: "/doctor/*", element: <NotFound /> },
    ],
  },
  {
    path: "/ticket",
    element: <Ticket />,
  },
  {
    path: "/media-display",
    element: <MediaDisplay />,
  },
  {
    path: "/",
    element: <MediaDisplay />,
  },
  {
    path: "/Login",
    element: <Login />,
  },
  // {
  //   path: "/dashboard",
  //   element: <Navigate to="/admin/dashboard" />,
  // },
];
const router = createBrowserRouter(routes, {
    basename: "/queue-management-system-v1"
});

function Application() {

    return (
        <div className="App">
            <RouterProvider
             router={router} 
             fallbackElement={<NotFound />}
            />
        </div>
    );
}

export default Application;
