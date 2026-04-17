import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';

function BookCreate() {
    const [formData, setFormData] = useState({
        title: '',
        year_published: '',
        author: '',
    });
    const [authors, setAuthors] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    function handleChange(event) {
        setFormData({...formData, [event.target.name]: event.target.value})
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError(null);

        const response = await api('/api/books/', {
            method: 'POST',
            body: JSON.stringify(formData),
        });

        if(!response.ok) {
            const data = await response.json();
            setError(data);
            return;
        }

        const newBook = await response.json();
        navigate(`/books/${newBook.id}`);
    }

    useEffect(() => {
        async function fetchAuthors() {
            const response = await api('/api/authors/');
            const data = await response.json();
            setAuthors(data);
        }
        fetchAuthors();
    }, []);

    return(
        <form onSubmit={handleSubmit}>
            <h1>Add Book</h1>
            {error && (
                <ul>
                    {Object.entries(error).map(
                        ([field, messages]) => (
                            <li key={field}><strong>{field }</strong>{messages}</li>
                        )
                    )}
                </ul>
            )}
            <div>
                <label>Title</label>
                <input
                    name="title"
                    value={formData.name}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>Year Published</label>
                <input
                    name="year_published"
                    value={formData.year_published}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>Author</label>
                <select name="author" 
                        value={formData.author} 
                        onChange={handleChange}>
                        <option value="">Select an author...</option>
                        {authors.map(a => (
                            <option key={a.id} value={a.id}>{a.name}</option>
                        ))}
                </select>
            </div>
            <button type="submit">Save</button>
        </form>
    )
}

export default BookCreate;