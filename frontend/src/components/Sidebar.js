import React, { useState } from "react";
import { NavLink } from "react-router-dom";

// External data
// import {linksName} from "../DataHelper";

export default function Sidebar({imageDisplay, linksName}) {

    // methods
    function logoutApp() {
        // remove token
        // localStorage.clear();
    }

    return (
        <aside className="sidebar">
            <div className={`user-img ${imageDisplay ? null : "d-none"}`}>
                <div className="img-box">
                    img
                </div>
                <h5 className="user-box"> { localStorage.getItem("doctorName") } </h5>
            </div>
            <ul>
                {
                    linksName &&
                    linksName.map((link) => {
                        return (
                            <li key={ link } className={ link }>
                                {/* <NavLink to={ `queue/${link}` }> { link } </NavLink> */}
                                <NavLink to={ `${link}` }> { link } </NavLink>
                            </li>
                        )
                    })

                }
                <li key={ "logout" } className={ "logout" } onClick={ logoutApp() }>
                    logout
                </li>
            </ul>
        </aside>
    );
};