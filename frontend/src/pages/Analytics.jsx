import { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, Box, useTheme } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import api from '../api/axios';

const PIE_COLORS = ['#F2A03D', '#3DDC97', '#5B9BD5', '#E5484D', '#B57EDC', '#8B949E'];

const Analytics = () => {
  const theme = useTheme();
  const [monthly, setMonthly] = useState([]);
  const [byType, setByType] = useState([]);
  const [byVehicle, setByVehicle] = useState([]);

  useEffect(() => {
    api.get('/analytics/monthly?months=6').then((res) => setMonthly(res.data));
    api.get('/analytics/by-type').then((res) => setByType(res.data));
    api.get('/analytics/by-vehicle').then((res) => setByVehicle(res.data));
  }, []);

  const tooltipStyle = {
    backgroundColor: theme.custom.graphiteLight,
    border: 'none',
    borderRadius: 8,
    color: theme.palette.text.primary,
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 0.5 }}>Analytics</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Visual insights into your maintenance spending.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Monthly spend (last 6 months)</Typography>
              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <LineChart data={monthly}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(237,237,239,0.08)" />
                    <XAxis dataKey="month" stroke={theme.palette.text.secondary} fontSize={12} />
                    <YAxis stroke={theme.palette.text.secondary} fontSize={12} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`₹${value}`, 'Spend']} />
                    <Line type="monotone" dataKey="total" stroke={theme.custom.amber} strokeWidth={2.5} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Spend by service type</Typography>
              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={byType}
                      dataKey="total"
                      nameKey="serviceType"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={(entry) => entry.serviceType}
                    >
                      {byType.map((entry, index) => (
                        <Cell key={entry.serviceType} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`₹${value}`, 'Spend']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Spend by vehicle</Typography>
              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={byVehicle}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(237,237,239,0.08)" />
                    <XAxis dataKey="vehicle" stroke={theme.palette.text.secondary} fontSize={12} />
                    <YAxis stroke={theme.palette.text.secondary} fontSize={12} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`₹${value}`, 'Spend']} />
                    <Bar dataKey="total" fill={theme.custom.teal} radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Analytics;
