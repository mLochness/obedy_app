import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from './auth/AuthContext';

import DatePicker, { registerLocale } from "react-datepicker";
import sk from "date-fns/locale/sk";
import { forwardRef } from "react";
import { addDays } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";

const UserKids = ({ actionMessage, skipDate }) => {

  //const dataFetched = localStorage.getItem("userChildData");
  const { userID } = useContext(AuthContext);
  const [data, setData] = useState();
  const [errors, setErrors] = useState([]);
  const [kidID, setKidId] = useState(null);
  const [isPending, setIsPending] = useState(true);
  

  //datepicker:
  registerLocale("sk", sk);
  const [selectedDates, setSelectedDates] = useState([]);
  //let datesArr = [];
  const [datesArr, setDatesArr] = useState([]);
  //const [listDates, setListDates] = useState(datesArr.map(selDate => { return {selDate}}));
  //var listDates;
  const onChange = (dates) => {
    setSelectedDates(dates);
    
    setDatesArr(dates.map((el) => {
      var d = new Date(el);
      return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
    }));
    console.log("selected dates (datesArr):", datesArr);
    console.log("list dates:", listDates);
    
  };
  const listDates = datesArr.map(selDate => { return <li>{selDate}</li>});
  const isWeekday = (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };

  const ChooseDateButton = forwardRef(
    ({ value, onClick, className }, ref) => (
      <button className={className} onClick={onClick} ref={ref}>
        Vyberte dátum
      </button>
    ),
  );

  let nextSkipDate = skipDate;
  console.log("userKids - nextSkipDate:", skipDate);

  const skip = { kidID, skipDate };

  const fetchUserKids = () => {
    const checkSkip = { nextSkipDate, userID };
    console.log("fetchUserKids skipDate:", nextSkipDate)
    setIsPending(true);
    console.log("fetchUserKids userID:", userID);

    fetch("http://localhost:3001/userkids?user_id=" + userID, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(checkSkip)
    })
      .then((res) => res.json())
      .then((d) => { setData(d) })
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
    setKidId(kid_id);
    setIsPending(true);
    console.log("handleKidSignout END");
  }

  const kidSkip = () => {
    console.log("skip RUN");
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
      <h2>Moje deti</h2>
      <div className='itemLine itemLineHead'>
        <div><div>Meno</div>
          <div className="secondaryLine">Dátum nar.</div></div>
        <div>Najbližší dátum</div>
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
              <div>
                <DatePicker
                locale="sk"
                  selectedDates={selectedDates}
                  selectsMultiple
                  onChange={onChange}
                  shouldCloseOnSelect={false}
                  disabledKeyboardNavigation
                  calendarStartDay={1}
                  filterDate={isWeekday}
                  minDate={new Date()}
                  maxDate={addDays(new Date(), 13)}
                  dateFormat="yyyy-MM-dd"
                  customInput={<ChooseDateButton className="chooseDateButton" />}
                />
              </div>
            </div>
          )
        })}
      </div>
      <br>
      </br>
      <p className='errMessage'>{errors}</p>

      <div>Vybraný rozsah: <ul>{listDates}</ul> </div>

    </div>
  )
}

export default UserKids;