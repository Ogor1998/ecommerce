import React from 'react'
import { useState } from 'react';
import { Box, Paper, Typography, Button, Divider, Select } from '@mui/material';
import Grid from '@mui/material/Grid'; // Use '@mui/material/Unstable_Grid2' if on older MUI v5
import AddIcon from '@mui/icons-material/Add';
import ProductsTable from './ProductsTable';
import StockStatusSelect from './StockStatusSelect';


const AdminOverview = () => {
    const [status, setStatus] = useState('all');

    const topItems = [
        { title: 'Total Revenue', value: 20000 },
        { title: 'Orders', value: 34 },
        { title: 'Low Stock', value: 7 },
        { title: 'Users', value: 1234 }
    ]




    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100vh', // Takes up the full screen height
                p: 2,
                gap: 2,
                boxSizing: 'border-box',
            }}
        >
            <Paper
                sx={{
                    height: '100%',
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column'
                    // alignItems: 'center',
                    // justifyContent: 'center',
                }}
            >
                {/* Top Box: 4 items in a straight line */}
                <Grid container spacing={2}>
                    {/* <Paper sx={{ p: 2, display: 'flex', width: '100%' }}> */}
                    {topItems.map((item) => (
                        <Grid key={item} size={3} sx={{ gap: '16px', padding: '20px' }}>
                            <Typography sx={{ fontWeight: '400', fontSize: '13px', color: '#6B7280' }}>{item.title}</Typography>
                            <Typography sx={{ fontSize: '28px', fontWeight: '700' }}> {item.value}</Typography>
                        </Grid>
                    ))}

                    {/* </Paper> */}
                </Grid>
                <Divider />

                {/* Bottom Box: Fills the rest of the screen */}
                <Grid container sx={{ flexGrow: 1 }}>
                    <Grid size={12}>

                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                flexWrap: 'wrap', // Allows items to wrap to the next line
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: 2, // Prevents elements from touching when wrapped
                                padding: '20px 16px',
                                boxSizing: 'border-box'
                            }}
                        >
                            <Typography sx={{ fontWeight: '700', color: '#111827' }}>
                                Product Catalog
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
                                <StockStatusSelect status={status} setStatus={setStatus} />
                                <Button variant="contained" sx={{ flexShrink: 0 }}>
                                    <AddIcon />Add
                                </Button>
                            </Box>
                        </Box>

                        <Divider />
                        <ProductsTable status={status} />
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
}

export default AdminOverview