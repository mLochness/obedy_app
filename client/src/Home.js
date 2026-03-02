import { BsFillRocketTakeoffFill } from "react-icons/bs";
import { Link } from 'react-router-dom';

const Home = () => {

    return (
        <div className="home">
            <h2>HOMEPAGE</h2>
            <BsFillRocketTakeoffFill className="homeIcon" />
            <Link id="login" to="/login"><button>Prihlásenie ☻</button></Link>
        </div>
    );
}

export default Home;