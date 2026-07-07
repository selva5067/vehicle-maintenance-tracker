import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import VehicleDetail from './pages/VehicleDetail';
import Services from './pages/Services';
import Analytics from './pages/Analytics';

function App() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/vehicles" element={<Vehicles />} />
                  <Route path="/vehicles/:id" element={<VehicleDetail />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/analytics" element={<Analytics />} />
                </Routes>
              </>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Box>
  );
}

export default App;
