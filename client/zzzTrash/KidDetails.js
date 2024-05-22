import { useNavigate, useParams } from "react-router-dom";
import useFetch from "./useFetch";

const KidDetails = () => {
    const { id } = useParams();
    const { data: kid, error, isPending } = useFetch('http://localhost:3001/kids/' + id);
    const redirect = useNavigate();

    const handleClick = () => {
        fetch('http://localhost:3001/kids/' + kid.id, {
            method: 'DELETE'
        }).then(() => {
            redirect('/');
        })
    }

    return ( 
        <div className="kid-details">
            { isPending && <div>Loading...</div>}
            { error && <div>{ error }</div>}
            { kid && (
                <article>
                    <h2>{ kid.name }</h2>
                    <p>mail: { kid.email }</p>
                    <div>pass: { kid.pass }</div>
                    <button onClick={handleClick}>Delete</button>
                </article>
            )}
        </div>
     );
}
 
export default KidDetails;