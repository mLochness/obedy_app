import { useEffect, useState } from "react";

function UsersList() { 

  const [data, setData] = useState([]);

  const fetchInfo = () => {
    return fetch("http://localhost:3001/users")
      .then((res) => res.json())
      .then((d) => setData(d))
  }

  useEffect(() => {
    fetchInfo();
    
  }, [])


  return (
    <div>
      <p>Zaregistrovaní používatelia:</p>
      <div>
        {data.map((dataObj, index) => {
          return (
          <div className='testline' key={dataObj.user_id}> {dataObj.user_id} : {dataObj.username} </div>
          )
        })}
      </div>
    </div>
  )
}

export default UsersList;