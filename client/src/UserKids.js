import { useEffect, useState, useContext } from "react";
import { AuthContext } from './auth/AuthContext';

const UserKids = () => {

    const { userID } = useContext(AuthContext);
    const [data, setData] = useState([]);
    console.log("userKids - userID:", userID);
    
    const fetchInfo = () => {
      // return fetch(`http://localhost:3001/userkids?user_id=${userID}`)
      return fetch("http://localhost:3001/userkids?user_id=" + userID)
        .then((res) => res.json())
        .then((d) => setData(d))  
        .then(() => console.log( "fetched userID:", userID, '\n', "UserKids data:", data))
      }
  

    useEffect(() => {
      fetchInfo();
    }, [])
  

    return (
      <div>
        <p>Moje deti:</p>
        <div className='itemLine itemLineHead'> 
            <div>Meno</div> <div>Priezvisko</div> <div>Dátum narodenia</div>
            </div>
        <div>
          {data && data.map((dataObj) => {
            return (
            <div className='itemLine' key={dataObj.kid_id}> 
            <div>{dataObj.kid_name}</div> <div>{dataObj.kid_surname}</div> <div>{dataObj.kid_birth.slice(0, 10)}</div>
            </div>
            )
          })}
        </div>
      </div>
    )
}

export default UserKids;