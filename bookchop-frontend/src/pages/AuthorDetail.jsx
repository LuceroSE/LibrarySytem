import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';

import api from '../api/api';

function AuthorDetail() {
    const { id } = useParams();
    const [author, setAuthor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [deleteOpen, setDeleteOpen] = useState(false); 

    useEffect(() => {   

        async function fetchAuthor() {
            const response = await api(`/api/authors/${id}`);

            if (!response.ok) {
                setError('Author not found.');
                setLoading(false);
                return;
            }

            const data = await response.json();
            setAuthor(data);
            console.log(data);
            setLoading(false);
        }

        fetchAuthor();
    }, [id]);

    async function handleDelete() {
        const response = await api(`/api/authors/${id}/`,{
            method: 'DELETE'
        });

        if(response.ok) {
            navigate('/authors');
        }
    }

    if(loading) {
        return <p>Loading...</p>
    }

    if(error) {
        return <p>{error}</p>
    }

    return(
        <div>
            <Link to="/authors">← Back to Authors</Link>
            <h1>{author.name}</h1>
            <p>Birth year: {author.birth_year}</p>
            <p>Country: {author.country}</p>
            <Link to={`/authors/${author.id}/edit`}>Edit Author</Link>
            <Button color="error" onClick={() => setDeleteOpen(true)}>Delete</Button>
            <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
                <DialogTitle>Delete author?</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    This will permanently remove {author.name}. This cannot be undone.
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
                <Button onClick={handleDelete} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
export default AuthorDetail;