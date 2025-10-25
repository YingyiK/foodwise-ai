import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Restaurant,
  Dashboard,
  Person,
  ShoppingCart,
  Menu as MenuIcon,
} from '@mui/icons-material';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onPageChange }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handlePageChange = (page: string) => {
    onPageChange(page);
    handleMenuClose();
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#2E7D32' }}>
      <Toolbar>
        <Restaurant sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          FoodWise AI
        </Typography>
        
        {/* Desktop Navigation */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          <Button
            color="inherit"
            onClick={() => onPageChange('home')}
            sx={{ 
              backgroundColor: currentPage === 'home' ? 'rgba(255,255,255,0.1)' : 'transparent',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
            }}
          >
            Home
          </Button>
          <Button
            color="inherit"
            onClick={() => onPageChange('dashboard')}
            sx={{ 
              backgroundColor: currentPage === 'dashboard' ? 'rgba(255,255,255,0.1)' : 'transparent',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
            }}
          >
            <Dashboard sx={{ mr: 1 }} />
            Dashboard
          </Button>
          <Button
            color="inherit"
            onClick={() => onPageChange('recommendations')}
            sx={{ 
              backgroundColor: currentPage === 'recommendations' ? 'rgba(255,255,255,0.1)' : 'transparent',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
            }}
          >
            <Restaurant sx={{ mr: 1 }} />
            Food Recommendations
          </Button>
          <Button
            color="inherit"
            onClick={() => onPageChange('profile')}
            sx={{ 
              backgroundColor: currentPage === 'profile' ? 'rgba(255,255,255,0.1)' : 'transparent',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
            }}
          >
            <Person sx={{ mr: 1 }} />
            Profile
          </Button>
        </Box>

        {/* Mobile Menu */}
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMenuOpen}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={() => handlePageChange('home')}>
              Home
            </MenuItem>
            <MenuItem onClick={() => handlePageChange('dashboard')}>
              <Dashboard sx={{ mr: 1 }} />
              Dashboard
            </MenuItem>
            <MenuItem onClick={() => handlePageChange('recommendations')}>
              <Restaurant sx={{ mr: 1 }} />
              Food Recommendations
            </MenuItem>
            <MenuItem onClick={() => handlePageChange('profile')}>
              <Person sx={{ mr: 1 }} />
              Profile
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
