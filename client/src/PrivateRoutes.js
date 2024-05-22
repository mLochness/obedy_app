import { useContext } from "react";
import { AuthContext } from './auth/AuthContext';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import useIdle from './useIdle';

const PrivateRoutes = ({ modalMsg, idleLogout }) => {
    const { token, setToken, setUserRole } = useContext(AuthContext);

    // Idle timer -------------------------
    const redirect = useNavigate();
    const logout = () => {
        localStorage.removeItem("loginStorage");
        setToken(null);
        setUserRole(null);
        redirect('/login', {replace:true});
        console.log("Logged out for inactivity");
        modalMsg("Prebehlo automatické odhlásenie");
        idleLogout();
    }
    const { isIdle } = useIdle({ onIdle: logout, idleTime: 15 });
    // Idle timer -------------------------------------- 15 min.

    console.log("PrivateRoutes AuthContext:", token)
    return (
        token ? <Outlet /> : <Navigate to="/login" />
    )

}

export default PrivateRoutes