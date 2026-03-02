import { Link } from 'react-router-dom';
import { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "./auth/AuthContext";
import Logout from "./Logout";
import ToggleDarkMode from './ToggleDarkMode';

const Navbar = () => {

    const { token, userRole, setUserRole } = useContext(AuthContext);

    // burger menu ************** >>
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    const toggleMenu = () => {
        setIsOpen(prev => !prev);
    };

    const closeMenu = () => {
        setIsOpen(false);
    };

    // 👇 Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                isOpen &&
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);
    
    useEffect(() => {
        setUserRole(userRole);
    }, [token])

    

    return (
        <nav className="navbar">
            <h1>Dnes&nbsp;nejeme</h1>
            {/* <button>{!token && <Link id="login" to="/login">Prihlásenie ☻</Link>}</button> */}
            <div className="menuBtnCon" onClick={toggleMenu} ref={buttonRef}>
                <svg
                    className={`ham hamRotate ham4 ${isOpen ? "active" : ""}`}
                    viewBox="0 0 100 100"
                    width="80"
                >
                    <path
                        className="line top"
                        d="m 70,33 h -40 c 0,0 -8.5,-0.149796 -8.5,8.5 0,8.649796 8.5,8.5 8.5,8.5 h 20 v -20"
                    />
                    <path
                        className="line middle"
                        d="m 70,50 h -40"
                    />
                    <path
                        className="line bottom"
                        d="m 30,67 h 40 c 0,0 8.5,0.149796 8.5,-8.5 0,-8.649796 -8.5,-8.5 -8.5,-8.5 h -20 v 20"
                    />
                </svg>
            </div>
            <ul className={`menu ${isOpen ? "open" : ""}`} ref={menuRef}>
                <li onClick={closeMenu}>{userRole === "admin" && <Link to="/adashboard">Domov</Link>}</li>
                <li onClick={closeMenu}>{userRole === "admin" && <Link to="/timeset">Čas</Link>}</li>
                <li onClick={closeMenu}>{userRole === "admin" && <Link to="/users">Users</Link>}</li>
                <li onClick={closeMenu}>{userRole === "admin" && <Link to="/kids">Kids</Link>}</li>
                <li onClick={closeMenu}>{userRole === "user" && <Link to="/udashboard">Domov</Link>}</li>
                <li onClick={closeMenu}>{userRole === "user" && <Link to="/addkid">Pridať dieťa</Link>}</li>
                <li onClick={closeMenu}>{!token && <Link id="login" to="/login">Prihlásenie ☻</Link>}</li>
                <li onClick={closeMenu}>{token && <Logout />}</li>
                <li onClick={closeMenu}><ToggleDarkMode /></li>
            </ul>
        </nav>
    );
}

export default Navbar;


