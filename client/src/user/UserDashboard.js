import UserKids from "../UserKids";

const UserDashboard = ({ modalMsg, kidsAction, skipDate }) => { 
  

  const handleKidAction = (data) => {
    modalMsg(data);
    kidsAction();
  }

    return (
      <div>
        <UserKids skipDate={skipDate} actionMessage={handleKidAction} />
      </div>
    );
  }

  export default UserDashboard;