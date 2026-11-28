import React, { useState } from 'react'
import { Grid, Paper, Box, Button, Typography, TextField, CircularProgress } from '@mui/material';
import DragAndDrop from '../common/DragAndDrop';
import { Checkbox, FormControlLabel } from '@mui/material';
import { newProduct } from '../../api/products';
import { useNotification } from '../../context/NotificationContext';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

const ProductForm = () => {
    const [images, setImages] = useState([null, null, null]);
    const navigate = useNavigate()
    const { setMessage } = useNotification()
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        price: '',
        stock: '',
        isActive: ''
    })

    console.log('this should be images array', images)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }))
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = new FormData();

        form.append('name', formData.name)
        form.append('slug', formData.slug)
        form.append('description', formData.description)
        form.append('price', formData.price)
        form.append('category', formData.category)
        form.append('stock', formData.stock)
        form.append('isActive', formData.isActive)
        images.forEach((item) => {
            // 1. Skip empty/null slots
            if (!item) return;

            // 2. Grab the actual File object if it's wrapped in an object (e.g., { file, preview })
            const actualFile = item instanceof File ? item : item.file;

            // 3. Only append if it's a valid File or Blob
            if (actualFile instanceof File || actualFile instanceof Blob) {
                form.append('images', actualFile);
            }
        });
        setSaving(true)
        try {
            const res = await newProduct(form)
            setMessage({ text: 'Product created successfully!', severity: 'success' });
            console.log(res.data)
            navigate(`/products/${res.data.slug}`)
        } catch (err) {
            setMessage({
                text: err?.response?.data?.message,
                severity: 'error'
            })
        } finally {
            setSaving(false)
        }

    }
    return (
        <Box
            component='form'
            onSubmit={handleSubmit}
            sx={{ flexGrow: 1, p: 2, backgroundColor: '#E5E7EB' }}>
            <Grid container spacing={2}>
                {/* Top Row: Full Width (12/12 = 100%) */}
                <Grid size={12}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#fff' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Button>Back to Products</Button>
                            <Typography sx={{ fontWeight: '700' }}>Add a new Product</Typography>
                            <Box sx={{ display: 'flex', gap: '10px' }}>
                                <Button variant='outlined'>Discard</Button>
                                <Button variant='contained'
                                    type='submit'
                                    disabled={saving}
                                    startIcon={
                                        saving ? <CircularProgress /> : <AddIcon />
                                    }
                                >{saving ? 'Saving' : 'Save'}</Button>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>

                {/* Bottom Left: ~60% Width (7/12 = 58.3%) */}


                <Grid size={{ xs: 12, md: 7, }} spacing={2}>
                    <Paper sx={{ p: 2, mb: 3, display: 'flex', gap: '16px', flexDirection: 'column' }} >
                        <Typography sx={{ fontWeight: '700' }}>General Information</Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Typography component='label' sx={{ fontSize: '13px' }}>Name</Typography>
                            <TextField placeholder='Enter Product name' name='name' value={formData.name} onChange={handleChange} />
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Typography component='label' sx={{ fontSize: '13px' }}>Slug</Typography>
                            <TextField placeholder='Enter Product Slug' name='slug' value={formData.slug} onChange={handleChange} />
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Typography component='label' sx={{ fontSize: '13px' }}>Description</Typography>
                            <TextField placeholder='Enter Product Description' name='description' value={formData.description} onChange={handleChange} multiline />
                        </Box>
                    </Paper>
                    <Paper sx={{ p: 2 }}>
                        <Typography sx={{ mb: 3, fontWeight: '700' }}>Pricing & Inventory</Typography>
                        <Grid container spacing={2} size={12}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    <Typography component="label" sx={{ fontSize: '0.8rem', fontWeight: '700' }}>Price</Typography>
                                    <TextField placeholder="Enter Product Price" name='price' value={formData.price} onChange={handleChange} fullWidth />
                                </Box>
                            </Grid>

                            {/* <Grid size={{ xs: 12, sm: 6 }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    <Typography component="label" sx={{ fontSize: '0.8rem', fontWeight: '700' }}>Compare-at Price</Typography>
                                    <TextField placeholder="Enter Compare-at price" fullWidth />
                                </Box>
                            </Grid> */}

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    <Typography component="label" sx={{ fontSize: '0.8rem', fontWeight: '700' }}>Stock quantity</Typography>
                                    <TextField placeholder="Enter Stock quantity" name='stock' value={formData.stock} onChange={handleChange} fullWidth />
                                </Box>
                            </Grid>

                            {/* <Grid size={{ xs: 12, sm: 6 }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    <Typography component="label" sx={{ fontSize: '0.8rem', fontWeight: '700' }}>Low stock alert threshold</Typography>
                                    <TextField placeholder="Enter threshold" fullWidth />
                                </Box>
                            </Grid> */}
                        </Grid>


                    </Paper>
                </Grid>

                {/* Bottom Right: Remaining Space (~40% Width, 5/12 = 41.7%) */}
                <Grid size={{ xs: 12, md: 5 }}>
                    <Paper sx={{ p: 2, bgcolor: '#fff', mb: 2 }}>
                        <Typography sx={{ fontWeight: '700', mb: 2 }}>Product Media</Typography>
                        <DragAndDrop images={images} setImages={setImages} />
                    </Paper>
                    <Paper sx={{ p: 2, mb: 3, display: 'flex', gap: '16px', flexDirection: 'column' }} >
                        <Typography sx={{ fontWeight: '700' }}>Organisation & Status</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Typography component="label" sx={{ fontSize: '0.8rem', fontWeight: '700' }}>Category</Typography>
                            <TextField placeholder="Enter category" name='category' value={formData.category} onChange={handleChange} fullWidth />
                        </Box>
                        {/* <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Typography component="label" sx={{ fontSize: '0.8rem', fontWeight: '700' }}>SKU</Typography>
                            <TextField placeholder="Enter threshold" fullWidth />
                        </Box> */}

                        <FormControlLabel control={
                            <Checkbox
                                checked={formData.isActive}
                                onChange={(e) => {
                                    setFormData((prev) => ({ ...prev, isActive: e.target.checked }));
                                }}
                                slotProps={{
                                    input: { 'aria-label': 'controlled' },
                                }}
                            />
                        } label="Active in store" />

                    </Paper>
                </Grid>
            </Grid >
        </Box >

    )
}

export default ProductForm