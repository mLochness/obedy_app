import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from "react";
import { AuthContext } from './auth/AuthContext';

const AddKid = ({ addKidOK, modalMsg }) => {
    const [kidName, setKidName] = useState('');
    const [kidSurname, setKidSurame] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const { userID } = useContext(AuthContext);
    const [isPending, setIsPending] = useState(false);
    const [errors, setErrors] = useState([]);
    const redirect = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const kid = { kidName, kidSurname, birthDate, userID};

        setIsPending(true);

        fetch('http://localhost:3001/addkid', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(kid)
        }).then(() => {
            console.log("kid added");
            setIsPending(false);
            redirect('/udashboard');
            addKidOK();
            modalMsg("Dieťa bolo úspešne pridané");
        })
        .catch((err) => {
            setErrors([err.message]);
          });

    }

    return (
        <div className='loginForm'>
            <h2>Pridajte dieťa do systému odhlasovania</h2>
            <form onSubmit={handleSubmit}>
                <input 
                type="text" 
                required 
                value={kidName}
                placeholder='Meno'
                onChange={(e) => setKidName(e.target.value)} 
                />
                <input 
                type="text" 
                required 
                value={kidSurname}
                placeholder='Priezvisko'
                onChange={(e) => setKidSurame(e.target.value)} 
                />
                <input 
                type="date"
                required 
                placeholder='Dátum narodenia'
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)} />
                
                { !isPending && <button>Odoslať</button> }
                { isPending && <button disabled>Pridávam drobca...</button> }
            </form>
            <p className='errMessage'>{errors}</p>
        </div>
    );
}

export default AddKid;