import { useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "./auth/AuthContext";

export default function Logout() {
    const redirect = useNavigate();
    const {setToken} = useContext(AuthContext);

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem("loginStorage");
        setToken(null);
        redirect('/', {replace:true});
        console.log("You're logged out.");
    };

    return (
        <button id="logout" onClick={handleLogout} className="highLink" >Odhlásiť</button>
    );

}