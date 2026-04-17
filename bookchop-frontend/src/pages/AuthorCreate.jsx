import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';

function AuthorCreate() {
    const [formData, setFormData] = useState({
        name: '',
        birth_year:'',
        country:'',
        genre:'',
    });

    const [error, setError] = useState(null);
    const navigate = useNavigate();

    function handleChange(event) {
        setFormData({...formData, [event.target.name]: event.target.value});
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError(null);

        const response = await api('/api/authors/', {
            method: 'POST',
            body: JSON.stringify(formData),
        });

        if(!response.ok) {
            const data = await response.json();
            setError(data);
            return;
        }

        const newAuthor = await response.json();
        //redirect to new actors page
        navigate(`/authors/${newAuthor.id}`);
    }

    return( 
        <form onSubmit={handleSubmit}>
            <h1>Add Author</h1> 
            {error && (
                <ul>
                    {Object.entries(error).map(
                        ([field, messages]) => (
                            <li key={field}><strong>{field}</strong>{messages.join(', ')}</li>
                        )
                    )}
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

            <button type="submit">Save</button>
            <Link to="/authors">Cancel</Link>
        </form>
    );
}

export default AuthorCreate;