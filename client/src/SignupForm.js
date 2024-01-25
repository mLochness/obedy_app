import React from 'react';
import Userfront from "@userfront/core";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


// Initialize Userfront Core JS
Userfront.init("7n84j65n");

// Define the Signup form component
const SignupForm = () =>  {

  const [email, setEmail] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVerify, setPasswordVerify] = useState("");

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


  // Handle the form submission by calling Userfront.signup()
  const handleSubmit = (e) => {
    e.preventDefault();
    // Call Userfront.signup()
    Userfront.signup({
      method: "password",
      email: email,
      password: password,
      data: {
        accountName: username,
      },
    });

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
            redirect('/');
          } else {
            setErrors([response.statusText]);
          }
          console.log("newUser: ", newUser);
        })
        .catch((error) => {
          setErrors([error.message]);
        });

  }



    return (
      <div className='loginForm'>
        <form onSubmit={(e) => handleSubmit}>
          <label>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            <input
              name="accountName"
              type="text"
              placeholder="Meno alebo prezývka"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
            />
          </label>
          <label>
            <input
              name="password"
              type="password"
              placeholder="Heslo"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <label>
            <input
              name="passwordVerify"
              type="password"
              placeholder="Zopakujte heslo"
              value={passwordVerify}
              onChange={(e) => setPasswordVerify(e.target.value)}
            />
          </label>
          <button type="submit">Sign up</button>
        </form>
      </div>
    );
  }

export default SignupForm;