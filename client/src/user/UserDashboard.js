

//import KidDetails from "../KidDetails";
import UserKids from "../UserKids";

const UserDashboard = () => { 

  // // const { token, isPending } = useContext(AuthContext);
  // const token = useContext(AuthContext);
  // const redirect = useNavigate();

  // // if (isPending) {
  // //   console.log("isPending...");
  // //   return null;
  // // }
  // if (!token) {
  //   //return <Navigate to="/login" replace />;
  //   redirect('/login');
  //   return;
  // }
  // console.log("token uDashboard:", token.token)

    return (
      <div>
      <h2>User Dashboard</h2>
      <UserKids />
      </div>
    );
  }

  export default UserDashboard;