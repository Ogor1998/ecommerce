import { useEffect, useState } from 'react';
import {
    Card,
    CardActionArea,
    CardContent,
    CircularProgress,
    IconButton,
    Radio,
    RadioGroup,
    Stack,
    Typography,
} from '@mui/material';
import { useProfile } from '../../context/ProfileContext';
import { deleteUserAddress, changeDefaultAddress } from '../../api/addresses';
import { useNotification } from '../../context/NotificationContext';
import DeleteIcon from '@mui/icons-material/Delete';

export function AddressComponent() {
    const { profile, loading, setProfile } = useProfile();
    const [selected, setSelected] = useState('');
    const { setMessage } = useNotification()
    const [updatingId, setUpdatingId] = useState(null);


    const addresses = Array.isArray(profile?.shippingAddress)
        ? profile.shippingAddress
        : [];


    const handleDelete = async (id) => {
        try {
            const res = await deleteUserAddress(id);
            setProfile(res.data)
            setMessage({
                text: res.data.message,
                severity: 'error'
            })
        } catch (err) {
            setMessage({
                text: err?.response?.data?.message,
                severity: 'error'
            })
        }

    }

    const defaultAddress =
        addresses.find((addr) => addr.main === true) || addresses[0];
    const activeId = defaultAddress?._id || '';
    console.log('this is selected', selected)


    const handleSelectDefault = async (addressId) => {
        if (addressId === activeId || updatingId) return;
        setUpdatingId(addressId);
        try {
            const res = await changeDefaultAddress(addressId);
            setProfile(res.data?.user || res.data);
            setMessage({
                text: res.data?.message || 'Default address updated',
                severity: 'success',
            });
        } catch (err) {
            setMessage({
                text: err?.response?.data?.message || 'Failed to update default address',
                severity: 'error',
            });
        } finally {
            setUpdatingId(null);
        }
    };
    if (addresses.length === 0) {
        return (
            <Typography color="text.secondary">
                No shipping addresses saved yet.
            </Typography>
        );
    }


    if (loading || !profile) {
        return <CircularProgress />;
    }


    return (
        <RadioGroup value={activeId} onChange={(e) => setSelected(e.target.value)}>
            <Stack spacing={2}>
                {addresses.map((address) => {
                    const isSelected = activeId === address._id;
                    return (
                        <Card
                            key={address._id}
                            variant="outlined"
                            sx={{
                                borderColor: isSelected ? 'primary.main' : 'divider',
                                borderWidth: isSelected ? 2 : 1,
                            }}
                        >
                            <CardActionArea onClick={() => handleSelectDefault(address._id)} sx={{ p: 2 }}>
                                <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                                        <div style={{ marginRight: 'auto' }}>
                                            <Typography variant="subtitle1" fontWeight={600}>
                                                {address.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {address.lineOne}
                                            </Typography>
                                            {address.lineTwo && (
                                                <Typography variant="body2" color="text.secondary">
                                                    {address.lineTwo}
                                                </Typography>
                                            )}
                                            <Typography variant="body2" color="text.secondary">
                                                {address.city}, {address.state} State
                                            </Typography>

                                        </div>
                                        <Radio
                                            checked={isSelected}
                                            value={address._id}
                                            slotProps={{ input: { 'aria-label': address.title } }}
                                        />
                                    </Stack>
                                </CardContent>
                            </CardActionArea>
                            <IconButton
                                aria-label="delete address"
                                onClick={() => handleDelete(address._id)}
                                sx={{
                                    mr: 1.5,
                                    color: 'text.secondary',
                                    '&:hover': { color: 'error.main' },
                                }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Card>
                    );
                })}
            </Stack>
        </RadioGroup>
    );
}