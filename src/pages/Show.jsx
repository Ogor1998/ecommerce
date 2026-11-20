import React, { useEffect, useState } from 'react'
import { fetchProduct } from '../api/products'
import { useNotification } from '../context/NotificationContext'
import { useParams } from 'react-router-dom'
import BreadcrumbsComponent from '../components/common/BreadcrumbsComponent'
import {
    Box,
    Grid,
    Fab,
    Typography, Paper, Divider,
    IconButton,
    Button
} from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { changeTolocalCurrency } from '../utils/changeTolocalCurrency'
import { updateQuantity, addCart } from '../api/carts'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import Cart from '../components/cart/Cart'
import { Carousel } from 'react-responsive-carousel'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useCart } from '../context/CartContext'




const Show = () => {
    const [product, setProduct] = useState({})
    const { setMessage } = useNotification();
    const [loading, setLoading] = useState(false)
    const { slug } = useParams();
    const {
        getProductQuantity,
        setCart,
        increment,
        decrement,
        handleCartClose,
        handleCartOpen,
        showCart } = useCart()


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const res = await fetchProduct(slug);
                console.log('thsi is product', product)
                setProduct(res.data)
            } catch (err) {
                setMessage({
                    text: 'Could not load this product',
                    severity: 'error'
                })
            } finally {
                setLoading(false)
            }
        }
        fetchData();
    }, [])

    // const [count, setCount] = useState(product.quantity)

    const count = getProductQuantity(product._id)



    const addToCart = async (id) => {
        try {
            const res = await addCart(id);
            console.log(res.data)
            setCart(res.data.cart.items)
            handleCartOpen()
        } catch (err) {
            console.log(err?.response?.data.message)
        }
    }


    return (

        <>
            <Box sx={{ flexGrow: 1, p: 3 }}>
                <Grid container spacing={3}>
                    {/* Top Row: Full Width for Breadcrumbs */}
                    <Grid size={12}>
                        <BreadcrumbsComponent product={product} />
                    </Grid>

                    {/* Bottom Left Column */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper sx={{ p: 2, height: '100%' }}>
                            <Typography variant="h6">Left Section</Typography>
                            <Typography variant="body2">
                                Content for the left column goes here.
                            </Typography>

                            {product.images?.length > 0 &&
                                <Carousel showThumbs={true}      // ← removes bottom thumbnails
                                    showStatus={false}      // ← removes "1 of 3" counter
                                    showIndicators={true}   // ← keeps the dots at bottom
                                    infiniteLoop={true}     // ← loops back to start
                                    renderThumbs={() =>
                                        product.images.map((src, index) => (
                                            <img
                                                key={index}
                                                src={src}
                                                alt={`thumb-${index}`}
                                                style={{ height: '60px', width: '100%', objectFit: 'cover' }}
                                            />
                                        ))
                                    }

                                >
                                    {product.images?.map((src, index) => (
                                        <div key={index}>
                                            <img src={src} alt={`preview-${index}`}
                                                style={{
                                                    width: '100%',
                                                    height: '500px',
                                                    objectFit: 'cover',
                                                    borderRadius: '15px',
                                                }} />
                                        </div>
                                    ))}
                                </Carousel>
                            }
                        </Paper>
                    </Grid>

                    {/* Bottom Right Column */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper sx={{ p: 2, height: '100%' }}>
                            <Typography variant="body2">
                                {product.category}
                            </Typography>
                            <Typography variant="h6">{product.name}</Typography>
                            <Typography variant="body2">
                                {changeTolocalCurrency(product?.price)}
                            </Typography>
                            <Divider sx={{ m: 2 }} />
                            <Typography variant="body2" sx={{ fontSize: '1.9rem', fontWeight: '400', mb: 2 }}>
                                {product.description}
                            </Typography>



                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', }}>
                                <Box sx={{ marginRight: 'auto', gap: '5px', display: 'flex', fontSize: '1.5rem' }}>
                                    <IconButton sx={{ border: '0.4px solid #000', borderRadius: '8px', }} onClick={() => increment(product._id)}><AddIcon /></IconButton>
                                    {/* <input min="1" type='number' onBlur={handleBlur} onChange={handleChange} value={count} className='show__input__field' />
                                     */}
                                    <span>{count}</span>
                                    <IconButton sx={{ border: '0.4px solid #000', borderRadius: '8px' }} onClick={() => decrement(product._id)}
                                    ><RemoveIcon /></IconButton>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        fullWidth
                                        disabled={product.stock === 0}
                                        startIcon={
                                            <ShoppingBagIcon />
                                        }
                                        onClick={() => addToCart(product._id)}   // wire up in Phase 3
                                    >
                                        Add to cart
                                    </Button>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>



            </Box>

            <Box sx={{ '& > :not(style)': { m: 1 } }}>
                <Fab
                    color="primary"
                    aria-label="add"
                    sx={{
                        position: "fixed",
                        bottom: 24,
                        right: 24,
                        zIndex: 1000
                    }}
                    onClick={handleCartOpen}
                >
                    <ShoppingBagIcon />
                </Fab>
            </Box>

            <Cart showCart={showCart} handleCartClose={handleCartClose} />
        </>


    );
}

export default Show