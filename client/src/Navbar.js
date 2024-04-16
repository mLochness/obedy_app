import { Link } from 'react-router-dom';
import { useContext } from "react";
import { AuthContext } from "./auth/AuthContext";
import Logout from "./Logout";

const Navbar = () => {

const { token } = useContext(AuthContext);

   console.log("Navbar - is there any token?", token);

    return (
        <nav className="navbar">
            <h1>Odhlásenie z&nbsp;obedov</h1>
            <div className="links">
                <Link to="/">Home</Link>
                {token && <Link to="/users">Users</Link>}
                {token && <Link to="/kids">Kids</Link>}
                {!token && <Link id="login" className="highLink" to="/login">Prihlásenie</Link>}
                {token && <Logout />}
            </div>
        </nav>
    );
}

export default Navbar;


