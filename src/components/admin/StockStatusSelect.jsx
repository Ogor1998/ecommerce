import React, { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

export default function StockStatusSelect({ status, setStatus }) {


    const handleChange = (event) => {
        setStatus(event.target.value);
    };




    return (
        <FormControl sx={{ minWidth: 150 }} size="small">
            <InputLabel id="stock-status-label">Stock Status</InputLabel>
            <Select
                labelId="stock-status-label"
                id="stock-status-select"
                value={status}
                label="Stock Status"
                onChange={handleChange}
            >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="in_stock">In Stock</MenuItem>
                <MenuItem value="low_stock">Low Stock</MenuItem>
                <MenuItem value="out_of_stock">Out of Stock</MenuItem>
            </Select>
        </FormControl>
    );
}
