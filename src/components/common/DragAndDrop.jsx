import React, { useState, useRef } from 'react';
import {
    Box,
    Typography,
    IconButton,
    Paper,
    Grid,
    Stack,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';

// Reusable single slot component
const ImageSlot = ({
    label,
    image,
    onDropFile,
    onRemove,
    isPrimary = false,
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            onDropFile(file);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            onDropFile(file);
        }
        // Reset input so the same file can be re-selected if removed
        e.target.value = '';
    };

    return (
        <Paper
            variant="outlined"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !image && inputRef.current?.click()}
            sx={{
                position: 'relative',
                height: isPrimary ? 200 : 130,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                p: 2,
                cursor: image ? 'default' : 'pointer',
                overflow: 'hidden',
                borderStyle: image ? 'solid' : 'dashed',
                borderWidth: 2,
                borderColor: isDragging ? 'primary.main' : 'divider',
                bgcolor: isDragging ? 'action.hover' : 'background.paper',
                '&:hover': {
                    borderColor: image ? 'divider' : 'primary.main',
                    bgcolor: image ? 'background.paper' : 'action.hover',
                },
            }}
        >
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />

            {image ? (
                <>
                    <Box
                        component="img"
                        src={image.preview}
                        alt={label}
                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <IconButton
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove();
                        }}
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            bgcolor: 'rgba(0, 0, 0, 0.6)',
                            color: 'common.white',
                            '&:hover': { bgcolor: 'error.main' },
                        }}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </>
            ) : (
                <>
                    {isPrimary ? (
                        <CloudUploadIcon color="primary" sx={{ fontSize: 44, mb: 1 }} />
                    ) : (
                        <AddPhotoAlternateIcon color="action" sx={{ fontSize: 32, mb: 1 }} />
                    )}
                    <Typography
                        variant={isPrimary ? 'subtitle1' : 'body2'}
                        fontWeight={600}
                        color="text.primary"
                    >
                        {label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Drag & drop or click to browse
                    </Typography>
                </>
            )}
        </Paper>
    );
};

export default function DragAndDrop({ images, setImages, onChange }) {
    // Index 0 = Main image, Index 1 & 2 = Additional images


    const handleSetImage = (index, file) => {
        const preview = URL.createObjectURL(file);
        const updated = [...images];

        // Revoke old URL to prevent memory leaks
        if (updated[index]?.preview) {
            URL.revokeObjectURL(updated[index].preview);
        }

        updated[index] = { file, preview };
        setImages(updated);
        onChange?.(updated.map((item) => item?.file || null));
    };

    const handleRemoveImage = (index) => {
        const updated = [...images];
        if (updated[index]?.preview) {
            URL.revokeObjectURL(updated[index].preview);
        }
        updated[index] = null;
        setImages(updated);
        onChange?.(updated.map((item) => item?.file || null));
    };

    return (
        <Box sx={{ width: '100%', maxWidth: 600 }}>
            <Grid container spacing={2}>
                {/* Primary Main Slot */}
                <Grid size={12}>
                    <ImageSlot
                        label="Main Cover Image"
                        image={images[0]}
                        isPrimary
                        onDropFile={(file) => handleSetImage(0, file)}
                        onRemove={() => handleRemoveImage(0)}
                    />
                </Grid>

                {/* Additional Image Slot 1 */}
                <Grid size={6}>
                    <ImageSlot
                        label="Additional Image 1"
                        image={images[1]}
                        onDropFile={(file) => handleSetImage(1, file)}
                        onRemove={() => handleRemoveImage(1)}
                    />
                </Grid>

                {/* Additional Image Slot 2 */}
                <Grid size={6}>
                    <ImageSlot
                        label="Additional Image 2"
                        image={images[2]}
                        onDropFile={(file) => handleSetImage(2, file)}
                        onRemove={() => handleRemoveImage(2)}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}
