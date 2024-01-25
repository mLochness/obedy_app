import { useEffect, useState } from "react";
// import { format } from 'date-fns';

const KidsList = () => {

    const [data, setData] = useState([]);
    
    const fetchInfo = () => {
      return fetch("http://localhost:3001/kids")
        .then((res) => res.json())
        .then((d) => setData(d))
    }
  
    useEffect(() => {
      fetchInfo();
      
    }, [])
  
  
    return (
      <div>
        <p>Zaregistrované deti:</p>
        <div>
          {data.map((dataObj, index) => {
            return (
                
            <div className='itemLine' key={dataObj.kid_id}> 
            <div>{dataObj.kid_name}</div> <div>{dataObj.kid_surname}</div> <div>{dataObj.kid_birth}</div>
            </div>
            )
          })}
        </div>
      </div>
    )
}

export default KidsList;