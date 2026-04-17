import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import AuthorList from './pages/AuthorList'
import AuthorDetail from './pages/AuthorDetail'
import AuthorCreate from './pages/AuthorCreate'
import BookList from './pages/BookList'
import BookDetail from './pages/BookDetail'
import BookCreate from './pages/BookCreate'
import AuthorEdit from './pages/AuthorEdit'
import BookEdit from './pages/BookEdit'
import Nav from './components/Nav'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Nav/>
        <Routes>
          {/* Public route — no token required */}
          <Route path="/login" element={<Login />} />

          {/* Author routes */}
          <Route path="/authors" element={<ProtectedRoute><AuthorList /></ProtectedRoute>} /> {/*whatever is placed between the opening and closing tags of a component gets passed to that compone*/}
          <Route path="/authors/create" element={<ProtectedRoute><AuthorCreate /></ProtectedRoute>} />
          <Route path="/authors/:id" element={<ProtectedRoute><AuthorDetail /></ProtectedRoute>} />
          <Route path="/authors/:id/edit" element={<ProtectedRoute><AuthorEdit /></ProtectedRoute>} />

          {/* Book routes */}
          <Route path="/books" element={<ProtectedRoute><BookList /></ProtectedRoute>} /> {/*when the user goes to /books, render this JSX.*/}
          <Route path="/books/create" element={<ProtectedRoute><BookCreate /></ProtectedRoute>} />
          <Route path="/books/:id" element={<ProtectedRoute><BookDetail /></ProtectedRoute>} />
          <Route path="/books/:id/edit" element={<ProtectedRoute><BookEdit /></ProtectedRoute>} />

        </Routes>
    </BrowserRouter>
  </StrictMode>
)