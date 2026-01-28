import { API_URL } from './config/env';
import { useEffect, useState } from "react";

function UsersList() { 

  const [data, setData] = useState([]);

  const fetchInfo = () => {
    // return fetch("http://localhost:3001/users")
    return fetch(`${API_URL}/api/users`)
      .then((res) => res.json())
      .then((d) => setData(d))
  }

  useEffect(() => {
    fetchInfo();
  }, [])


  return (
    <div>
      <p>Zaregistrovaní používatelia:</p>
      <div className='itemLine itemLineHead'> 
            <div>ID</div> <div>Meno</div> <div>E-mail</div>
            </div>
        <div>
          {data.map((dataObj) => {
            return (
            <div className='itemLine' key={dataObj.user_id}> 
            <div>{dataObj.user_id}</div> <div>{dataObj.username}</div> <div>{dataObj.email}</div>
            </div>
            )
          })}
        </div>
    </div>
  )
}

export default UsersList;