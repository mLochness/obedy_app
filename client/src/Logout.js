import { useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "./auth/AuthContext";

const Logout = () => {
    const redirect = useNavigate();
    const {setToken, setUserRole} = useContext(AuthContext);

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem("loginStorage");
        //sessionStorage.removeItem("loginStorage");
        setToken(null);
        setUserRole(null);
        redirect('/', {replace:true});
        console.log("You're logged out.");
    };

    return (
        <button id="logout" onClick={handleLogout} className="highLink" >Odhlásiť</button>
    );

};

export default Logout;