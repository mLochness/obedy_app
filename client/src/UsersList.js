import { API_URL } from './config/env';
import { useEffect, useState } from "react";

function UsersList() {

  const [data, setData] = useState([]);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    setIsPending(true);
    fetch(`${API_URL}/api/users`, {
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
      <p>Zaregistrovaní používatelia:</p>
      <div className='itemLine itemLineHead'>
        <div>ID</div> <div>Meno</div> <div>E-mail</div>
      </div>
      <div>
        {isPending ? <p>Loading...</p> : (data.map((dataObj) => {
          return (
            <div className='itemLine' key={dataObj.user_id}>
              <div>{dataObj.user_id}</div> <div>{dataObj.username}</div> <div>{dataObj.email}</div>
            </div>
          )
        })
        )}
      </div>
    </div>
  )
}

export default UsersList;