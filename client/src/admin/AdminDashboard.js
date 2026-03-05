import AdminSort from "./AdminSort";

const AdminDashboard = ({ modalMsg }) => {

  const handleKidAction = (message, onConfirm = null) => {
    modalMsg(message, onConfirm);
  };

  return (
      <div>
        <h2>Admin Dashboard</h2>
        <p></p>
        <AdminSort actionMessage={handleKidAction} />
      </div>
    );
}

export default AdminDashboard;