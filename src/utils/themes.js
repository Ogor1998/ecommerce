import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#111827',       // Deep Obsidian for "Add to Cart" & "Checkout"
            light: '#374151',
            dark: '#030712',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#2563EB',       // Cobalt Indigo for active filters, links & badges
            light: '#60A5FA',
            dark: '#1D4ED8',
            contrastText: '#FFFFFF',
        },
        background: {
            default: '#FAFAFA',    // Soft off-white page canvas
            paper: '#FFFFFF',      // Crisp white cards & Cart Drawer
        },
        text: {
            primary: '#111827',
            secondary: '#4B5563',
        },
        divider: '#E5E7EB',
        success: {
            main: '#16A34A',
        },
        warning: {
            main: '#D97706',
        },
        error: {
            main: '#DC2626',
        },
    },
    shape: {
        borderRadius: 10,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 600,
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: 'none',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                outlined: {
                    borderColor: '#E5E7EB',
                },
            },
        },
    },
});