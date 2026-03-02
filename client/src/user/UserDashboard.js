import UserKids from "../UserKids";

const UserDashboard = ({ modalMsg, skipDate }) => {


  const handleKidAction = (message, onConfirm = null) => {
    modalMsg(message, onConfirm);
  };

  return (
    <div>
      <UserKids skipDate={skipDate} actionMessage={handleKidAction} />
    </div>
  );
}

export default UserDashboard;