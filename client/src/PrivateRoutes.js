import { useContext } from "react";
import { AuthContext } from './auth/AuthContext';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import useIdle from './useIdle';

const PrivateRoutes = () => {
    const { token, setToken } = useContext(AuthContext);

    // Idle timer -------------------------
    const redirect = useNavigate();
    const logout = () => {
        localStorage.removeItem("loginStorage");
        setToken(null);
        redirect('/login', {replace:true});
        console.log("Logged out for inactivity");
    }
    const { isIdle } = useIdle({ onIdle: logout, idleTime: 15 });
    // Idle timer -------------------------------------- 15 min.

    console.log("PrivateRoutes AuthContext:", token)
    return (
        token ? <Outlet /> : <Navigate to="/login" />
    )

}

export default PrivateRoutes