import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
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

  const handleSignin = (event) => {
    event.preventDefault();
    const newUser = {
      username,
      password,
      email
    };

    // Validate the user input
    if (!username) {
      setErrors(["Please enter your name."]);
      return;
    }
    if (!password) {
      setErrors(["Please enter your password."]);
      return;
    }
    if (!email) {
      setErrors(["Please enter your email."]);
      return;
    }

    setIsPending(true);

    // Submit the user data to the server
    fetch("http://localhost:3001/signup", {
      method: "POST",
      mode: 'cors',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newUser)
    })
      .then((response) => {
        if (response.status === 200) {
          // Redirect the user to the home page
          console.log("new user added");
          setIsPending(false);
          redirect('/login');
        } else {
          setErrors([response.statusText]);
        }
        console.log("newUser: ", newUser);
      })
      .catch((error) => {
        setErrors([error.message]);
      });
  };


  return (
    <div className="login">
      <div className='loginForm'>
        <h2>Registrácia</h2>
        <form>
          <label>Meno užívateľa</label>
          <input type="text" required
            value={username}
            placeholder='Meno'
            onChange={(e) => setUsername(e.target.value)}
          />
          <label>Heslo</label>
          <div className="passInput">
                <input type={inputType}
                required 
                value={password}
                placeholder="Heslo"
                onChange={(e) => setPassword(e.target.value)}
                onKeyUp={ (e) => setInputType("password") }
                />
                <span className='passEye' onClick={ passToggle }>👁</span>
                </div>

          <label>Email</label>
          <input type="email" required
            value={email}
            placeholder='Email'
            onChange={(e) => setEmail(e.target.value)} />

          {!isPending && <button onClick={handleSignin}> Registrovať</button>}
          {isPending && <button disabled>Prihlasujem...</button>}
        </form>
        <p>{errors}</p>
      </div>
    </div>
  );
}

export default Signup;