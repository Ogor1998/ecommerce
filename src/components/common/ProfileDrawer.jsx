import * as React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
    Box,
    Drawer as MuiDrawer,
    List,
    Divider,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LogoutIcon from '@mui/icons-material/Logout';

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
    justifyContent: 'flex-end',
    padding: theme.spacing(1, 1.5),
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

const menuItems = [
    { label: 'Profile Details', path: '/profile', end: true, icon: <PersonIcon /> },
    { label: 'My Orders', path: '/profile/orders', icon: <ShoppingBagOutlinedIcon /> },
    { label: 'Addresses', path: '/profile/addresses', icon: <LocationOnOutlinedIcon /> },
    { label: 'Security', path: '/profile/security', icon: <LockOutlinedIcon /> },
];

export default function ProfileDrawer({ onLogout }) {
    const [open, setOpen] = React.useState(true);
    const location = useLocation();

    return (
        <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 72px)' }}>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader sx={{ justifyContent: open ? 'flex-end' : 'center' }}>
                    <IconButton onClick={() => setOpen((prev) => !prev)}>
                        {open ? <ChevronLeftIcon /> : <MenuIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />

                <List>
                    {menuItems.map((item) => {
                        const isSelected = item.end
                            ? location.pathname === item.path
                            : location.pathname.startsWith(item.path);

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
                            onClick={onLogout}
                            sx={{
                                minHeight: 48,
                                px: 2.5,
                                color: 'error.main',
                                justifyContent: open ? 'initial' : 'center',
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                    color: 'error.main',
                                }}
                            >
                                <LogoutIcon />
                            </ListItemIcon>
                            <ListItemText primary="Log out" sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>

            {/* Each child route renders right here! */}
            <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 } }}>
                <Outlet />
            </Box>
        </Box>
    );
}