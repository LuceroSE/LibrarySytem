import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/api';

function BookEdit() {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        title: '',
        year_published: '',
        author: '',
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [authors, setAuthors] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchBook() {
            const response = await api(`/api/books/${id}/`);

            if(!response.ok) {
                setError('Could not load book.');
                setLoading(false);
                return;
            }

            const data = await response.json();
            setFormData({
                title: data.title,
                year_published: data.year_published,
                author: String(data.author),
            });

            setLoading(false);
        }
        fetchBook();
    }, [id]);

    function handleChange(event) {
        setFormData({...formData, [event.target.name]: event.target.value});
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError(null);

        const response = await api(`/api/books/${id}/`, {
            method: 'PATCH',
            body: JSON.stringify(formData),
        });

        if(!response.ok) {
            const data = await response.json();
            setError(data);
            return;
        }

        navigate(`/books/${id}`);
    }

    useEffect(() => {
        async function fetchAuthors() {
            const response = await api(`/api/authors/`);
            const data = await response.json();
            setAuthors(data);
        }

        fetchAuthors();
    }, []);

    if(loading) {
        return <p>Loading...</p>
    }

    return(
        <form onSubmit={handleSubmit}>
            <h1>Edit Book</h1>

            {error && (
                <ul>
                {Object.entries(error).map(([field, messages]) => (
                    <li key={field}><strong>{field}:</strong> {messages.join(', ')}</li>
                ))}
                </ul>
            )}

            <div>
                <label>Title</label>
                <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>Year published</label>
                <input
                    name="year_published"
                    type="number"
                    value={formData.year_published}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>Author</label>
                <select name="author"
                        value={formData.author}
                        onChange={handleChange}>
                        <option value="">Select an author</option>  
                        {authors.map(a => (
                            <option key={a.id} value={String(a.id)}>{a.name}</option>
                        ))}
                </select>
            </div>

            <button type="submit">Save changes</button>
            <Link to={`/books/${id}`}>Cancel</Link>
        </form>
    );
}
export default BookEdit;