import { Box, Typography, useTheme } from '@mui/material';

// The signature visual motif of the app: a speedometer-style dial that shows
// how many days remain until a vehicle's next scheduled service (or overdue).
// Sweeps from teal (healthy) -> amber (upcoming) -> rust (overdue).
const ServiceGauge = ({ daysUntilDue, size = 120 }) => {
  const theme = useTheme();

  let color = theme.custom.teal;
  let label = 'On track';
  if (daysUntilDue === null || daysUntilDue === undefined) {
    color = theme.custom.muted;
    label = 'No service logged';
  } else if (daysUntilDue < 0) {
    color = theme.custom.rust;
    label = `${Math.abs(Math.round(daysUntilDue))}d overdue`;
  } else if (daysUntilDue <= 14) {
    color = theme.custom.amber;
    label = `${Math.round(daysUntilDue)}d left`;
  } else {
    label = `${Math.round(daysUntilDue)}d left`;
  }

  // Map days (0-90 clamped) to a sweep angle between -120deg and 120deg
  const clamped = daysUntilDue === null || daysUntilDue === undefined ? 0 : Math.max(0, Math.min(daysUntilDue, 90));
  const sweepRatio = daysUntilDue !== null && daysUntilDue !== undefined ? 1 - clamped / 90 : 0;
  const angle = -120 + sweepRatio * 240;

  const radius = size / 2 - 10;
  const cx = size / 2;
  const cy = size / 2;

  const polarToCartesian = (r, angleDeg) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const start = polarToCartesian(radius, -120);
  const end = polarToCartesian(radius, 120);
  const needleEnd = polarToCartesian(radius - 14, angle);

  const largeArcFlag = 1;

  return (
    <Box sx={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Track */}
        <path
          d={`M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`}
          fill="none"
          stroke={theme.custom.graphiteLight}
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* Needle */}
        <line x1={cx} y1={cy} x2={needleEnd.x} y2={needleEnd.y} stroke={color} strokeWidth="3" strokeLinecap="round" />
        <circle cx={cx} cy={cy} r="5" fill={color} />
      </svg>
      <Box sx={{ position: 'absolute', bottom: 6, textAlign: 'center', width: '100%' }}>
        <Typography variant="caption" sx={{ fontFamily: '"JetBrains Mono", monospace', color, fontWeight: 600 }}>
          {label}
        </Typography>
      </Box>
    </Box>
  );
};

export default ServiceGauge;
