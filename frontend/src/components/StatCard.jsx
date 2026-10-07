import { Card, CardContent, Typography, Box } from '@mui/material';

const StatCard = ({ label, value, sublabel, accentColor, icon }) => {
  return (
    <Card sx={{ height: '100%', borderTop: `3px solid ${accentColor || '#F2A03D'}` }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="overline" color="text.secondary">{label}</Typography>
            <Typography
              variant="h4"
              sx={{ fontFamily: '"JetBrains Mono", monospace', mt: 0.5, color: accentColor || 'text.primary' }}
            >
              {value}
            </Typography>
            {sublabel && (
              <Typography variant="caption" color="text.secondary">{sublabel}</Typography>
            )}
          </Box>
          {icon && <Box sx={{ color: accentColor || 'text.secondary', opacity: 0.8 }}>{icon}</Box>}
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;
