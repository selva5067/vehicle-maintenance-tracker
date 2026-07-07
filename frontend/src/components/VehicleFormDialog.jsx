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

const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'];
const accentColors = ['#F2A03D', '#3DDC97', '#E5484D', '#5B9BD5', '#B57EDC'];

const emptyForm = {
  nickname: '',
  make: '',
  model: '',
  year: '',
  registrationNumber: '',
  fuelType: 'Petrol',
  currentOdometer: '',
  imageColor: accentColors[0],
};

const VehicleFormDialog = ({ open, onClose, onSubmit, initialData }) => {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (initialData) {
      setForm({ ...emptyForm, ...initialData });
    } else {
      setForm(emptyForm);
    }
  }, [initialData, open]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    onSubmit({
      ...form,
      year: Number(form.year),
      currentOdometer: Number(form.currentOdometer) || 0,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? 'Edit Vehicle' : 'Add a Vehicle'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12} sm={6}>
            <TextField label="Nickname (optional)" name="nickname" fullWidth value={form.nickname} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Registration Number" name="registrationNumber" fullWidth required value={form.registrationNumber} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField label="Make" name="make" fullWidth required value={form.make} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField label="Model" name="model" fullWidth required value={form.model} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField label="Year" name="year" type="number" fullWidth required value={form.year} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField select label="Fuel Type" name="fuelType" fullWidth value={form.fuelType} onChange={handleChange}>
              {fuelTypes.map((f) => (
                <MenuItem key={f} value={f}>{f}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Current Odometer (km)" name="currentOdometer" type="number" fullWidth value={form.currentOdometer} onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField select label="Card Accent Color" name="imageColor" fullWidth value={form.imageColor} onChange={handleChange}>
              {accentColors.map((c) => (
                <MenuItem key={c} value={c}>
                  <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: 6, background: c, marginRight: 8 }} />
                  {c}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">{initialData ? 'Save changes' : 'Add vehicle'}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default VehicleFormDialog;
