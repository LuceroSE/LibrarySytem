import { useState, useEffect } from 'react';
import { useParams, useNavigate , Link } from 'react-router-dom';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import api from '../api/api';

function BookDetail() {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [deleteOpen, setDeleteOpen] = useState(false);

    useEffect(() => {
        async function fetchBook() {
            const response = await api(`/api/books/${id}/`);

            if(!response.ok) {
                setError('Book not found.');
                setLoading(false);
                return;
            }

            const data = await response.json();
            setBook(data);
            console.log(data);
            setLoading(false);
        }

        fetchBook();
    }, [id]);

    async function handleDelete() {
        const response = api(`/api/books/${id}/`, {
            method: 'DELETE'
        });

        if(response.ok) {
            navigate('/books');
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
            <Link to="/books">← Back to Books</Link>
            <h1>{book.title}</h1>
            <p>Year publish: {book.year_published}</p>
            <p><Link to={`/authors/${book.author}`}>Author: {book.author_name}</Link></p>
            <Link to={`/books/${book.id}/edit`}>Edit Book</Link>
            <Button color="error" onClick={() => setDeleteOpen(true)}>Delete</Button>
            <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
                <DialogTitle>Delete author?</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    This will permanently remove {book.title}. This cannot be undone.
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
                <Button onClick={handleDelete} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default BookDetail;