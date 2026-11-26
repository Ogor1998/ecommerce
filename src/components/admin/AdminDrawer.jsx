import * as React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
    Box,
    Chip,
    Drawer as MuiDrawer,
    List,
    Divider,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import PeopleIcon from '@mui/icons-material/People';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';

const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(1.25, 1.5),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        variants: [
            {
                props: ({ open }) => open,
                style: {
                    ...openedMixin(theme),
                    '& .MuiDrawer-paper': {
                        ...openedMixin(theme),
                        top: '64px',
                        height: 'calc(100% - 64px)',
                        zIndex: theme.zIndex.appBar - 1,
                        borderRight: `1px solid ${theme.palette.divider}`,
                        [theme.breakpoints.up('md')]: {
                            top: '72px',
                            height: 'calc(100% - 72px)',
                        },
                    },
                },
            },
            {
                props: ({ open }) => !open,
                style: {
                    ...closedMixin(theme),
                    '& .MuiDrawer-paper': {
                        ...closedMixin(theme),
                        top: '64px',
                        height: 'calc(100% - 64px)',
                        zIndex: theme.zIndex.appBar - 1,
                        borderRight: `1px solid ${theme.palette.divider}`,
                        [theme.breakpoints.up('md')]: {
                            top: '72px',
                            height: 'calc(100% - 72px)',
                        },
                    },
                },
            },
        ],
    })
);

const adminMenuItems = [
    { label: 'Overview', path: '/admin', end: true, icon: <DashboardOutlinedIcon /> },
    { label: 'Products', path: '/admin/products', icon: <Inventory2OutlinedIcon /> },
    { label: 'Add Product', path: '/admin/products/new', icon: <AddBoxOutlinedIcon /> },
    { label: 'Orders', path: '/admin/orders', icon: <ReceiptLongOutlinedIcon /> },
    { label: 'Customers', path: '/admin/customers', icon: <PeopleIcon /> },
];

export default function AdminDrawer() {
    const [open, setOpen] = React.useState(true);
    const location = useLocation();

    return (
        <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 72px)' }}>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader sx={{ justifyContent: open ? 'space-between' : 'center' }}>
                    {open && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pl: 1 }}>
                            <Typography variant="subtitle2" fontWeight={700} color="text.primary">
                                Workspace
                            </Typography>
                            <Chip
                                label="ADMIN"
                                size="small"
                                sx={{
                                    height: 20,
                                    fontSize: '0.68rem',
                                    fontWeight: 700,
                                    bgcolor: '#EFF6FF',
                                    color: 'secondary.main',
                                }}
                            />
                        </Box>
                    )}
                    <IconButton
                        aria-label={open ? 'collapse admin sidebar' : 'expand admin sidebar'}
                        onClick={() => setOpen((prev) => !prev)}
                    >
                        {open ? <ChevronLeftIcon /> : <MenuIcon />}
                    </IconButton>
                </DrawerHeader>

                <Divider />

                <List>
                    {adminMenuItems.map((item) => {
                        const isSelected = item.end
                            ? location.pathname === item.path
                            : location.pathname === item.path ||
                            (item.path === '/admin/products' &&
                                location.pathname.startsWith('/admin/products') &&
                                location.pathname !== '/admin/products/new');

                        return (
                            <ListItem key={item.path} disablePadding sx={{ display: 'block' }}>
                                <ListItemButton
                                    component={NavLink}
                                    to={item.path}
                                    end={item.end}
                                    selected={isSelected}
                                    sx={{
                                        minHeight: 48,
                                        px: 2.5,
                                        justifyContent: open ? 'initial' : 'center',
                                        '&.Mui-selected': {
                                            bgcolor: '#EFF6FF',
                                            color: 'secondary.main',
                                            '& .MuiListItemIcon-root': { color: 'secondary.main' },
                                        },
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 3 : 'auto',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.label}
                                        sx={{ opacity: open ? 1 : 0 }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>

                <Divider sx={{ mt: 'auto' }} />

                <List>
                    <ListItem disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                            component={NavLink}
                            to="/products/shop"
                            sx={{
                                minHeight: 48,
                                px: 2.5,
                                color: 'text.secondary',
                                justifyContent: open ? 'initial' : 'center',
                                '&:hover': { color: 'text.primary' },
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                    color: 'inherit',
                                }}
                            >
                                <StorefrontOutlinedIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Back to Storefront"
                                sx={{ opacity: open ? 1 : 0 }}
                            />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>

            {/* Active Admin Child Route Renders Here */}
            <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, minWidth: 0 }}>
                <Outlet />
            </Box>
        </Box>
    );
}