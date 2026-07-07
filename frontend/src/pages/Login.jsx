import { useState } from 'react';
import { Box, Paper, TextField, Button, Typography, Alert, Link as MuiLink } from '@mui/material';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Paper sx={{ p: 4, width: 380 }} component="form" onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <DirectionsCarFilledIcon color="primary" fontSize="large" />
          <Typography variant="h5">Garage</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Sign in to track your vehicle maintenance.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <TextField
          label="Email"
          type="email"
          fullWidth
          required
          margin="normal"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          required
          margin="normal"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <Button type="submit" variant="contained" fullWidth size="large" sx={{ mt: 3 }} disabled={submitting}>
          {submitting ? 'Signing in...' : 'Sign in'}
        </Button>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
          Don't have an account?{' '}
          <MuiLink component={Link} to="/register">Create one</MuiLink>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;
