import { useState } from 'react';
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
import { deleteUserAddress } from '../../api/addresses';
import { useNotification } from '../../context/NotificationContext';
import DeleteIcon from '@mui/icons-material/Delete';

export function AddressComponent() {
    const { profile, loading, setProfile } = useProfile();
    const [selected, setSelected] = useState('');
    const { setMessage } = useNotification()


    if (loading || !profile) {
        return <CircularProgress />;
    }

    const addresses = Array.isArray(profile.shippingAddress)
        ? profile.shippingAddress
        : [];

    if (addresses.length === 0) {
        return (
            <Typography color="text.secondary">
                No shipping addresses saved yet.
            </Typography>
        );
    }

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

    const activeId = selected || addresses[0]._id;

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
                            <CardActionArea onClick={() => setSelected(address._id)} sx={{ p: 2 }}>
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
                                                {address.city}, {address.state}
                                            </Typography>
                                            <IconButton onClick={() => handleDelete(address._id)}><DeleteIcon /></IconButton>
                                        </div>
                                        <Radio
                                            checked={isSelected}
                                            value={address._id}
                                            slotProps={{ input: { 'aria-label': address.title } }}
                                        />
                                    </Stack>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    );
                })}
            </Stack>
        </RadioGroup>
    );
}