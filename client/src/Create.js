import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Create = () => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [author, setAuthor] = useState('');
    const [isPending, setIsPending] = useState(false);
    const redirect = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const blog = { title, body, author};

        setIsPending(true);

        fetch('http://localhost:3200/blogs', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(blog)
        }).then(() => {
            console.log("new blog added");
            setIsPending(false);
            redirect('/');
        })

    }

    return (
        <div className="create">
            <h2>Create a new blog</h2>
            <form onSubmit={handleSubmit}>
                <label>Blog title</label>
                <input 
                type="text" 
                required 
                value={title}
                onChange={(e) => setTitle(e.target.value)} 
                />
                <label>Blog body</label>
                <textarea required 
                value={body}
                onChange={(e) => setBody(e.target.value)} />
                <label>Blog author</label>
                <select
                value={author}
                onChange={(e) => setAuthor(e.target.value)}>
                    <option value="mario">mario</option>
                    <option value="luigi">luigi</option>
                    <option value="kakatz">kakatz</option>
                </select>
                { !isPending && <button>Add blog</button> }
                { isPending && <button disabled>Adding blog...</button> }
            </form>
        </div>
    );
}

export default Create;