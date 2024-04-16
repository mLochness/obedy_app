import React, { useState, useEffect } from 'react';

const Countdown = () => {

  const [count, setCount] = useState(0);

  var today = new Date();
  let tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  
  var dayOfWeek = today.getDay();
  //const weekdays = ["Nedeľa", "Pondelok", "Utorok", "Streda", "Štvrtok", "Piatok", "Sobota"];
  // var isWeekend = (dayOfWeek === 6) || (dayOfWeek === 0);
  // console.log('is it weekend?', isWeekend, weekdays[dayOfWeek]);
  if (dayOfWeek === 5) {
    tomorrow.setDate(today.getDate() + 3);
  }
  if (dayOfWeek === 6) {
    tomorrow.setDate(today.getDate() + 2);
    //console.log(weekdays[dayOfWeek]);
  }
  let todayLimit = today.setHours(7, 30, 0);
  //console.log('whatDay?', weekdays[dayOfWeek]);
  let nextLimit = tomorrow.setHours(7, 30, 0);
  var now = new Date().getTime();
  var countDownDate = new Date();

  if (now < todayLimit) {
    countDownDate = todayLimit
  } else {
    countDownDate = nextLimit
  }
  //console.log('tomorrow: ', tomorrow);
  var cDate = new Date(countDownDate);
  var dateOutput = (cDate.getDate() + " / " + (cDate.getMonth() + 1) + " / " + cDate.getFullYear());

  var distance = countDownDate - now;
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var minDisplay = minutes.toString().length === 1 ? "0" + minutes : minutes;
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);
  var secDisplay = seconds.toString().length === 1 ? "0" + seconds : seconds;
  var timeLeft = days + "d " + hours + "h " + minDisplay + "m " + secDisplay + "s ";

  useEffect(() => {

    //Implementing the setInterval method 
    const interval = setInterval(() => {
      setCount(count + 1);
    }, 1000);

    //Clearing the interval 
    return () => clearInterval(interval);
  }, [count]);



  return (
    <div className='countDown'>
      <p>Do najbližšieho termínu {"( " + dateOutput + " )"} ostáva</p>
      <h1>{timeLeft}</h1>
    </div>);

}

export default Countdown;