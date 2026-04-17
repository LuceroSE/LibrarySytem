import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';

function BookList() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect( () =>{
        async function fetchBooks() {
            const response = await api('/api/books/');

            if(!response.ok) {
                setError('Could not load books');
                setLoading(false);
                return;
            }

            const data = await response.json();
            console.log(data);
            setBooks(data);
            setLoading(false);
        }

        fetchBooks();
    },[]);

    if(loading) {
        return <p>Loading...</p>
    }

    if(error) {
        return <p>{error}</p>
    }

    return(
        <div>
            <h1>Books</h1>
            <Link to="/books/create">+ Add Book</Link>
            <ul>
                {books.map(book => (
                    <li key={book.id}>
                        Book title: 
                        <Link to={`/books/${book.id}`}> {book.title}</Link>
                        <p>Author: <Link to={`/authors/${book.author}`}>{book.author_name}</Link></p>
                    </li>
                ))}
            </ul>
        </div>
    )
}


 
export default BookList;