import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import ButtonBase from '@mui/material/ButtonBase';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { Box } from '@mui/material';


export default function AvatarUpload({ setFile, currentImage }) {
    const [avatarSrc, setAvatarSrc] = React.useState(currentImage);

    const handleAvatarChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            // Read the file as a data URL
            const reader = new FileReader();
            reader.onload = () => {
                setAvatarSrc(reader.result);
            };
            reader.readAsDataURL(file);
        }
        if (file) {
            setFile(file)
        }
    };

    return (
        <ButtonBase
            component="label"
            role={undefined}
            tabIndex={-1} // prevent label from tab focus
            aria-label="Avatar image"
            sx={{
                borderRadius: '40px',
                '&:has(:focus-visible)': {
                    outline: '2px solid',
                    outlineOffset: '2px',
                },

            }}
        >
            <Box sx={{ position: 'relative', width: 100, height: 100 }}>
                <Avatar
                    alt="Upload new avatar"
                    src={avatarSrc}
                    sx={{ width: 100, height: 100 }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '50%',
                        bgcolor: 'rgba(0, 0, 0, 0.5)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0,
                        transition: 'opacity 0.2s ease-in-out',
                        '&:hover': {
                            opacity: 1,
                        },
                    }}
                >
                    <PhotoCameraIcon />
                </Box>
            </Box>
            <input
                type="file"
                accept="image/*"
                style={{
                    border: 0,
                    clip: 'rect(0 0 0 0)',
                    height: '1px',
                    margin: '-1px',
                    overflow: 'hidden',
                    padding: 0,
                    position: 'absolute',
                    whiteSpace: 'nowrap',
                    width: '1px',
                }}
                onChange={handleAvatarChange}
            />
        </ButtonBase>




    );
}
