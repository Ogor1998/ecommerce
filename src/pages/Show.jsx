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
    Button,
    CircularProgress,
    Badge
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
import DetailsAccordion from '../components/reuseable/DetailsAccordion'
import CheckIcon from '@mui/icons-material/Check';






const Show = () => {
    const [product, setProduct] = useState({})
    const { setMessage } = useNotification();
    const [loading, setLoading] = useState(false)
    const [adding, setAdding] = useState(false)
    const { slug } = useParams();
    const {
        cart,
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
    }, [slug])
    console.log('thsi is product', product.images)

    // const [count, setCount] = useState(product.quantity)

    const count = getProductQuantity(product._id)



    const addToCart = async (id) => {
        setAdding(true)
        try {
            const res = await addCart(id);
            setCart(res.data.cart.items)
            handleCartOpen()
        } catch (err) {
            console.log(err?.response?.data.message)
        } finally {
            setAdding(false)
        }
    }
    console.log(product)


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



                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', m: 2 }}>
                                <Box sx={{ marginRight: 'auto', gap: '5px', display: 'flex', fontSize: '1.5rem' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <IconButton sx={{ border: '0.4px solid #000', borderRadius: '8px' }} onClick={() => decrement(product._id)}
                                        ><RemoveIcon /></IconButton>
                                        <span style={{ border: '0.4px solid #000', padding: '5px 20px', borderRadius: '10px' }}>{count}</span>
                                        <IconButton sx={{ border: '0.4px solid #000', borderRadius: '8px', }} onClick={() => increment(product._id)}><AddIcon /></IconButton>
                                    </Box>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        fullWidth
                                        color={adding ? 'success' : 'primary'}
                                        disabled={product.stock === 0}
                                        startIcon={
                                            adding ? <CircularProgress /> : <ShoppingBagIcon />
                                        }
                                        onClick={() => addToCart(product._id)}   // wire up in Phase 3
                                    >
                                        {adding ? 'Added to cart' : 'Add to cart'}
                                    </Button>
                                </Box>
                            </Box>

                            <DetailsAccordion product={product} />
                        </Paper>
                    </Grid>
                </Grid>



            </Box>
            <Box sx={{ '& > :not(style)': { m: 1 } }}>
                <Badge
                    badgeContent={cart.length}
                    color="secondary"
                    max={99}
                    sx={{
                        position: "fixed",
                        bottom: 24,
                        right: 24,
                        zIndex: 1000,
                        '& .MuiBadge-badge': {
                            fontWeight: 700,
                            fontSize: 11,
                        },
                    }}
                >
                    <Fab
                        color="primary"
                        aria-label="open cart"
                        onClick={handleCartOpen}
                    >
                        <ShoppingBagIcon />
                    </Fab>
                </Badge>
            </Box>
            <Cart showCart={showCart} handleCartClose={handleCartClose} />
        </>


    );
}

export default Show