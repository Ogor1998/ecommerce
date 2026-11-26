

import React, { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Box,
    Typography,
    Button,
    IconButton,
    Badge,
    InputBase,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Divider,
    Menu,
    MenuItem,
    Avatar,
    Container,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useProfile } from '../../context/ProfileContext';
import Cart from '../cart/Cart';

const navLinks = [
    { label: 'Home', path: '/products' },
    { label: 'Shop', path: '/products/shop' },
];

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { profile } = useProfile()
    const { cart } = useCart();
    const { currentUser, logout } = useAuth() || {};

    // console.log(currentUser)

    const [showCart, setShowCart] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);

    // Total unit count across all items in cart
    const totalCount = Array.isArray(cart)
        ? cart.reduce((sum, item) => sum + (item.quantity || 0), 0)
        : 0;

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const trimmed = searchQuery.trim();
        if (!trimmed) return;
        navigate(`/products/shop?q=${encodeURIComponent(trimmed)}`);
        setMobileMenuOpen(false);
    };

    // console.log(searchQuery)

    const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleLogout = async () => {
        handleMenuClose();
        if (logout) await logout();
        navigate('/login');
    };
    const isAdmin = profile?.role === 'admin'

    return (
        <>
            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.92)',
                    backdropFilter: 'blur(8px)',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    color: 'text.primary',
                }}
            >
                <Container maxWidth="xl">
                    <Toolbar disableGutters sx={{ gap: 2, minHeight: { xs: 64, md: 72 } }}>
                        {/* Mobile Hamburger Button */}
                        <IconButton
                            edge="start"
                            onClick={() => setMobileMenuOpen(true)}
                            aria-label="open menu"
                            sx={{ display: { xs: 'flex', md: 'none' }, color: 'text.primary' }}
                        >
                            <MenuIcon />
                        </IconButton>

                        {/* Brand Logo */}
                        <Typography
                            variant="h6"
                            component={RouterLink}
                            to="/products"
                            sx={{
                                fontWeight: 800,
                                letterSpacing: '-0.03em',
                                textDecoration: 'none',
                                color: isAdmin ? 'primary.light' : 'primary.main',

                                mr: { md: 2 },
                            }}
                        >
                            {isAdmin ? <span style={{ color: '#c1121f' }}>STOREFRONT[admin]</span> : 'STOREFRONT'}
                        </Typography>

                        {/* Desktop Navigation Links */}
                        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
                            {navLinks.map((link) => {
                                const isActive = location.pathname === link.path;
                                return (
                                    <Button
                                        key={link.path}
                                        component={RouterLink}
                                        to={link.path}
                                        sx={{
                                            color: isActive ? 'secondary.main' : 'text.secondary',
                                            fontWeight: isActive ? 700 : 500,
                                            px: 1.5,
                                            '&:hover': {
                                                bgcolor: 'action.hover',
                                                color: 'text.primary',
                                            },
                                        }}
                                    >
                                        {link.label}
                                    </Button>
                                );
                            })}
                        </Box>

                        {/* Spacer */}
                        <Box sx={{ flexGrow: 1 }} />

                        {/* Desktop Search Bar */}
                        <Box
                            component="form"
                            onSubmit={handleSearchSubmit}
                            sx={{
                                display: { xs: 'none', sm: 'flex' },
                                alignItems: 'center',
                                bgcolor: '#F3F4F6',
                                border: '1px solid transparent',
                                borderRadius: 2,
                                px: 1.5,
                                py: 0.5,
                                width: { sm: 220, md: 300 },
                                transition: 'all 0.2s',
                                '&:focus-within': {
                                    bgcolor: 'background.paper',
                                    borderColor: 'secondary.main',
                                },
                            }}
                        >
                            <SearchIcon sx={{ color: 'text.secondary', fontSize: 20, mr: 1 }} />
                            <InputBase
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                sx={{ fontSize: 14, width: '100%' }}
                            />
                        </Box>

                        {/* Cart Drawer Trigger */}
                        <IconButton
                            onClick={() => setShowCart(true)}
                            aria-label="open shopping cart"
                            sx={{ color: 'text.primary' }}
                        >
                            <Badge
                                badgeContent={totalCount}
                                color="secondary"
                                max={99}
                                sx={{
                                    '& .MuiBadge-badge': {
                                        fontWeight: 700,
                                        fontSize: 11,
                                    },
                                }}
                            >
                                <ShoppingBagOutlinedIcon />
                            </Badge>
                        </IconButton>

                        {/* Desktop Auth Controls */}
                        {currentUser ? (
                            <>
                                <IconButton onClick={handleMenuOpen} sx={{ p: 0.5 }}>
                                    <Avatar
                                        sx={{
                                            width: 34,
                                            height: 34,
                                            bgcolor: 'primary.main',
                                            fontSize: 14,
                                            fontWeight: 700,
                                        }}
                                    >
                                        {currentUser.username?.[0]?.toUpperCase() || currentUser.email?.[0]?.toUpperCase() || 'U'}
                                    </Avatar>
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleMenuClose}
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                >
                                    <MenuItem
                                        onClick={() => {
                                            handleMenuClose();
                                            navigate('/profile');
                                        }}
                                        sx={{ opacity: '1 !important', fontWeight: 600 }}>
                                        {currentUser.username || currentUser.email}
                                    </MenuItem>
                                    <Divider />
                                    {isAdmin && (
                                        <MenuItem
                                            onClick={() => {
                                                handleMenuClose();
                                                navigate('/admin/products/new');
                                            }}
                                        >
                                            Add Product
                                        </MenuItem>
                                    )}
                                    <MenuItem
                                        onClick={() => {
                                            handleMenuClose();
                                            navigate('/orders');
                                        }}
                                    >
                                        My Orders
                                    </MenuItem>
                                    <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                                        Logout
                                    </MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1 }}>
                                <Button
                                    component={RouterLink}
                                    to="/login"
                                    sx={{ color: 'text.primary' }}
                                >
                                    Log in
                                </Button>
                                <Button
                                    component={RouterLink}
                                    to="/register"
                                    variant="contained"
                                    color="primary"
                                >
                                    Sign up
                                </Button>
                            </Box>
                        )}
                    </Toolbar>
                </Container>
            </AppBar>

            {/* Mobile Navigation Drawer */}
            <Drawer
                anchor="left"
                open={mobileMenuOpen}
                onClose={() => setMobileMenuOpen(false)}
                slotProps={{
                    paper: { sx: { width: 280, p: 2 } },
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" fontWeight={800}>
                        STOREFRONT
                    </Typography>
                    <IconButton onClick={() => setMobileMenuOpen(false)}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* Mobile Search Input */}
                <Box
                    component="form"
                    onSubmit={handleSearchSubmit}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        bgcolor: '#F3F4F6',
                        borderRadius: 2,
                        px: 1.5,
                        py: 0.75,
                        mb: 2,
                    }}
                >
                    <SearchIcon sx={{ color: 'text.secondary', fontSize: 20, mr: 1 }} />
                    <InputBase
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        sx={{ fontSize: 14, width: '100%' }}
                    />
                </Box>

                <Divider />

                <List>
                    {navLinks.map((link) => (
                        <ListItem key={link.path} disablePadding>
                            <ListItemButton
                                component={RouterLink}
                                to={link.path}
                                selected={location.pathname === link.path}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <ListItemText primary={link.label} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>

                {!currentUser && (
                    <Box sx={{ mt: 'auto', display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Button
                            component={RouterLink}
                            to="/login"
                            variant="outlined"
                            fullWidth
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Log in
                        </Button>
                        <Button
                            component={RouterLink}
                            to="/register"
                            variant="contained"
                            fullWidth
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Sign up
                        </Button>
                    </Box>
                )}
            </Drawer>

            {/* Slide-Over Shopping Cart Drawer */}
            <Cart
                showCart={showCart}
                handleCartClose={() => setShowCart(false)}
            />
        </>
    );
};

export default Navbar;