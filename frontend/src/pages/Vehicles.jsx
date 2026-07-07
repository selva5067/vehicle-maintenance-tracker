import { useEffect, useState } from 'react';
import { Container, Typography, Box, Button, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import api from '../api/axios';
import VehicleCard from '../components/VehicleCard';
import VehicleFormDialog from '../components/VehicleFormDialog';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [services, setServices] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const fetchData = () => {
    api.get('/vehicles').then((res) => setVehicles(res.data));
    api.get('/services').then((res) => setServices(res.data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const nextDueForVehicle = (vehicleId) => {
    const records = services
      .filter((s) => s.vehicle?._id === vehicleId && s.nextDueDate)
      .sort((a, b) => new Date(a.nextDueDate) - new Date(b.nextDueDate));
    return records[0]?.nextDueDate || null;
  };

  const handleAdd = () => {
    setEditingVehicle(null);
    setDialogOpen(true);
  };

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setDialogOpen(true);
  };

  const handleDelete = async (vehicle) => {
    if (!window.confirm(`Remove ${vehicle.make} ${vehicle.model} and all its service records?`)) return;
    await api.delete(`/vehicles/${vehicle._id}`);
    fetchData();
  };

  const handleSubmit = async (form) => {
    if (editingVehicle) {
      await api.put(`/vehicles/${editingVehicle._id}`, form);
    } else {
      await api.post('/vehicles', form);
    }
    setDialogOpen(false);
    fetchData();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4">Vehicles</Typography>
          <Typography variant="body2" color="text.secondary">Manage your registered vehicles.</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
          Add Vehicle
        </Button>
      </Box>

      <Grid container spacing={2}>
        {vehicles.map((v) => (
          <Grid item xs={12} sm={6} md={4} key={v._id}>
            <VehicleCard
              vehicle={v}
              nextDueDate={nextDueForVehicle(v._id)}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </Grid>
        ))}
        {vehicles.length === 0 && (
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 6 }}>
              No vehicles registered yet. Click "Add Vehicle" to get started.
            </Typography>
          </Grid>
        )}
      </Grid>

      <VehicleFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingVehicle}
      />
    </Container>
  );
};

export default Vehicles;
