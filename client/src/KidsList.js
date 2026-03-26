import { API_URL } from './config/env';
import { useEffect, useState } from "react";

const KidsList = () => {

  const [data, setData] = useState([]);
  const [isPending, setIsPending] = useState(false);


  useEffect(() => {
    setIsPending(true);
    fetch(`${API_URL}/api/kids`, {
      method: 'GET',
      headers: { "Content-Type": "application/json" },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        setIsPending(false);
        return response.json();
      })
      .then(data => {
        setData(data); // Update state with data
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, [])


  return (
    <div>
      <p>Zaregistrované deti:</p>
      <div className='itemLine itemLineHead'>
        <div>Meno</div> <div>Priezvisko</div> <div>Dátum narodenia</div>
      </div>
      <div>
        {isPending ? <p>Loading...</p>: (data.map((dataObj) => {
          return (
            <div className='itemLine' key={dataObj.kid_id}>
              <div>{dataObj.kid_name}</div> <div>{dataObj.kid_surname}</div> <div>{dataObj.kid_birth.slice(0, 10)}</div>
            </div>
          )
        }))
        }
      </div>
    </div>
  )
}

export default KidsList;