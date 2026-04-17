import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box } from '@mui/material';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  
  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    const response = await fetch('http://localhost:8000/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        setError('Invalid username or password.');
        return;
    }

    const tokens = await response.json();
    localStorage.setItem('access', tokens.access);
    localStorage.setItem('refresh', tokens.refresh);

    navigate('/books');
  }
  
  
  return (

  <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
    <Typography variant="h4" gutterBottom>Login</Typography>
    {error && <Typography color="error">{error}</Typography>}
    <TextField
      label="Username"
      value={username}
      onChange={e => setUsername(e.target.value)}
      fullWidth
      margin="normal"
    />
    <TextField
      label="Password"
      type="password"
      value={username}
      onChange={e => setPassword(e.target.value)}
      fullWidth
      margin="normal"
    />
    <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
      Log in
    </Button>
  </Box>
  );
}

export default Login;