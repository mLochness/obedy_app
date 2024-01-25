import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="navbar">
            <h1>Odhlásenie z&nbsp;obedov</h1>
            <div className="links">
                <Link to="/">Home</Link>
                <Link to="/users">Users</Link>
                <Link to="/kids">Kids</Link>
                <Link className="highLink" to="/login">Prihlásenie</Link>
            </div>
        </nav>
    );
}
 
export default Navbar;