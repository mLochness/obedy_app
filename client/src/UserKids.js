import { API_URL } from './config/env';
import { useEffect, useState, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from './auth/AuthContext';

import DatePicker, { registerLocale } from "react-datepicker";
import sk from "date-fns/locale/sk";
import { addDays } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import { SlSettings } from "react-icons/sl";
import { GoHistory } from "react-icons/go";
import { SlCalender } from "react-icons/sl";
import { SlCheck } from "react-icons/sl";
import { SlClose } from "react-icons/sl";
import { SlTrash } from "react-icons/sl";

const UserKids = ({ actionMessage, skipDate }) => {

  const { userID } = useContext(AuthContext);
  const [data, setData] = useState();
  const [kidsList, setKidsList] = useState([]);
  const [errors, setErrors] = useState([]);
  const [kidID, setKidId] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [kidName, setKidName] = useState(null);
  const [modalKidId, setModalKidId] = useState(null);
  const [editingKidId, setEditingKidId] = useState(null);
  const [editForm, setEditForm] = useState({
    kid_name: "",
    kid_surname: "",
    kid_birth: ""
  });


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

  const nextSkipDate = skipDate;

  const skip = { kidID, skipDate };

  const fetchUserKids = () => {
    setErrors([]);
    const checkSkip = { nextSkipDate, userID };
    setIsPending(true);
    setDatesArr([]);

    fetch(`${API_URL}/api/userkids?user_id=` + userID, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(checkSkip)
    })
      .then((res) => res.json())
      .then((d) => { setData(d) })
      .then(() => { setIsPending(false); })
      .then(() => {
      })
      .catch((err) => {
        setErrors([err.message]);
      });
  }

  useEffect(() => {
    userID && fetchUserKids();
  }, [userID]);

  useEffect(() => {
    if (data) {
      setKidsList([...new Map(data.map(item => [item.kid_id, item])).values()]);
    }
  }, [data]);


  const handleSkipDelete = (skip_id) => {
    setErrors([]);
    setIsPending(true);
    const skipID = { skip_id };

    fetch(`${API_URL}/api/deleteskip`, {
      method: 'DELETE',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(skipID)
    }).then((res) => res.json())
      .then((data) => {
        if (data.message === "success") {
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
      })
  }

  const dateModal = useRef(null);

  const dateRange = (kid_id, kid_name, kid_surname) => {
    dateModal.current.style.transform = 'scale(1)';
    setKidName(kid_name + " " + kid_surname);
    setModalKidId(kid_id);
  }
  const handleDateModalClose = () => {
    dateModal.current.style.transform = 'scale(0)';
    setDatesArr([]);
    setSelectedDates(null);
    setModalKidId(null);
  }
  const handleModalEscape = (event) => {
    if (event.key === 'Escape') {
      handleDateModalClose();
    }
  };

  const multiskip = { modalKidId, datesArr };

  const handleMultiSkip = () => {

    fetch(`${API_URL}/api/multiskip`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(multiskip)
    }).then((res) => res.json())
      .then((data) => {
        if (data.message === "success") {
          setIsPending(false);
          actionMessage("Dieťa bolo odhlásené na zvolené termíny");
          setKidId(null);
          setDatesArr(null);
          fetchUserKids();
        } else {
          setIsPending(false);
          setErrors([data.message]);
        }
      })
      .catch((err) => {
        setErrors([err.message]);
        setIsPending(false);
      })

  }


  const handleInfoButton = async (kid_id, kid_name, kid_surname) => {
    setErrors([]);
    setIsPending(true);
    setKidId(kid_id);
    setKidName(`${kid_name} ${kid_surname}`);
    const kidID = { kid_id };

    fetch(`${API_URL}/api/kidskiplist`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(kidID)
    }).then((res) => res.json())
      .then((d) => {
        setIsPending(false);

        const fullName = `${kid_name} ${kid_surname}`;

        actionMessage(
          <div>
            <h4><strong>{fullName}</strong><br></br>všetky odhlásené termíny:</h4>
            {d.length === 0 ? "Zatiaľ nič" : d.map((skipObj) => {
              return (
                <div className='skipLine' key={skipObj.skip_id}>
                  <div>{skipObj.skip_date} </div>
                </div>
              )
            })}
          </div>
        );
      });
  }


  const handleSave = async (kidId) => {
    try {
      await fetch(`${API_URL}/api/editkid/${kidId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      });

      // update local state without full reload
      setKidsList((prev) =>
        prev.map((kid) =>
          kid.kid_id === kidId ? { ...kid, ...editForm } : kid
        )
      );

      setEditingKidId(null);
    } catch (err) {
      console.error(err);
    }
  };


  const handleDeleteKid = (kidId) => {
    actionMessage(
      "Určite chcete odstrániť dieťa z aplikácie?",
      async () => {
        try {
          const response = await fetch(`${API_URL}/api/deletekid/${kidId}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "x-user-id": userID  // pass the current user ID
            }
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error("Failed to delete kid:", errorData.message || errorData);
            return;
          }

          // Only update state if delete succeeded
          setKidsList((prev) =>
            prev.filter((kid) => kid.kid_id !== kidId)
          );

          setEditingKidId(null);
        } catch (err) {
          console.error("Delete kid request failed:", err);
        }
      }
    );
  };



  if (isPending) {
    return (<div>Loading... </div>
    )
  }

  return (
    <div onKeyDown={handleModalEscape}>
      <h2>Moje deti</h2>

      <div>
        {kidsList.length === 0 ? <Link to="/addkid"><button>Zaregistrujte dieťa</button></Link> : kidsList.map((dataObj) => {
          return (
            <div className="kid-card" key={dataObj.kid_id} >

              {editingKidId === dataObj.kid_id ? (
                <div className="edit-form">
                  <input
                    type="text"
                    value={editForm.kid_name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, kid_name: e.target.value })
                    }
                    placeholder="Name"
                  />

                  <input
                    type="text"
                    value={editForm.kid_surname}
                    onChange={(e) =>
                      setEditForm({ ...editForm, kid_surname: e.target.value })
                    }
                    placeholder="Surname"
                  />

                  <input
                    type="date"
                    value={editForm.kid_birth}
                    onChange={(e) =>
                      setEditForm({ ...editForm, kid_birth: e.target.value })
                    }
                  />

                  <button className='confirm' onClick={() => handleSave(dataObj.kid_id)}>Uložiť <SlCheck /></button>
                  <button className='cancel' onClick={() => setEditingKidId(null)}>Zrušiť <SlClose /></button>
                  <button className='delete' onClick={() => handleDeleteKid(dataObj.kid_id)}>Odstrániť <SlTrash /></button>
                </div>
              ) : (
                <>
                  <div className='kid-nameNdate'>
                    <strong className='kid-name'>
                      {dataObj.kid_name} {dataObj.kid_surname}
                    </strong>
                    <div className="secondaryLine">
                      Nar.: {dataObj.kid_birth.slice(0, 10)}
                    </div>
                  </div>
                  <div className='buttonLine'>


                    <div>
                      <button onClick={() => dateRange(dataObj.kid_id, dataObj.kid_name, dataObj.kid_surname)}>Vyberte dátum <SlCalender /></button>
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
                      <button className="infoBtn"
                        onClick={() => handleInfoButton(dataObj.kid_id, dataObj.kid_name, dataObj.kid_surname)
                        }>História <GoHistory /></button>
                    </div>
                    <div>
                      <button className="editBtn"
                        onClick={() => {
                          setEditingKidId(dataObj.kid_id);
                          setEditForm({
                            kid_name: dataObj.kid_name,
                            kid_surname: dataObj.kid_surname,
                            kid_birth: dataObj.kid_birth.slice(0, 10)
                          });
                        }}
                      >
                        Upraviť <SlSettings />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )

        })}
      </div>
      <br>
      </br>
      <p className='errMessage'>{errors}</p>


      <dialog id="dateModal" className="dateModal" ref={dateModal} onClick={handleDateModalClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <span className="dateModalClose" onClick={handleDateModalClose}>&times;</span>
          <h3>{kidName}</h3>
          <span>Pridať termíny:</span>
          <DatePicker
            locale="sk"
            selectedDates={selectedDates}
            selectsMultiple
            onChange={onDatepickerChange}
            shouldCloseOnSelect={false}
            disabledKeyboardNavigation
            calendarStartDay={1}
            filterDate={isWeekday}
            minDate={new Date(nextSkipDate)}
            //minDate={nextSkipDate ? new Date(nextSkipDate) : new Date()}
            maxDate={addDays(new Date(), 13)}
            dateFormat="yyyy-MM-dd"
            inline
          />

          {listDates}
          {listDates.length === 0 ? "" : <button onClick={handleMultiSkip}>ODHLÁSIŤ TERMÍNY</button>}
        </div>
      </dialog>

    </div>
  )
}

export default UserKids;