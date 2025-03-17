import { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import PrivateRoutes from './PrivateRoutes';
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
import Modal from './Modal';

const App = () => {

  const [isModalOpen, setModalOpen] = useState(false);
  const [modalTxt, setModalTxt] = useState("");
  const [nextSkipDate, setNextSkipDate] = useState(null);
  const modalMsg = message => {
    setModalTxt(message);
  }
  const handleOpenModal = () => {
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setModalTxt("-")
  };

  const handleDateUpdate = (data) => {
    data && setNextSkipDate(data);
  };

  useEffect(() => {
    handleDateUpdate()
    console.log("App - nextSkipDate:", nextSkipDate);
  }, [])
  

  return (
    <div className="App">
      <Navbar />
      <Countdown dateUpdate={handleDateUpdate}/>
      {/* <Countdown /> */}
      <div className="content">
        <Routes>
          {/* <Route exact path="/" element={userRole ? ( <UserDashboard /> ) : ( <Home /> )} /> */}
          <Route exact path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup modalMsg={modalMsg} signupOK={handleOpenModal} />} />
          <Route element={<PrivateRoutes modalMsg={modalMsg} idleLogout={handleOpenModal}/>}>
            <Route element={<UserDashboard modalMsg={modalMsg} kidsAction={handleOpenModal} skipDate={nextSkipDate} />} path="/udashboard" />
            <Route element={<AdminDashboard />} path="/adashboard" />
            <Route element={<AddKid modalMsg={modalMsg} addKidOK={handleOpenModal} />} path="/addkid" />
            <Route element={<KidsList />} path="/kids" />
            <Route element={<UsersList />} path="/users" />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        >
          <div>{modalTxt}</div>
        </Modal>
      </div>
    </div>
  );


}

export default App;
