import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import api from '../api/axios';
import ServiceGauge from '../components/ServiceGauge';
import ServiceFormDialog from '../components/ServiceFormDialog';

const statusColor = { completed: 'default', upcoming: 'warning', overdue: 'error' };

const VehicleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [services, setServices] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const fetchData = () => {
    api.get(`/vehicles/${id}`).then((res) => setVehicle(res.data));
    api.get(`/services?vehicle=${id}`).then((res) => setServices(res.data));
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!vehicle) return null;

  const upcoming = services.filter((s) => s.nextDueDate).sort((a, b) => new Date(a.nextDueDate) - new Date(b.nextDueDate));
  const nextDue = upcoming[0]?.nextDueDate || null;
  const daysUntilDue = nextDue ? (new Date(nextDue) - new Date()) / (1000 * 60 * 60 * 24) : null;

  const handleAdd = () => {
    setEditingRecord(null);
    setDialogOpen(true);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setDialogOpen(true);
  };

  const handleDelete = async (record) => {
    if (!window.confirm('Delete this service record?')) return;
    await api.delete(`/services/${record._id}`);
    fetchData();
  };

  const handleSubmit = async (form) => {
    if (editingRecord) {
      await api.put(`/services/${editingRecord._id}`, form);
    } else {
      await api.post('/services', form);
    }
    setDialogOpen(false);
    fetchData();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/vehicles')} sx={{ mb: 2 }}>
        Back to vehicles
      </Button>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Typography variant="h4">{vehicle.nickname || `${vehicle.make} ${vehicle.model}`}</Typography>
          <Typography variant="body1" color="text.secondary">
            {vehicle.make} {vehicle.model} · {vehicle.year} · {vehicle.fuelType}
          </Typography>
          <Chip label={vehicle.registrationNumber} size="small" sx={{ mt: 1, fontFamily: '"JetBrains Mono", monospace' }} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Odometer: {vehicle.currentOdometer?.toLocaleString()} km
          </Typography>
        </Grid>
        <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
          <ServiceGauge daysUntilDue={daysUntilDue} size={130} />
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Service history</Typography>
            <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={handleAdd}>
              Log Service
            </Button>
          </Box>

          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Cost</TableCell>
                <TableCell>Odometer</TableCell>
                <TableCell>Next Due</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {services.map((s) => (
                <TableRow key={s._id}>
                  <TableCell>{s.serviceType}</TableCell>
                  <TableCell>{new Date(s.serviceDate).toDateString()}</TableCell>
                  <TableCell sx={{ fontFamily: '"JetBrains Mono", monospace' }}>₹{s.cost}</TableCell>
                  <TableCell>{s.odometerAtService?.toLocaleString()} km</TableCell>
                  <TableCell>{s.nextDueDate ? new Date(s.nextDueDate).toDateString() : '—'}</TableCell>
                  <TableCell>
                    <Chip label={s.status} size="small" color={statusColor[s.status]} />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleEdit(s)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(s)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {services.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7}>
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                      No service records logged for this vehicle yet.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ServiceFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingRecord}
        vehicles={[vehicle]}
      />
    </Container>
  );
};

export default VehicleDetail;
