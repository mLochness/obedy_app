import { API_URL } from './config/env';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Signup = ({ signupOK, modalMsg }) => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isPending, setIsPending] = useState(false);
  const redirect = useNavigate();
  const [errors, setErrors] = useState([]);
  const role = "user";

  const [passVisibility, setPassVisibility] = useState(false);
  const passState = (passVisibility ? "text" : "password");
  const [inputType, setInputType] = useState(passState);

  useEffect(() => {
    setInputType(passState);
    console.log("useEffect: ", passState, "/ toggle passVisibility: ", passVisibility);
}, [passVisibility, passState]);

  const passToggle = () => {
    console.log("initial passVisibility: ", passVisibility);
    setPassVisibility(!passVisibility);
  }

  const handleSignin = (event) => {
    event.preventDefault();
    const newUser = {
      username,
      password,
      email,
      role
    };

    // Validate the user input
    if (!username) {
      setErrors(["Zadajte prosím vaše meno."]);
      return;
    }
    if (!password) {
      setErrors(["Zvoľte si prosím heslo."]);
      return;
    }
    if (!email) {
      setErrors(["Prosím zadajte váš email."]);
      return;
    }

    setIsPending(true);

    // Submit the user data to the server
    // fetch("http://localhost:3001/signup", {
    fetch(`${API_URL}/api/signup`, {
      method: "POST",
      mode: 'cors',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newUser)
    })
      .then((response) => response.json())
      .then((data) => {
        //if (data.status === 200) {
        if (data.message ===  "success") {
          // Redirect the user to the home page
          console.log("new user added");
          setIsPending(false);
          redirect('/login');
          modalMsg("Účet bol vytvorený, môžete sa prihlásiť");
          signupOK();
        } else {
          setIsPending(false);
          // setErrors([data.message]);
          var errMessage = data.message;
          var uNameErr = errMessage.includes("username");
          var emailErr = errMessage.includes("email");
          if (uNameErr) {
            setErrors("Užívateľ s týmto menom už existuje.");
          }
          else if (emailErr) {
            setErrors("Tento e-mail už je zaregistrovaný.");
          }
          else {
            setErrors([errMessage]);
          }
        }
        console.log("newUser: ", newUser);
      })
      .catch((err) => {
        setErrors([err.message]);
      });
  };


  return (
    <div className="login">
      <div className='loginForm'>
        <h2>Registrácia</h2>
        <form>
          <input type="text" required
            value={username}
            placeholder='Meno užívateľa'
            onChange={(e) => setUsername(e.target.value)}
          />
          <div className="passInput">
            <input type={inputType}
              required
              value={password}
              placeholder="Zvoľte si heslo"
              onChange={(e) => setPassword(e.target.value)}
              onKeyUp={() => setPassVisibility(false)}
              
            />
            <span className='passEye' onClick={passToggle}>👁</span>
          </div>

          <input type="email"
            required
            value={email}
            placeholder='Váš E-mail'
            onChange={(e) => setEmail(e.target.value)} />
            <p className='errMessage'>{errors}</p>

          {!isPending && <button onClick={handleSignin}> Registrovať</button>}
          {isPending && <button disabled>Registrujem...</button>}
        </form>
        
        <div className='underFormLine'>Máte už účet? <Link to="/login">Prihláste sa.</Link></div>
      </div>
    </div>
  );
}

export default Signup;