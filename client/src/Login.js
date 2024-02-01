import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPending, setIsPending] = useState(false);
  const redirect = useNavigate();
  const [errors, setErrors] = useState([]);
  const [passVisibility, setPassVisibility] = useState(false);
  const passState = (passVisibility ? "password" : "text");
  const [inputType, setInputType] = useState(passState);

  const passToggle = () => {
    setPassVisibility(!passVisibility);
    setInputType(passState);
    console.log("toggle...");
    console.log("passVisibility: ", passVisibility);
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
        console.log("response data:", data);

        if (data.message === "success") {
          
          setIsPending(false);
          if (data.user_role === "user") {
            redirect('/udashboard');
          }
          if (data.user_role === "admin") {
            redirect('/adashboard');
          }
          localStorage.setItem("accessToken", data.accessToken);
          // setUsername("");
          // setPassword("");
          // router.push("/jwt-safehouse");

        } else {
          setIsPending(false);
          setErrors([data.message]);
        }

        // if (response.status === 200) {
        //   //if (response.message === "OK") {
        //   setIsPending(false);
        //   // Redirect the user ..
        //   redirect('/udashboard');
        //   console.log("logged in...");
        // } else {
        //   setIsPending(false);
        //   setErrors([response.status, " Wrong username/password combination!"]);
        //   console.log(response.data);
        // }
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
            onKeyUp={(e) => setInputType("password")}
          />
          <span className='passEye' onClick={passToggle}>👁</span>
        </div>
        <p className='errMessage'>{errors}</p>
        {!isPending && <button>Prihlásiť</button>}
        {isPending && <button disabled>Prihlasujem...</button>}
      </form>
      <div>Nemáte účet? <Link to="/signup">Zaregistrujte sa.</Link></div>
    </div>
  );
}

export default Login;