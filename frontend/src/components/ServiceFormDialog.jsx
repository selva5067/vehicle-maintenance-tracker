import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  MenuItem,
} from '@mui/material';

const serviceTypes = [
  'Oil Change',
  'Tyre Rotation',
  'Brake Service',
  'General Checkup',
  'Battery Replacement',
  'Air Filter',
  'Coolant Flush',
  'Wheel Alignment',
  'Other',
];

const emptyForm = {
  vehicle: '',
  serviceType: 'Oil Change',
  description: '',
  cost: '',
  odometerAtService: '',
  serviceDate: new Date().toISOString().slice(0, 10),
  nextDueDate: '',
  nextDueOdometer: '',
};

const ServiceFormDialog = ({ open, onClose, onSubmit, initialData, vehicles }) => {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (initialData) {
      setForm({
        ...emptyForm,
        ...initialData,
        vehicle: initialData.vehicle?._id || initialData.vehicle || '',
        serviceDate: initialData.serviceDate ? initialData.serviceDate.slice(0, 10) : emptyForm.serviceDate,
        nextDueDate: initialData.nextDueDate ? initialData.nextDueDate.slice(0, 10) : '',
      });
    } else {
      setForm({ ...emptyForm, vehicle: vehicles?.[0]?._id || '' });
    }
  }, [initialData, open, vehicles]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    onSubmit({
      ...form,
      cost: Number(form.cost),
      odometerAtService: Number(form.odometerAtService) || 0,
      nextDueOdometer: form.nextDueOdometer ? Number(form.nextDueOdometer) : undefined,
      nextDueDate: form.nextDueDate || undefined,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? 'Edit Service Record' : 'Log a Service'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12}>
            <TextField select label="Vehicle" name="vehicle" fullWidth required value={form.vehicle} onChange={handleChange}>
              {vehicles?.map((v) => (
                <MenuItem key={v._id} value={v._id}>
                  {v.nickname || `${v.make} ${v.model}`} ({v.registrationNumber})
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField select label="Service Type" name="serviceType" fullWidth value={form.serviceType} onChange={handleChange}>
              {serviceTypes.map((t) => (
                <MenuItem key={t} value={t}>{t}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Cost" name="cost" type="number" fullWidth required value={form.cost} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Service Date" name="serviceDate" type="date" fullWidth required InputLabelProps={{ shrink: true }} value={form.serviceDate} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Odometer at Service (km)" name="odometerAtService" type="number" fullWidth value={form.odometerAtService} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Next Due Date (optional)" name="nextDueDate" type="date" fullWidth InputLabelProps={{ shrink: true }} value={form.nextDueDate} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Next Due Odometer (optional)" name="nextDueOdometer" type="number" fullWidth value={form.nextDueOdometer} onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Notes" name="description" fullWidth multiline minRows={2} value={form.description} onChange={handleChange} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">{initialData ? 'Save changes' : 'Log service'}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ServiceFormDialog;
