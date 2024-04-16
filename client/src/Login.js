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

    fetch('http://localhost:3001/login', {
      method: 'POST',
      mode: 'cors',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(login)
    })
      .then((response) => response.json())
      .then((data) => {
        //console.log("response data:", data);

        if (data.message === "success") {
          
          const loginStorageObj = {
            accessToken : data.accessToken,
            userID : data.user_id,
            userName: data.user_name,
            userRole: data.user_role,
          }
          console.log("to storage:", data.accessToken, data.user_id, data.user_name, data.user_role);
          localStorage.setItem("loginStorage", JSON.stringify(loginStorageObj));
          setToken(data.accessToken);
          setIsPending(false);

          //setUsername("");
          //setPassword("");
          // router.push("/jwt-safehouse");
          

          // if (data.user_role === "user") {
          //   console.log("Login - user role?:", data.user_role);
          //   redirect('/udashboard');
          // }
          // if (data.user_role === "admin") {
          //   console.log("Login - user role?:", data.user_role);
          //   redirect('/adashboard');
          // }

        } else {
          setIsPending(false);
          localStorage.removeItem("loginStorage");
          setErrors([data.message]);
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