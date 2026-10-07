import { useEffect, useState } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Chip, Divider } from '@mui/material';
import PaidIcon from '@mui/icons-material/Paid';
import BuildIcon from '@mui/icons-material/Build';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ScheduleIcon from '@mui/icons-material/Schedule';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import StatCard from '../components/StatCard';
import ServiceGauge from '../components/ServiceGauge';

const Dashboard = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    api.get('/analytics/summary').then((res) => setSummary(res.data));
    api.get('/vehicles').then((res) => setVehicles(res.data));
    api.get('/services').then((res) => setServices(res.data));
  }, []);

  const nextDueForVehicle = (vehicleId) => {
    const records = services
      .filter((s) => s.vehicle?._id === vehicleId && s.nextDueDate)
      .sort((a, b) => new Date(a.nextDueDate) - new Date(b.nextDueDate));
    return records[0]?.nextDueDate || null;
  };

  const recentServices = [...services].slice(0, 5);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 0.5 }}>Dashboard</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Your garage at a glance.
      </Typography>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Total Spent"
            value={`₹${(summary?.totalSpent || 0).toLocaleString()}`}
            sublabel="All-time service cost"
            accentColor="#F2A03D"
            icon={<PaidIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Vehicles"
            value={summary?.vehicleCount || 0}
            sublabel="Registered in your garage"
            accentColor="#5B9BD5"
            icon={<DirectionsCarIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Upcoming"
            value={summary?.upcomingCount || 0}
            sublabel="Due within 14 days"
            accentColor="#3DDC97"
            icon={<ScheduleIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Overdue"
            value={summary?.overdueCount || 0}
            sublabel="Needs attention"
            accentColor="#E5484D"
            icon={<WarningAmberIcon />}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="h6">Your vehicles</Typography>
                <Typography
                  variant="body2"
                  color="primary"
                  sx={{ cursor: 'pointer' }}
                  onClick={() => navigate('/vehicles')}
                >
                  View all →
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {vehicles.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No vehicles yet. Add one to start tracking service history.
                </Typography>
              )}
              <Grid container spacing={2}>
                {vehicles.slice(0, 4).map((v) => {
                  const nextDue = nextDueForVehicle(v._id);
                  const days = nextDue ? (new Date(nextDue) - new Date()) / (1000 * 60 * 60 * 24) : null;
                  return (
                    <Grid item xs={6} sm={3} key={v._id} sx={{ textAlign: 'center' }}>
                      <ServiceGauge daysUntilDue={days} size={90} />
                      <Typography variant="caption" sx={{ display: 'block' }}>
                        {v.nickname || `${v.make} ${v.model}`}
                      </Typography>
                    </Grid>
                  );
                })}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>Recent activity</Typography>
              <Divider sx={{ mb: 2 }} />
              {recentServices.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No service records logged yet.
                </Typography>
              )}
              {recentServices.map((s) => (
                <Box key={s._id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BuildIcon fontSize="small" color="action" />
                    <Box>
                      <Typography variant="body2">{s.serviceType}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {s.vehicle?.nickname || s.vehicle?.make} · {new Date(s.serviceDate).toDateString()}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip label={`₹${s.cost}`} size="small" sx={{ fontFamily: '"JetBrains Mono", monospace' }} />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
