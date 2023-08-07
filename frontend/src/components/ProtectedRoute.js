import React, { useEffect, useState } from "react";
import { Route, useNavigate } from "react-router-dom";

const ProtectedRoute = (props) => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const checkUserToken = () => {
        const userToken = localStorage.getItem('csrf_token');
        if (!userToken || userToken === 'undefined') {
            setIsLoggedIn(false);
            return navigate('/login');
        }
        setIsLoggedIn(true);
    }
    useEffect(() => {
        checkUserToken();
    }, [isLoggedIn]);

    // navigate('/admin')
    return isLoggedIn ? props.children : navigate('/login');
    // return isLoggedIn ? navigate('/admin') : null;
}
export default ProtectedRoute;