import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  IconButton,
  TextField,
  MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../api/axios';
import ServiceFormDialog from '../components/ServiceFormDialog';

const statusColor = { completed: 'default', upcoming: 'warning', overdue: 'error' };

const Services = () => {
  const [services, setServices] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [filterVehicle, setFilterVehicle] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const fetchData = () => {
    api.get('/services').then((res) => setServices(res.data));
    api.get('/vehicles').then((res) => setVehicles(res.data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = filterVehicle === 'all' ? services : services.filter((s) => s.vehicle?._id === filterVehicle);

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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4">Service Log</Typography>
          <Typography variant="body2" color="text.secondary">Full history across all vehicles.</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd} disabled={vehicles.length === 0}>
          Log Service
        </Button>
      </Box>

      <Card>
        <CardContent>
          <TextField
            select
            label="Filter by vehicle"
            size="small"
            value={filterVehicle}
            onChange={(e) => setFilterVehicle(e.target.value)}
            sx={{ mb: 2, width: 260 }}
          >
            <MenuItem value="all">All vehicles</MenuItem>
            {vehicles.map((v) => (
              <MenuItem key={v._id} value={v._id}>
                {v.nickname || `${v.make} ${v.model}`}
              </MenuItem>
            ))}
          </TextField>

          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Vehicle</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Cost</TableCell>
                <TableCell>Next Due</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((s) => (
                <TableRow key={s._id}>
                  <TableCell>{s.vehicle?.nickname || `${s.vehicle?.make} ${s.vehicle?.model}`}</TableCell>
                  <TableCell>{s.serviceType}</TableCell>
                  <TableCell>{new Date(s.serviceDate).toDateString()}</TableCell>
                  <TableCell sx={{ fontFamily: '"JetBrains Mono", monospace' }}>₹{s.cost}</TableCell>
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
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7}>
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                      No service records found.
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
        vehicles={vehicles}
      />
    </Container>
  );
};

export default Services;
