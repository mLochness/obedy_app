import { useState, useEffect } from "react";
import UserKids from "../UserKids";

const UserDashboard = ({ modalMsg, kidsAction }) => { 
  

  const [isFetched, setIsFetched] = useState();


  const handleKidAction = (data) => {
    modalMsg(data);
    kidsAction();
  }

  const fetchOK = () => {
    setIsFetched(true);
    console.log("kids data fetched");
  }

  // useEffect(() => {
  //   (async () => {
  //     setIsFetched(false);
  //   })();
  // }, []);

  // if (!isFetched) {
  //   return (<div>UserKids loading...</div>)
  // }
    return (
      <div>
        <UserKids actionMessage={handleKidAction} fetchDone={fetchOK}/>
      {/* { isFetched? <UserKids actionMessage={handleKidAction} fetchDone={fetchOK}/> : <div>Loading ...</div>} */}
      </div>
    );
  }

  export default UserDashboard;