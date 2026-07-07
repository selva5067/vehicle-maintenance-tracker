import { Card, CardContent, Typography, Box, Chip, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { useNavigate } from 'react-router-dom';
import ServiceGauge from './ServiceGauge';

const VehicleCard = ({ vehicle, nextDueDate, onEdit, onDelete }) => {
  const navigate = useNavigate();

  let daysUntilDue = null;
  if (nextDueDate) {
    daysUntilDue = (new Date(nextDueDate) - new Date()) / (1000 * 60 * 60 * 24);
  }

  return (
    <Card
      sx={{
        cursor: 'pointer',
        transition: 'transform 0.15s ease, border-color 0.15s ease',
        '&:hover': { transform: 'translateY(-2px)', borderColor: vehicle.imageColor || '#F2A03D' },
      }}
      onClick={() => navigate(`/vehicles/${vehicle._id}`)}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '10px',
                bgcolor: `${vehicle.imageColor}22`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: vehicle.imageColor,
              }}
            >
              <DirectionsCarIcon />
            </Box>
            <Box>
              <Typography variant="h6">{vehicle.nickname || `${vehicle.make} ${vehicle.model}`}</Typography>
              <Typography variant="body2" color="text.secondary">
                {vehicle.make} {vehicle.model} · {vehicle.year}
              </Typography>
              <Chip
                label={vehicle.registrationNumber}
                size="small"
                sx={{ mt: 0.5, fontFamily: '"JetBrains Mono", monospace' }}
              />
            </Box>
          </Box>

          <Box onClick={(e) => e.stopPropagation()}>
            <IconButton size="small" onClick={() => onEdit(vehicle)}>
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={() => onDelete(vehicle)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
          <ServiceGauge daysUntilDue={daysUntilDue} size={110} />
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
          Odometer: {vehicle.currentOdometer?.toLocaleString() || 0} km
        </Typography>
      </CardContent>
    </Card>
  );
};

export default VehicleCard;
