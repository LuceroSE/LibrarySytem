import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';

function AuthorList() {
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        async function fetchAuthors() {
            const response = await api('/api/authors');

            if(!response.ok) {
                setError('Could not load authors');
                setLoading(false);
                return;
            }

            const data = await response.json();
            console.log(data)
            setAuthors(data);
            setLoading(false);
        }
        fetchAuthors();
    }, []);

    if(loading) { 
        return <p>Loading...</p>
    }

    if(error) {
        return <p>{error}</p>
    }

    return(
        <div>
            <h1>Authors</h1>
            <Link to="/authors/create">+ Add Author</Link>

            <ul>
                {authors.map(author => (
                    <li key={author.id}>
                        <Link to={`/authors/${author.id}`}>{author.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AuthorList;