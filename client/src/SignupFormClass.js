import React from 'react';
import Userfront from "@userfront/core";
import { useState } from 'react';

// Initialize Userfront Core JS
Userfront.init("7n84j65n");

// Define the Signup form component
class SignupForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      accountName: "",
      password: "",
      passwordVerify: "",
    };

    this.handleInputChange = this.handleInputChange.bind(this); 
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  // Whenever an input changes value, change the corresponding state variable
  handleInputChange(event) {
    event.preventDefault();
    const target = event.target;
    this.setState({
      [target.name]: target.value,
    });
  }

  // Handle the form submission by calling Userfront.signup()
  handleSubmit(event) {
    event.preventDefault();
    // Call Userfront.signup()
    Userfront.signup({
      method: "password",
      email: this.state.email,
      password: this.state.password,
      data: {
        accountName: this.state.accountName,
      },
    });
  }



  render() {
    return (
      <div className='loginForm'>
        <form onSubmit={this.handleSubmit}>
          <label>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={this.state.email}
              onChange={this.handleInputChange}
            />
          </label>
          <label>
            <input
              name="accountName"
              type="text"
              placeholder="Meno alebo prezývka"
              value={this.state.accountName}
              onChange={this.handleInputChange}
            />
          </label>
          <label>
            <input
              name="password"
              type="password"
              placeholder="Heslo"
              value={this.state.password}
              onChange={this.handleInputChange}
            />
          </label>
          <label>
            <input
              name="passwordVerify"
              type="password"
              placeholder="Zopakujte heslo"
              value={this.state.passwordVerify}
              onChange={this.handleInputChange}
            />
          </label>
          <button type="submit">Sign up</button>
        </form>
      </div>
    );
  }
}
export default SignupForm;