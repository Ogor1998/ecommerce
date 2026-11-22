import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import { Typography, Avatar, Stack } from '@mui/material';


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
        '& .MuiDrawer-paper': {
            top: '64px',
            height: 'calc(100% - 64px)',
            zIndex: theme.zIndex.appBar - 1,
            borderRight: `1px solid ${theme.palette.divider}`,
            [theme.breakpoints.up('md')]: {
                top: '72px', // Matches your main Navbar height
                height: 'calc(100% - 72px)',
            },
        },
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
    }),
);

const menuItems = [
    { id: 'profile', label: 'Profile Details', icon: <PersonIcon /> },
    { id: 'orders', label: 'My Orders', icon: <ShoppingBagOutlinedIcon /> },
    { id: 'addresses', label: 'Addresses', icon: <LocationOnOutlinedIcon /> },
    { id: 'security', label: 'Security', icon: <LockOutlinedIcon /> },
];

export default function ProfileDrawer({ activeTab = 'profile', onSelectTab, onLogout, children, profile }) {
    const [open, setOpen] = React.useState(true);

    return (
        <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 72px)' }}>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader sx={{ justifyContent: open ? 'flex-end' : 'center' }}>
                    <IconButton
                        aria-label={open ? 'collapse sidebar' : 'expand sidebar'}
                        onClick={() => setOpen((prev) => !prev)}
                    >
                        {open ? <ChevronLeftIcon /> : <MenuIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />

                <Stack direction="row" spacing={2} alignItems="center" sx={{ p: 2 }}>
                    <Avatar
                        src={profile.image}
                        alt={`${profile.firstName} ${profile.lastName}`}
                        // sx={{ width: 48, height: 48, bgcolor: 'primary.main' }}
                        sx={[
                            { minWidth: 0, justifyContent: 'center' },
                            open ? { mr: 3 } : { mr: 'auto' },
                        ]}
                    >
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography variant="subtitle1" fontWeight={600} noWrap>
                            {profile.firstname} {profile.lastname}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                            @{profile.username}
                        </Typography>
                    </Box>
                </Stack>
                <Divider />

                <List>
                    {menuItems.map((item) => {
                        const selected = activeTab === item.id;
                        return (
                            <ListItem key={item.id} disablePadding sx={{ display: 'block' }}>
                                <ListItemButton
                                    selected={selected}
                                    onClick={() => onSelectTab?.(item.id)}
                                    sx={[
                                        {
                                            minHeight: 48,
                                            px: 2.5,
                                            '&.Mui-selected': {
                                                bgcolor: '#EFF6FF',
                                                color: 'secondary.main',
                                                '& .MuiListItemIcon-root': { color: 'secondary.main' },
                                            },
                                        },
                                        open ? { justifyContent: 'initial' } : { justifyContent: 'center' },
                                    ]}
                                >
                                    <ListItemIcon
                                        sx={[
                                            { minWidth: 0, justifyContent: 'center' },
                                            open ? { mr: 3 } : { mr: 'auto' },
                                        ]}
                                    >
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.label}
                                        sx={[open ? { opacity: 1 } : { opacity: 0 }]}
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
                            sx={[
                                { minHeight: 48, px: 2.5, color: 'error.main' },
                                open ? { justifyContent: 'initial' } : { justifyContent: 'center' },
                            ]}
                        >
                            <ListItemIcon
                                sx={[
                                    { minWidth: 0, justifyContent: 'center', color: 'error.main' },
                                    open ? { mr: 3 } : { mr: 'auto' },
                                ]}
                            >
                                <LogoutIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Log out"
                                sx={[open ? { opacity: 1 } : { opacity: 0 }]}
                            />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>

            {/* Main Profile Content Area */}
            <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 } }}>
                {children}
            </Box>
        </Box>
    );
}