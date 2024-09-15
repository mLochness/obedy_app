import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from './auth/AuthContext';

const UserKids = ({ actionMessage }) => {

    //const dataFetched = localStorage.getItem("userChildData");
    const { userID } = useContext(AuthContext);
    const [data, setData] = useState([]);
    const [errors, setErrors] = useState([]);
    const [kidID, setKidId] = useState("");
    const [isPending, setIsPending] = useState(false);
    const [skipDate, setSkipDate] = useState(new Date().getTime());
    console.log("userKids - userID:", userID);

    const handleKidSignout = (e, dataObj) => {
        e.preventDefault();
        setKidId(dataObj.kid_id);
        console.log("selected kidID:", kidID)
        const skip = { kidID, skipDate};

        setIsPending(true);

        fetch('http://localhost:3001/addskip', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(skip)
        }).then(() => {
            console.log("skip added");
            setIsPending(false);
        }).catch((error) => {
          setErrors([error.message]);
        })

      actionMessage("Dieťa bolo odhlásené - testMessage")
    }
    
    const fetchUserKids = () => {
      // return fetch(`http://localhost:3001/userkids?user_id=${userID}`)
      return fetch("http://localhost:3001/userkids?user_id=" + userID)
        .then((res) => res.json())
        .then((d) => setData(d))  
        .then(() => console.log( "fetched userID:", userID,'\n',"UserKids data:", data))
        .then(() => localStorage.setItem("userChildData", JSON.stringify(data)))
        .catch((error) => {
          setErrors([error.message]);
        })
      }

    // if( data.length === 0 ) {
    //   fetchInfo();
    // }
  

    useEffect(() => {
      fetchUserKids();
      console.log("userKids useEffect RUN");
    }, [])
  

    return (
      <div>
        <div className='itemLine itemLineHead'> 
            <div>Meno</div> <div>Priezvisko</div> <div>Dátum narodenia</div>
            </div>
            <p className='errMessage'>{errors}</p>
        <div>
          {data.length === 0 ? <Link to="/addkid">Zaregistrujte dieťa</Link> : data.map((dataObj) => {
            return (
            <div className='itemLine' key={dataObj.kid_id}> 
            <div>{dataObj.kid_name}</div> <div>{dataObj.kid_surname}</div> <div>{dataObj.kid_birth.slice(0, 10)}</div>
            {/* <button onClick={handleKidSignout}>ODHLÁSIŤ</button> */}
            <button onClick={((e) => handleKidSignout(e, dataObj))}>ODHLÁSIŤ</button>
            </div>
            )
          }) }
        </div>
      </div>
    )
}

export default UserKids;