import { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  ListItemText,
  Divider,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const fetchNotifications = () => {
    api.get('/notifications').then((res) => setNotifications(res.data)).catch(() => {});
  };

  useEffect(() => {
    if (user) fetchNotifications();
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleOpenMenu = (e) => {
    setAnchorEl(e.currentTarget);
    fetchNotifications();
  };

  const handleMarkAllRead = async () => {
    await api.put('/notifications/read-all');
    fetchNotifications();
  };

  if (!user) return null;

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar sx={{ gap: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DirectionsCarFilledIcon sx={{ color: 'primary.main' }} />
          <Typography variant="h6" component={Link} to="/" sx={{ textDecoration: 'none', color: 'text.primary' }}>
            Garage
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button component={Link} to="/" color="inherit">Dashboard</Button>
          <Button component={Link} to="/vehicles" color="inherit">Vehicles</Button>
          <Button component={Link} to="/services" color="inherit">Service Log</Button>
          <Button component={Link} to="/analytics" color="inherit">Analytics</Button>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <IconButton onClick={handleOpenMenu} color="inherit">
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)} PaperProps={{ sx: { width: 340, maxHeight: 420 } }}>
          <Box sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle2">Notifications</Typography>
            {unreadCount > 0 && (
              <Button size="small" onClick={handleMarkAllRead}>Mark all read</Button>
            )}
          </Box>
          <Divider />
          {notifications.length === 0 && (
            <MenuItem disabled>
              <ListItemText primary="No notifications yet" secondary="You'll see service reminders here" />
            </MenuItem>
          )}
          {notifications.slice(0, 8).map((n) => (
            <MenuItem key={n._id} sx={{ whiteSpace: 'normal', opacity: n.isRead ? 0.6 : 1 }}>
              <ListItemText primary={n.title} secondary={n.message} />
            </MenuItem>
          ))}
        </Menu>

        <Typography variant="body2" color="text.secondary">{user.name}</Typography>
        <Button
          variant="outlined"
          color="inherit"
          size="small"
          onClick={() => {
            logout();
            navigate('/login');
          }}
        >
          Log out
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
