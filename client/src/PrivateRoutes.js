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
        modalMsg("Prebehlo automatické odhlásenie");
        idleLogout();
    }
    useIdle({ onIdle: logout, idleTime: 10, active: !!token });
    // Idle timer -------------------------------------- 10 min.

    return (
        token ? <Outlet /> : <Navigate to="/login" replace/>
    )

}

export default PrivateRoutes