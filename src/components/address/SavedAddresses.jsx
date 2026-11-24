import React from 'react'
import { Box, Typography } from '@mui/material'

const SavedAddresses = () => {
    return (


        <Box
            sx={{
                width: "100%",
                maxWidth: 960,
                mx: "auto",
                p: { xs: 2.5, sm: 4 },
                borderRadius: 3,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                display: "flex",
                flexDirection: "column",
                gap: 2.5,
            }}
        >
            <Typography>Add a new address</Typography>


        </Box>
    )
}

export default SavedAddresses