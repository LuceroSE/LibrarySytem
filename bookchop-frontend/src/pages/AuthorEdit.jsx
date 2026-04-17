import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/api';

function AuthorEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        birth_year: '',
        country: '',
        genre: '',

    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchAuthor() {
            const response = await api(`/api/authors/${id}/`);

            if(!response.ok) {
                setError('Could not load author.');
                setLoading(false);
                return;
            }

            const data = await response.json();
            setFormData({
                name: data.name,
                birth_year: data.year,
                country: data.country,
                genre: data.genre,
            });
            setLoading(false);
        }
        fetchAuthor();
    }, [id]);

    function handleChange(event) {
        setFormData({...formData, [event.target.name]: event.target.value});
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError(null);

        const response = await api(`/api/authors/${id}/`, {
            method: 'PATCH',
            body: JSON.stringify(formData),
        });

        if(!response.ok) {
            const data = await response.json();
            setError(data);
            return;
        }

        navigate(`/authors/${id}`);
    }

    if(loading) {
        return <p>Loading...</p>
    }

    return(
        <form onSubmit={handleSubmit}>
            <h1>Edit Author</h1>

            {error && (
                <ul>
                {Object.entries(error).map(([field, messages]) => (
                    <li key={field}><strong>{field}:</strong> {messages.join(', ')}</li>
                ))}
                </ul>
            )}

            <div>
                <label>Name</label>
                <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>Birth year</label>
                <input
                    name="birth_year"
                    type="number"
                    value={formData.birth_year}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>Country</label>
                <input
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>Genre</label>
                <input
                    name="genre"
                    value={formData.genre}
                    onChange={handleChange}
                />
            </div>

            <button type="submit">Save changes</button>
            <Link to={`/authors/${id}`}>Cancel</Link>
        </form>
    );
}

export default AuthorEdit;