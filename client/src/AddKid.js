import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddKid = () => {
    const [kidName, setKidName] = useState('');
    const [kidSurname, setKidSurame] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [userID, setUserID] = useState('1');
    const [isPending, setIsPending] = useState(false);
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
            redirect('/kids');
        })

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
        </div>
    );
}

export default AddKid;