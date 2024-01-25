
import { useEffect, useState } from "react";
//import axios from "axios";
function TestCallAPI() {

  // const url = "https://jsonplaceholder.typicode.com/users";
  const url = "http://localhost:3001/users";

  const [data, setData] = useState([]);


  const fetchInfo = () => {
    return fetch(url)
      .then((res) => res.json())
      .then((d) => setData(d))
  }

  useEffect(() => {
    fetchInfo();
  }, [])

  // useEffect(()=>{
  //   axios.get("http://localhost:3001/users")
  //   .then((d)=>{
  //   setData(d.data)
  //   });
  //   },[])


  return (
    <div>
      <p>test of API:</p>
      <div>
        {data.map((dataObj, index) => {
          return (
          <div className='testline' key={dataObj.id}> {dataObj.id} : {dataObj.username} </div>
          )
        })}
      </div>
    </div>
  )
}

export default TestCallAPI; 
