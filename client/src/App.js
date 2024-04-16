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
import PrivateRoutes from './PrivateRoutes';

// import { useContext } from 'react';
// import { AuthContext } from './auth/AuthContext';


function App() {

  // const { userRole } = useContext(AuthContext);
  // console.log('app - userRole:', userRole);

  return (
    <div className="App">
      <Navbar />
      <Countdown />
      <div className="content">
        <Routes>
          {/* <Route exact path="/" element={userRole ? ( <UserDashboard /> ) : ( <Home /> )} /> */}
          <Route exact path="/" element={ <Home /> } />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<PrivateRoutes />}>
            <Route element={<UserDashboard />} path="/udashboard" />
            <Route element={<AdminDashboard />} path="/adashboard" />
            <Route element={<AddKid />} path="/addkid" />
            <Route element={<KidsList />} path="/kids" />
            <Route element={<UsersList />} path="/users" />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );


}

export default App;
