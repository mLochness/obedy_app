import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import Navbar from './Navbar';
import Home from './Home';
import NotFound from './NotFound';
import Signup from './Signup';
import Login from './Login';
import AddKid from './AddKid';
import Countdown from './Countdown';
import UserDashboard from './user/UserDashboard';
import AdminDashboard from './admin/AdminDashboard';
import UsersList from './UsersList';
import KidsList from './KidsList';
//import Userfront from "@userfront/core";
//import SignupForm from './SignupForm';




function App() {

  const [token, setToken] = useState("1");

  if(!token) {
    return (
    <Login setToken={setToken} />
    )
  } 

  return (
    <div className="App">
        <Navbar />
        <Countdown />
        <div className="content">
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/udashboard" element={<UserDashboard />} />
            <Route path="/adashboard" element={<AdminDashboard />} />
            <Route path="/addkid" element={<AddKid />} />
            <Route path="/kids" element={<KidsList />} />
            <Route path="/users" element={<UsersList />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
    </div>
  );


}

export default App;
