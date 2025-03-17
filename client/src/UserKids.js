import { useEffect, useState, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from './auth/AuthContext';

import DatePicker, { registerLocale } from "react-datepicker";
import sk from "date-fns/locale/sk";
import { addDays } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";

const UserKids = ({ actionMessage, skipDate }) => {

  const { userID } = useContext(AuthContext);
  const [data, setData] = useState();
  const [kidsList, setKidsList] = useState([]);
  const [errors, setErrors] = useState([]);
  const [kidID, setKidId] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [kidName, setKidName] = useState(null);
  const [modalKidId, setModalKidId] = useState(null);
  const [kidSkipList, setKidSkipList] = useState([]);


  //datepicker:
  registerLocale("sk", sk);
  const [selectedDates, setSelectedDates] = useState([]);
  const [datesArr, setDatesArr] = useState([]);
  const onDatepickerChange = (dates) => {
    setSelectedDates(dates);
    setDatesArr(dates.map((el) => {
      var d = new Date(el);
      return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    }));

  };
  const listDates = datesArr.map(selDate => { return <li key={selDate} id={selDate}>{selDate}</li> });
  const isWeekday = (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };

  //datepicker custom trigger - button:
  // const ChooseDateButton = forwardRef(
  //   ({ value, onClick, className, key }, ref) => (
  //     <button className={className} onClick={onClick} ref={ref} key={key}>
  //       Vyberte dátum
  //     </button>
  //   ),
  // );

  let nextSkipDate = skipDate;
  //console.log("userKids - nextSkipDate:", skipDate);

  const skip = { kidID, skipDate };

  const fetchUserKids = () => {
    setErrors([]);
    const checkSkip = { nextSkipDate, userID };
    console.log("fetchUserKids skipDate:", nextSkipDate)
    setIsPending(true);
    console.log("fetchUserKids userID:", userID);
    setDatesArr([]);

    fetch("http://localhost:3001/userkids?user_id=" + userID, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(checkSkip)
    })
      .then((res) => res.json())
      .then((d) => { setData(d) })
      .then(() => { setIsPending(false); })
      .then(() => {
        console.log("fetched UserKids data not set yet? :", data);
      })
      .catch((err) => {
        setErrors([err.message]);
        console.log("errors:", err);
      });

  }

  useEffect(() => {
    userID && fetchUserKids();
  }, [userID]);

  useEffect(() => {
    console.log("data useEffect RUN, data:", data);
    if (data) {
      setKidsList([...new Map(data.map(item => [item.kid_id, item])).values()]);
    }
  }, [data]);


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
          fetchUserKids();
        } else {
          setIsPending(false);
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

  const dateModal = useRef(null);
  // window.onclick = function (event) {
  //   if (event.target === dateModal) {
  //     dateModal.current.style.display = "none";
  //   }
  // }
  const dateRange = (kid_id, kid_name, kid_surname) => {
    //dateModal.current.style.display = "block";
    dateModal.current.style.transform = 'scale(1)';
    setKidName(kid_name + " " + kid_surname);
    setModalKidId(kid_id);
    //handleMultiSkip();
  }
  const handleDateModalClose = () => {
    dateModal.current.style.transform = 'scale(0)'
  }
  const handleModalEscape = (event) => {
    if (event.key === 'Escape') {
      handleDateModalClose();
    }
  };

  const multiskip = { modalKidId, datesArr };

  const handleMultiSkip = () => {
    console.log("multiskip:", multiskip);
    console.log("datesArr:", datesArr);
    fetch('http://localhost:3001/multiskip', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(multiskip)
    }).then((res) => res.json())
      .then((data) => {
        if (data.message === "success") {
          console.log("multiskip added");
          setIsPending(false);
          actionMessage("Dieťa bolo odhlásené na zvolené termíny");
          setKidId(null);
          setDatesArr(null);
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

  const handleInfoButton = (kid_id) => {
    setErrors([]);
    setIsPending(true);
    setKidSkipList([]);
    console.log("infoButton kid_id", kid_id);
    const kidID = { kid_id };

    fetch("http://localhost:3001/kidskiplist", {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(kidID)
    }).then((res) => res.json())
      .then((d) => {
        setKidSkipList(d);
        setIsPending(false);
      })
      .catch((err) => {
        setErrors([err.message]);
        setIsPending(false);
        console.log("errors:", err);
      })

    console.log("handleInfoButton END");

  }

  useEffect(() => {
    console.log("skiplist useEffect RUN, data:", kidSkipList);
    if (kidSkipList.length > 0) {
      actionMessage(
        <div>
           <h4><strong>{kidName} </strong><br></br>všetky odhlásené termíny:</h4>
          {}
          {kidSkipList.length === 0 ? "No data" : kidSkipList.map((skipObj) => {
            return (
              <div className='skipLine' key={skipObj.skip_id}>
                <div>{skipObj.skip_date} </div>
              </div>
            )
          })}
        </div>
      )
    }
  }, [kidSkipList]);


  if (isPending) {
    return (<div>Loading... </div>
    )
  }

  return (
    <div onKeyDown={handleModalEscape}>
      <h2>Moje deti</h2>
      <div className='itemLine itemLineHead'>
        <div><div>Meno</div>
          <div className="secondaryLine">Dátum nar.</div></div>
        <div>Odhlásenie</div>
        <div>Odhlásené termíny</div>
        <div>História</div>
      </div>
      <div>
        {kidsList.length === 0 ? <Link to="/addkid"><button>Zaregistrujte dieťa</button></Link> : kidsList.map((dataObj) => {
          return (
            <div className='itemLine' key={dataObj.kid_id}>

              <div>
                <div>{dataObj.kid_name} {dataObj.kid_surname}</div>
                <div className="secondaryLine">{dataObj.kid_birth.slice(0, 10)}</div>
              </div>
              <div>
                <button onClick={() => dateRange(dataObj.kid_id, dataObj.kid_name, dataObj.kid_surname)}>VYBERTE DÁTUM</button>
              </div>
              <div>{
                data.map((skipObj) => {
                  return (
                    <div className="dateRegistered" key={skipObj.kid_id + "-" + skipObj.skip_id}>{dataObj.kid_id === skipObj.kid_id && skipObj.skip_date ?
                      <div>{skipObj.skip_date} &nbsp; <button className="revertBtn" onClick={() => handleSkipDelete(skipObj.skip_id)}>✕</button></div>
                      :
                      ""
                    }</div>
                  )
                })
              }
              </div>
              <div>
                <button className="infoBtn" onClick={() => handleInfoButton(dataObj.kid_id)}>História</button>
              </div>

            </div>
          )
        })}
      </div>
      <br>
      </br>
      <p className='errMessage'>{errors}</p>

      {/* <div>
        <h3>SkipList output:</h3>
        {kidSkipList && kidSkipList.map((skipObj) => {
          return (
            <div className='skipLine' key={skipObj.skip_id}>
              <div>{skipObj.skip_date} </div>
            </div>
          )
        })}
      </div> */}

      <dialog id="dateModal" className="dateModal" ref={dateModal} onClick={handleDateModalClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <span className="dateModalClose" onClick={handleDateModalClose}>&times;</span>
          <h3>{kidName}</h3>
          kid ID: {modalKidId}
          <DatePicker
            locale="sk"
            selectedDates={selectedDates}
            selectsMultiple
            //onChange={onChange}
            onChange={onDatepickerChange}
            shouldCloseOnSelect={false}
            disabledKeyboardNavigation
            calendarStartDay={1}
            filterDate={isWeekday}
            minDate={new Date()}
            maxDate={addDays(new Date(), 13)}
            dateFormat="yyyy-MM-dd"
            inline
          // customInput={<ChooseDateButton className="chooseDateButton" />}

          />

          {listDates}
          {listDates.length === 0 ? "" : <button onClick={handleMultiSkip}>ODHLÁSIŤ TERMÍNY</button>}
        </div>
      </dialog>

    </div>
  )
}

export default UserKids;