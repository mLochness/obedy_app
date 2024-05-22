import { Link } from 'react-router-dom';
import { useContext, useEffect } from "react";
import { AuthContext } from "./auth/AuthContext";
import Logout from "./Logout";

const Navbar = () => {

    const { token, userRole, setUserRole } = useContext(AuthContext);
    //const { userRole } = useContext(AuthContext);


    console.log("Navbar - is there any token?", token);
    console.log("userRole:", userRole);

    useEffect(() => {
        setUserRole(userRole);
    },[token])

    return (
        <nav className="navbar">
            <h1>Odhlásenie z&nbsp;obedov</h1>
            <div className="links">
                {userRole === "admin" && <Link to="/adashboard">Domov</Link>}
                {userRole === "admin" && <Link to="/users">Users</Link>}
                {userRole === "admin" && <Link to="/kids">Kids</Link>}
                {userRole === "user" && <Link to="/udashboard">Domov</Link>}
                {userRole === "user" && <Link to="/addkid">Pridať dieťa</Link>}
                {!token && <Link id="login" className="highLink" to="/login">Prihlásenie</Link>}
                {token && <Logout />}
            </div>
        </nav>
    );
}

export default Navbar;


