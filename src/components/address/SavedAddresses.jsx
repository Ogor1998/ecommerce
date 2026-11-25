// import React, { useState } from 'react'
import { Box, Button, TextField, Typography, Grid, Divider } from '@mui/material'
import { AddressComponent } from './AddressComponent'
import { useState } from 'react'
import { CitySelect, StateSelect } from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import { addUserAddress } from '../../api/addresses';
import { useProfile } from '../../context/ProfileContext';
import { useNotification } from '../../context/NotificationContext';


const SavedAddresses = () => {
    const { setProfile } = useProfile()
    const { setMessage } = useNotification()
    const [cityValue, setCityValue] = useState("")
    const [stateValue, setStateValue] = useState("")
    const [formData, setFormData] = useState({
        title: '',
        lineOne: '',
        lineTwo: '',
        city: cityValue,
        state: stateValue
    })

    console.log('this is cityValue', cityValue)
    console.log('this is stateValue', stateValue)
    const [stateId, setStateId] = useState(0)
    const [isNewAddress, setIsNewAddress] = useState(false)
    const handleSwitch = () => {
        setIsNewAddress(prev => !prev)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }
    // console.log(countryId)

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            console.log('THIS IS FORMDATA', formData)
            const res = await addUserAddress(formData)

            setProfile(res.data)
        } catch (err) {
            setMessage({
                text: err?.response?.data?.message,
                severity: 'succes'
            })
        }
    }

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
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={handleSwitch}>Add a new address</Button>
            </Box>

            {isNewAddress && (
                // <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

                <Grid container
                    component='form'
                    onSubmit={handleSubmit}
                    rowSpacing={2}
                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <TextField
                        fullWidth
                        size="small"
                        label="Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                    <Grid size={6}>
                        <TextField
                            fullWidth
                            size="small"
                            label="line one"
                            name="lineOne"
                            type='address'
                            value={formData.lineOne}
                            onChange={handleChange}
                            required
                        />

                    </Grid>
                    <Grid size={6}>
                        <TextField
                            fullWidth
                            size="small"
                            label="line two"
                            name="lineTwo"
                            value={formData.lineTwo}
                            onChange={handleChange}

                        />

                    </Grid>

                    <Grid size={6}>
                        <StateSelect countryid={161} onChange={(e) => {
                            setStateId(e.id)
                            setStateValue(e.name)
                        }}
                            placeHolder="Select State" />

                    </Grid>
                    <Grid size={6}>
                        <CitySelect countryid={161} stateid={stateId} onChange={(e) => setCityValue(e.name)}
                            placeHolder="Select City" />
                    </Grid>
                    <Button type='submit' variant='contained' fullWidth>Add address</Button>
                </Grid>


                // </Box>
            )

            }
            <Divider />

            <AddressComponent />


        </Box>
    )
}

export default SavedAddresses