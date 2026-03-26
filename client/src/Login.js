import { API_URL } from './config/env';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from "./auth/AuthContext";
import { Link } from 'react-router-dom';

const Login = () => {
  const {setToken} = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPending, setIsPending] = useState(false);
  //const redirect = useNavigate();
  const [errors, setErrors] = useState([]);
  const [passVisibility, setPassVisibility] = useState(false);
  const passState = (passVisibility ? "text" : "password");
  const [inputType, setInputType] = useState(passState);

  useEffect(() => {
    setInputType(passState);
}, [passVisibility, passState]);

  const passToggle = () => {
    setPassVisibility(!passVisibility);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const login = { username, password };

    setIsPending(true);

    fetch(`${API_URL}/api/login`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(login)
    })
      .then((response) => response.json())
      .then((data) => {

        if (data.message === "success") {
          
          const loginStorageObj = {
            accessToken : data.accessToken,
            userID : data.user_id,
            userName: data.user_name,
            userRole: data.user_role,
          }
          localStorage.setItem("loginStorage", JSON.stringify(loginStorageObj));
          //sessionStorage.setItem("loginStorage", JSON.stringify(loginStorageObj));
          setToken(data.accessToken);
          setIsPending(false);
        } else {
          setIsPending(false);
          localStorage.removeItem("loginStorage");
          //sessionStorage.removeItem("loginStorage");
          setErrors([data.message]);
          console.log("api url:", {API_URL});
        }
      })
      .catch((error) => {
        setErrors([error.message]);
      });

  }

  return (
    <div className="loginForm">
      <h2>Prihlásenie</h2>
      <form autoComplete="off" onSubmit={handleSubmit}>
        <input type="text"
          required
          placeholder="Meno"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <div className="passInput">
          <input type={inputType}
            required
            value={password}
            placeholder="Heslo"
            onChange={(e) => setPassword(e.target.value)}
            onKeyUp={() => setPassVisibility(false)}
          />
          <span className='passEye' onClick={passToggle}>👁</span>
        </div>
        <p className='errMessage'>{errors}</p>
        {!isPending && <button>Prihlásiť</button>}
        {isPending && <button disabled>Prihlasujem...</button>}
      </form>
      <div className='underFormLine'>Nemáte účet? <Link to="/signup">Zaregistrujte sa.</Link></div>
    </div>
  );
}

export default Login;