import { API_URL } from './config/env';
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
import AdminTimeSetting from './admin/AdminTimeSetting';
import { SlCheck } from "react-icons/sl";
import { SlClose } from "react-icons/sl";

const App = () => {

  const [isModalOpen, setModalOpen] = useState(false);
  const [modalTxt, setModalTxt] = useState("");
  const [nextSkipDate, setNextSkipDate] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const modalMsg = (message, onConfirm = null) => {
    setModalTxt(message);
    setConfirmAction(() => onConfirm);
    setModalOpen(true);
  }
  const handleOpenModal = () => {
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setModalTxt("-");
    setConfirmAction(null);
  };

  const [cutoffConfig, setCutoffConfig] = useState({
    cutoffHour: 7,
    cutoffMinute: 30
  });

  const handleDateUpdate = (data) => {
    data && setNextSkipDate(data);
  };

  useEffect(() => {
    fetch(`${API_URL}/api/cutoff`)
      .then(res => res.json())
      .then(data => setCutoffConfig({
        cutoffHour: data.cutoff_hour,
        cutoffMinute: data.cutoff_minute
      }));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`${API_URL}/api/cutoff`)
        .then(res => res.json())
        .then(data => {
          setCutoffConfig({
            cutoffHour: data.cutoff_hour,
            cutoffMinute: data.cutoff_minute
          });
        });
    }, 30000); // check for cutoff time changes every 30s

    return () => clearInterval(interval);
  }, []);

  // useEffect(() => {
  //   handleDateUpdate()
  //   console.log("App - nextSkipDate:", nextSkipDate);
  // }, [])


  return (
    <div className="App">
      <Navbar />
      {cutoffConfig && (<Countdown cutoffConfig={cutoffConfig} dateUpdate={handleDateUpdate} />)}
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup modalMsg={modalMsg} signupOK={handleOpenModal} />} />

          <Route element={<PrivateRoutes modalMsg={modalMsg} idleLogout={handleOpenModal} />}>
            <Route path="/udashboard" element={<UserDashboard modalMsg={modalMsg} skipDate={nextSkipDate} />} />
            <Route path="/adashboard" element={<AdminDashboard modalMsg={modalMsg} />} />
            <Route path="/timeset" element={<AdminTimeSetting modalMsg={modalMsg} cutoffConfig={cutoffConfig} onCutoffChange={setCutoffConfig} />} />
            <Route path="/addkid" element={<AddKid modalMsg={modalMsg} addKidMsg={handleOpenModal} />} />
            <Route path="/kids" element={<KidsList />} />
            <Route path="/users" element={<UsersList />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          hasCloseBtn={false}
        >
          <div>{modalTxt}</div>

          <div className="modal-actions">
            {confirmAction ? (
              <>
                <button
                  onClick={() => {
                    confirmAction();
                    handleCloseModal();
                  }}
                >
                  Áno <SlCheck />
                </button>

                <button onClick={handleCloseModal}>
                  Zrušiť <SlClose />
                </button>
              </>
            ) : (
              <button onClick={handleCloseModal}>
                OK
              </button>
            )}
          </div>
        </Modal>
      </div>
    </div>
  );


}

export default App;
