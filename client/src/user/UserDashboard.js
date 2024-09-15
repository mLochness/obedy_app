

import UserKids from "../UserKids";

const UserDashboard = ({ modalMsg, kidsAction }) => { 
  

  const handleKidAction = (data) => {
    modalMsg(data);
    kidsAction();
  }

    return (
      <div>
      <h2>Moje deti</h2>
      <UserKids actionMessage={handleKidAction}/>
      </div>
    );
  }

  export default UserDashboard;