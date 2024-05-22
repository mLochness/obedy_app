import { useState, useContext } from 'react';
import { AuthContext } from "./auth/AuthContext";
import { useIdle } from "./useIdle";


const IdleModal = () => {
    const [openModal, setOpenModal] = useState(true)
    const { logout } = useContext(AuthContext);
    const handleIdle = () => {
        setOpenModal(true);
    }
    const { idleTimer } = useIdle({ onIdle: handleIdle, idleTime: 5 });
    const stay = () => {
        setOpenModal(false)
        idleTimer.reset()
    };
    const handleLogout = () => {
        logout()
        setOpenModal(false)
    };
    return (
    <div className="idleModal">
        <modal show={openModal} onHide={stay}>
            <div className='modalText'>
                <p>
                    Your session is about to expire. You'll be automatically signed out.
                </p>
                <p>
                    Do you want to stay signed in?
                </p>
            </div>
            <div className='modalButtons'>
                <button variant="secondary" onClick={handleLogout}>
                    Sign out now
                </button>
                <button variant="primary" onClick={stay}>
                    Stay signed in
                </button>
            </div>
        </modal>
    </div>
    );
}
export default IdleModal;