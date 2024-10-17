import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from './auth/AuthContext';

const UserKids = ({ actionMessage }) => {

  //const dataFetched = localStorage.getItem("userChildData");
  const { userID } = useContext(AuthContext);
  const [data, setData] = useState();
  const [errors, setErrors] = useState([]);
  const [kidID, setKidId] = useState(null);
  const [isPending, setIsPending] = useState(true);
  var currentTime;
  const [skipDate, setSkipDate] = useState(null);

  const skip = { kidID, skipDate };

  const [testOutput, setTestOutput] = useState(null);


  const fetchUserKids = () => {
    setIsPending(true);
    console.log("userKids - fetchUserKids userID:", userID);
    // return fetch(`http://localhost:3001/userkids?user_id=${userID}`)
    return fetch("http://localhost:3001/userkids?user_id=" + userID)
      .then((res) => res.json())
      .then((d) => { setData(d) })
      //.then(() => localStorage.setItem("userChildData", JSON.stringify(data)))
      .then(() => { setIsPending(false); })
      .then(() => console.log("fetched UserKids data:", data))
      .catch((err) => {
        setErrors([err.message]);
        console.log("errors:", errors);
      });

  }

  useEffect(() => {
    fetchUserKids();
    console.log("userKids useEffect RUN, userID:", userID);
  }, [userID]);


  const handleKidSignout = (e, kid_id) => {
    setErrors([]);
    currentTime = new Date();
    //current date - testing purpose !!!:
    setSkipDate(currentTime.getFullYear() + "-" + (currentTime.getMonth() + 1) + "-" + currentTime.getDate());
    setKidId(kid_id);

    setIsPending(true);
    //setErrors([]);
  
    // if (kidID !== null) { 
    //         kidSkip();
    //       }

     console.log("handleKidSignout END");
  }

  const kidSkip = () => {
    console.log("skip RUN");
    //const skip = { kidID, skipDate };
    console.log("skip data:", skip);
    fetch('http://localhost:3001/addskip', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(skip)
    }).then((res) => res.json())
      .then((data) => {
        if (data.message === "success") {
          console.log("skip added");
          setIsPending(false);
          actionMessage("Dieťa bolo odhlásené - testMessage");
          setKidId(null);
          setSkipDate(null);
        } else {
          setIsPending(false);
          //setErrors("Nastala chyba, skúste to neskôr");
          setErrors([data.message]);
        }
      })
      .catch((err) => {
        setErrors([err.message]);
        setIsPending(false);
        //setErrors("Nastala chyba (catchErr)");
        console.log("errors:", err);
      })

  }

  useEffect(() => {
    if (kidID !== null) { 
      kidSkip();
    }
 }, [skip]);


  const testInfo = (e, kid_id) => {
    setTestOutput(kid_id);
  }


  if (isPending) {
    return (<div>Loading... </div>
    )

  }

  return (
    <div>
      <h2>Moje deti</h2>
      <div className='itemLine itemLineHead'>
        <div>Meno</div> <div>Priezvisko</div> <div>Dátum narodenia</div>
      </div>
      <div>
        {data.length === 0 ? <Link to="/addkid">Zaregistrujte dieťa</Link> : data.map((dataObj) => {
          return (
            <div className='itemLine' key={dataObj.kid_id} onClick={(e) => testInfo(e, dataObj.kid_id)}>
              <div>{dataObj.kid_name}</div> <div>{dataObj.kid_surname}</div> <div>{dataObj.kid_birth.slice(0, 10)}</div>
              <button onClick={((e) => handleKidSignout(e, dataObj.kid_id))}>ODHLÁSIŤ</button>
            </div>
          )
        })}
      </div>
      <p className='errMessage'>{errors}</p>
      
      <br>
      </br>
      <p>clicked kid ID: {testOutput}</p>


    </div>
  )
}

export default UserKids;