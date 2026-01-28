import { API_URL } from './config/env';
import { useEffect, useState } from "react";

const KidsList = () => {

    const [data, setData] = useState([]);
    
    const fetchInfo = () => {
      // return fetch("http://localhost:3001/kids")
      return fetch(`${API_URL}/api/kids`)
        .then((res) => res.json())
        .then((d) => setData(d))    
      }
  
    

    useEffect(() => {
      fetchInfo();
      console.log("kidsList data:", data);
    }, [])
  

    return (
      <div>
        <p>Zaregistrované deti:</p>
        <div className='itemLine itemLineHead'> 
            <div>Meno</div> <div>Priezvisko</div> <div>Dátum narodenia</div>
            </div>
        <div>
          {data.map((dataObj) => {
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

export default KidsList;