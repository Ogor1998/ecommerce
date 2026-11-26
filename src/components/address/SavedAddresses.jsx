// import React, { useState } from 'react'
import { Box, Button, TextField, Typography, Grid, Divider, CircularProgress } from '@mui/material'
import { AddressComponent } from './AddressComponent'
import { useState } from 'react'
import { CitySelect, StateSelect } from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import { addUserAddress } from '../../api/addresses';
import { useProfile } from '../../context/ProfileContext';
import { useNotification } from '../../context/NotificationContext';
import SaveIcon from '@mui/icons-material/Save';


const SavedAddresses = () => {
    const { setProfile } = useProfile()
    const { setMessage } = useNotification()
    const [cityValue, setCityValue] = useState("")
    const [stateValue, setStateValue] = useState("")
    const [formData, setFormData] = useState({
        title: '',
        lineOne: '',
        lineTwo: '',
        city: '',
        state: ''
    })
    const [isSaving, setIsSaving] = useState(false)

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
        setIsSaving(true)
        try {
            const res = await addUserAddress(formData)
            setProfile(res.data)
            setFormData({ title: '', lineOne: '', lineTwo: '', city: '', state: '' });
            setStateId(0);
            setIsNewAddress(false);
            setMessage({ text: 'Address added successfully', severity: 'success' });
        } catch (err) {
            setMessage({
                text: err?.response?.data?.message,
                severity: 'succes'
            })
        } finally {
            setIsSaving(false)
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

                <Grid
                    container
                    component="form"
                    onSubmit={handleSubmit}
                    rowSpacing={2}
                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                >
                    {/* Row 1: Title takes the full width (12 columns) */}
                    <Grid size={12}>
                        <Typography variant="body2" fontWeight={500} mb={0.5} component="label" htmlFor="title-input">
                            Title *
                        </Typography>
                        <TextField
                            id="title-input"
                            fullWidth
                            size="small"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </Grid>

                    {/* Row 2: Line One & Line Two (6 columns each) */}
                    <Grid size={6}>
                        <Typography variant="body2" fontWeight={500} mb={0.5} component="label" htmlFor="lineOne-input">
                            Line One *
                        </Typography>
                        <TextField
                            id="lineOne-input"
                            fullWidth
                            size="small"
                            name="lineOne"
                            type="text"
                            value={formData.lineOne}
                            onChange={handleChange}
                            required
                        />
                    </Grid>

                    <Grid size={6}>
                        <Typography variant="body2" fontWeight={500} mb={0.5} component="label" htmlFor="lineTwo-input">
                            Line Two
                        </Typography>
                        <TextField
                            id="lineTwo-input"
                            fullWidth
                            size="small"
                            name="lineTwo"
                            value={formData.lineTwo}
                            onChange={handleChange}
                        />
                    </Grid>

                    {/* Row 3: State & City (6 columns each) */}
                    <Grid size={6}>
                        <StateSelect
                            countryid={161}
                            onChange={(e) => {
                                setStateId(e.id);
                                setStateValue(e.name);
                                setFormData(prev => ({ ...prev, state: e.name }))
                            }}
                            placeHolder="Select State"
                        />
                    </Grid>

                    <Grid size={6}>
                        <CitySelect
                            countryid={161}
                            stateid={stateId}
                            onChange={(e) => {
                                setCityValue(e.name)
                                setFormData(prev => ({ ...prev, city: e.name }))
                            }}
                            placeHolder="Select City"
                        />
                    </Grid>

                    {/* Row 4: Full-width Submit Button */}
                    <Grid size={12}>
                        <Button type="submit"
                            disabled={isSaving}
                            variant="contained"
                            startIcon={
                                isSaving ? <CircularProgress /> : <SaveIcon />
                            }
                            fullWidth>
                            {isSaving ? 'Adding address' : 'Add address'}
                        </Button>
                    </Grid>
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