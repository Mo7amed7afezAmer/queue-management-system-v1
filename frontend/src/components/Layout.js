import { useState } from "react";
import { Outlet } from "react-router-dom";

// compponents
import Sidebar from '../components/Sidebar';

const Layout = ({ sidebarLinks }) => {
    // state
    const [isOpen, setIsOpen] = useState(true);

    // // methods
    function updateOpen() {
        setIsOpen(val => !val);
    }
    
    return (
        <>
            <div className={`app-sidebar ${ isOpen ? "open" : null }`} >
                <Sidebar imageDisplay={true} linksName={ sidebarLinks } />
            </div>
            
            <div className="app-body">
                {/* <NavbarTop addClick = { updateOpen } /> */}
                <div className="nav-toggler" onClick={ updateOpen }>
                    <span></span>
                </div>

                <Outlet />

            </div>
        </>
    );
}

export default Layout;