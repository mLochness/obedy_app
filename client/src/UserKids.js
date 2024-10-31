import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from './auth/AuthContext';
import DatePicker from "react-datepicker";
import { forwardRef } from "react";

import "react-datepicker/dist/react-datepicker.css";

const UserKids = ({ actionMessage, skipDate }) => {

  //const dataFetched = localStorage.getItem("userChildData");
  const { userID } = useContext(AuthContext);
  const [data, setData] = useState();
  const [errors, setErrors] = useState([]);
  const [kidID, setKidId] = useState(null);
  const [isPending, setIsPending] = useState(true);
  
  //datepicker:
  const [startDate, setStartDate] = useState(new Date());
  const ChooseDateButton = forwardRef(
    ({ value, onClick, className }, ref) => (
      <button className={className} onClick={onClick} ref={ref}>
        Vyberte dátum
      </button>
    ),
  );

  //const [nextSkipDate, setNextSkipDate] = useState(skipDate);
  let nextSkipDate = skipDate;
  console.log("userKids - nextSkipDate:", skipDate);


  //const skip = { kidID, nextSkipDate };
  const skip = { kidID, skipDate };
  //console.log("userKids - skip:", skip);


  const fetchUserKids = () => {
    //let currentTime = new Date();
    //const nowSkip = "'" + currentTime.getFullYear() + "-" + (currentTime.getMonth() + 1) + "-" + currentTime.getDate() + "'";
    //const nowSkip = currentTime.getFullYear() + "-" + (currentTime.getMonth() + 1) + "-" + currentTime.getDate();
    //const checkSkip = { nowSkip, userID };
    const checkSkip = { nextSkipDate, userID };
    console.log("fetchUserKids skipDate:", nextSkipDate)
    setIsPending(true);
    console.log("fetchUserKids userID:", userID);
    //console.log("fetchUserKids skipDate (local):", nowSkip);

    // return fetch(`http://localhost:3001/userkids?user_id=${userID}`)
    //return fetch("http://localhost:3001/userkids?user_id=" + userID, {
    fetch("http://localhost:3001/userkids?user_id=" + userID, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(checkSkip)
    })
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
    userID && fetchUserKids();
    console.log("userKids useEffect RUN, userID:", userID);
  }, [userID]);



  const handleKidSignout = (kid_id) => {
    setErrors([]);
    //currentTime = new Date();
    //current date - testing purpose !!!:
    //setNextSkipDate(currentTime.getFullYear() + "-" + (currentTime.getMonth() + 1) + "-" + currentTime.getDate());
    setKidId(kid_id);
    setIsPending(true);
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
          actionMessage("Dieťa bolo odhlásené");
          setKidId(null);
          //setNextSkipDate(null);
          fetchUserKids();
        } else {
          setIsPending(false);
          //setErrors("Nastala chyba, skúste to neskôr");
          setErrors([data.message]);
        }
      })
      .catch((err) => {
        setErrors([err.message]);
        setIsPending(false);
        console.log("errors:", err);
      })

  }

  useEffect(() => {
    if (kidID !== null && nextSkipDate !== null) {
      kidSkip();
    }
  }, [skip]);


  const handleSkipDelete = (skip_id) => {
    setErrors([]);
    setIsPending(true);
    console.log("skip_id:", skip_id);
    const skipID = { skip_id };

    fetch("http://localhost:3001/deleteskip", {
      method: 'DELETE',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(skipID)
    }).then((res) => res.json())
      .then((data) => {
        if (data.message === "success") {
          console.log("skip deleted");
          actionMessage("Odhlásenie bolo zrušené");
          fetchUserKids();
        } else {
          setErrors([data.message]);
        }
        setIsPending(false);
      })
      .catch((err) => {
        setErrors([err.message]);
        setIsPending(false);
        console.log("errors:", err);
      })

    console.log("handleSkipDelete END");
  }


  if (isPending) {
    return (<div>Loading... </div>
    )
  }

  return (
    <div>
      <p>*****UserKids test date: {skipDate}</p>
      <h2>Moje deti</h2>
      <div className='itemLine itemLineHead'>
        <div><div>Meno</div>
          <div className="secondaryLine">Dátum nar.</div></div>
        <div>Skip status..</div>
        <div>Iný dátum</div>
      </div>
      <div>
        {data.length === 0 ? <Link to="/addkid">Zaregistrujte dieťa</Link> : data.map((dataObj) => {
          return (
            <div className='itemLine' key={dataObj.kid_id}>
              <div><div>{dataObj.kid_name} {dataObj.kid_surname}</div>
                <div className="secondaryLine">{dataObj.kid_birth.slice(0, 10)}</div></div>
              <div>{dataObj.skip_date ? 
                <button className="revertBtn" onClick={(() => handleSkipDelete(dataObj.skip_id))}>ZRUŠIŤ</button> 
                : 
                <button onClick={(() => handleKidSignout(dataObj.kid_id))}>ODHLÁSIŤ</button>}</div>
              <div><DatePicker selected={startDate} onChange={(date) => setStartDate(date)} customInput={<ChooseDateButton className="chooseDateButton" />} /></div>
            </div>
          )
        })}
      </div>
      <br>
      </br>
      <p className='errMessage'>{errors}</p>

    </div>
  )
}

export default UserKids;