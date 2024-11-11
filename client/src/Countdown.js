import React, { useState, useEffect } from 'react';


const Countdown = ({ skipDate, dateUpdate }) => {

  const [count, setCount] = useState(0);
  const [timeUpdate, setTimeUpdate] = useState(false);
    
  var today = new Date();
  let nextDay = new Date();
  nextDay.setDate(today.getDate() + 1);
  var now = new Date().getTime();
  var dayOfWeek = today.getDay();
  const dayNames = ["Nedeľa", "Pondelok", "Utorok", "Streda", "Štvrtok", "Piatok", "Sobota"];
  var showDayName = dayNames[dayOfWeek];
  let todayLimit = today.setHours(7, 30, 0);
  let nextLimit = nextDay.setHours(7, 30, 0);
  var countDownDate = nextLimit;
  

  if (dayOfWeek === 6) {
    nextLimit = nextDay.setDate(today.getDate() + 2);
    showDayName = dayNames[1];
    countDownDate = nextLimit;
  }
  else if (dayOfWeek === 0) {
    nextLimit = nextDay.setDate(today.getDate() + 1);
    showDayName = dayNames[1];
    countDownDate = nextLimit;
  }
  else if (dayOfWeek === 5 && now > todayLimit) {
    nextDay.setDate(today.getDate() + 3);
    showDayName = dayNames[1];
    nextLimit = nextDay.setHours(7, 30, 0);
    countDownDate = nextLimit;
  }
  else if ((now < todayLimit) && (dayOfWeek !== 0 && dayOfWeek !== 6))  {
    countDownDate = todayLimit;
    showDayName = dayNames[dayOfWeek];
  } 
  else {
    showDayName = dayNames[dayOfWeek + 1];
    countDownDate = nextLimit;
  }
  
 
  var cDate = new Date(countDownDate);
  var dateOutput = (cDate.getDate() + "-" + (cDate.getMonth() + 1) + "-" + cDate.getFullYear());

  var distance = countDownDate - now;
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var minDisplay = minutes.toString().length === 1 ? "0" + minutes : minutes;
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);
  var secDisplay = seconds.toString().length === 1 ? "0" + seconds : seconds;
  var timeLeft = days + "d " + hours + "h " + minDisplay + "m " + secDisplay + "s ";

  var dateWatch = (cDate.getFullYear() + "-" + (cDate.getMonth() + 1) + "-" + cDate.getDate());
  useEffect(() => {
    //Implementing the setInterval method 
    const interval = setInterval(() => {
      setCount(count + 1);

      if (dateWatch !== nextSkipDate) {
        console.log("New time limit begun...");
        setTimeUpdate(!timeUpdate);
      }

    }, 1000);
    //Clearing the interval 
    return () => clearInterval(interval);
  }, [count]);

  const [nextSkipDate, setNextSkipDate] = useState(dateWatch);



  useEffect(() => {
    setNextSkipDate(dateWatch);
    console.log("Countdown - setting nextSkipDate:", nextSkipDate);
    skipDate = nextSkipDate;
    dateUpdate(skipDate);
    console.log("timeUpdate value:", timeUpdate);
    console.log("skipDate:", skipDate);
  }, [timeUpdate])


  return (
    <div className='countDown'>
      <p>Do najbližšieho termínu {"(\u00A0" + showDayName + " " + dateOutput + "\u00A0)"} ostáva</p>
      <h1>{timeLeft}</h1>
    </div>);

}

export default Countdown;