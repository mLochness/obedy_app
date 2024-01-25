import UsersList from "./UsersList";
import useFetch from "./useFetch";

const Home = () => {
    // const { data: users, isPending, error} = useFetch('http://localhost:3001/users');

    return (
        // <div className="home">
        //     { error && <div>{ error }</div>}
        //     { isPending && <div>Načítavam...</div>}
        //     { users && <UsersList users={ users } title="Users:"/>}
        // </div>
        <div className="home">
             <h2>HOMEPAGE</h2>
         </div>
    );
}
 
export default Home;