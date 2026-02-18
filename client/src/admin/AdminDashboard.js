import AdminSort from "./AdminSort";

const AdminDashboard = () => {

  //console.log("A-dashboard token:", token);
    return (
      <div>
        <h2>Admin Dashboard</h2>
        <p></p>
        <p>Zoradiť podľa:</p>
        <AdminSort/>
      </div>
    );
}

export default AdminDashboard;