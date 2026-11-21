import axios from 'axios'
// import React, { useEffect, useState } from 'react'
import { useNotification } from '../context/NotificationContext'
import { fetchProducts } from '../api/products'
import { useEffect, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Card,
    CardActionArea,
    CardMedia,
    CardContent,
    CardActions,
    Skeleton,
    TextField,
    Stack,
    Divider,

} from '@mui/material'
import LocalShippingOutlined from '@mui/icons-material/LocalShippingOutlined'
import LockOutlined from '@mui/icons-material/LockOutlined'
import ReplayOutlined from '@mui/icons-material/ReplayOutlined'
import SupportAgentOutlined from '@mui/icons-material/SupportAgentOutlined'
import { useCart } from '../context/CartContext'
import Fab from '@mui/material/Fab';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import Cart from '../components/cart/Cart'
import { Badge } from '@mui/material'

// Prices are stored in kobo, so divide by 100 to display naira
const formatPrice = (kobo) =>
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(kobo / 100)

// Replace with categories from your API once Phase 2 is done
const categories = [
    { name: 'Fashion', slug: 'fashion', image: 'https://placehold.co/400x300?text=Fashion' },
    { name: 'Electronics', slug: 'electronics', image: 'https://placehold.co/400x300?text=Electronics' },
    { name: 'Home', slug: 'home', image: 'https://placehold.co/400x300?text=Home' },
    { name: 'Beauty', slug: 'beauty', image: 'https://placehold.co/400x300?text=Beauty' },
]


const perks = [
    { icon: <LocalShippingOutlined fontSize="large" />, title: 'Fast delivery', text: 'Nationwide shipping' },
    { icon: <LockOutlined fontSize="large" />, title: 'Secure payment', text: 'Powered by Paystack' },
    { icon: <ReplayOutlined fontSize="large" />, title: 'Easy returns', text: '7-day return window' },
    { icon: <SupportAgentOutlined fontSize="large" />, title: 'Support', text: 'We reply within a day' },
]

export default function Home() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [email, setEmail] = useState('')
    const { setMessage } = useNotification()
    // const { addToCart } = useCart()
    const { cart, setCart, handleCartClose, handleCartOpen, showCart, addToCart } = useCart()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetchProducts({ params: { limit: 8, sort: '-createdAt' } });
                console.log(res.data.message)
                setProducts(res.data.products)
            } catch (err) {
                setMessage({
                    message: err?.response?.data.message,
                    severity: 'error'
                })
            } finally {
                setLoading(false)
            }
        }
        fetchData();
    }, [])

    const category = products.map(item => {
        return item.category
    })


    // const filterByCategory = products.filter(item => item.includes(products.category))
    // const filterByCategory = products.filter(item => item.category === catergory)

    const handleSubscribe = (e) => {
        e.preventDefault()
        // POST /newsletter  (optional, build later)
        setEmail('')
    }

    return (
        <Box>
            {/* ── Hero ── */}
            <Box
                sx={{
                    py: { xs: 8, md: 12 },
                    color: '#fff',
                    background: 'linear-gradient(135deg, #1a237e 0%, #5c6bc0 100%)',
                }}
            >
                <Container maxWidth="lg">
                    <Typography variant="h2" fontWeight={800} sx={{ fontSize: { xs: '2.2rem', md: '3.5rem' } }}>
                        Everything you need, delivered.
                    </Typography>
                    <Typography sx={{ mt: 2, mb: 4, maxWidth: 520, opacity: 0.9, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                        Shop quality products at fair prices, with secure checkout and fast delivery.
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <Button component={RouterLink} to="/products/shop" variant="contained" size="large" color="secondary">
                            Shop now
                        </Button>
                        <Button component={RouterLink} to="/shop?sort=-createdAt" variant="outlined" size="large" sx={{ color: '#fff', borderColor: '#fff' }}>
                            New arrivals
                        </Button>
                    </Stack>
                </Container>
            </Box>

            {/* ── Perks strip ── */}
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Grid container spacing={3}>
                    {perks.map((perk) => (
                        <Grid key={perk.title} size={{ xs: 6, md: 3 }}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Box sx={{ color: 'primary.main', display: 'flex' }}>{perk.icon}</Box>
                                <Box>
                                    <Typography fontWeight={600}>{perk.title}</Typography>
                                    <Typography variant="body2" color="text.secondary">{perk.text}</Typography>
                                </Box>
                            </Stack>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            <Divider />

            {/* ── Categories ── */}
            <Container maxWidth="lg" sx={{ py: 6 }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                    Shop by category
                </Typography>
                <Grid container spacing={2}>
                    {categories.map((cat) => (
                        <Grid key={cat.slug} size={{ xs: 6, md: 3 }}>
                            <Card>
                                <CardActionArea component={RouterLink} to={`/shop?category=${cat.slug}`}>
                                    <CardMedia component="img" height="140" image={cat.image} alt={cat.name} />
                                    <CardContent>
                                        <Typography fontWeight={600} align="center">{cat.name}</Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* ── Featured products ── */}
            <Container maxWidth="lg" sx={{ pb: 6 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Typography variant="h4" fontWeight={700}>New arrivals</Typography>
                    <Button component={RouterLink} to="/shop">View all</Button>
                </Stack>
                {/* 
                {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>} */}

                <Grid container spacing={2}>
                    {loading
                        ? Array.from({ length: 8 }).map((_, i) => (
                            <Grid key={i} size={{ xs: 6, md: 3 }}>
                                <Skeleton variant="rounded" height={180} />
                                <Skeleton width="80%" sx={{ mt: 1 }} />
                                <Skeleton width="40%" />
                            </Grid>
                        ))
                        : products.map((p) => (
                            <Grid key={p._id} size={{ xs: 6, md: 3 }}>
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <CardActionArea component={RouterLink} to={`/products/${p.slug}`} sx={{ flexGrow: 1 }}>
                                        <CardMedia
                                            component="img"
                                            height="180"
                                            image={p.images?.[0] || 'https://placehold.co/400x300?text=No+image'}
                                            alt={p.name}
                                        />
                                        <CardContent>
                                            <Typography
                                                fontWeight={600}
                                                sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                                            >
                                                {p.name}
                                            </Typography>
                                            <Typography color="primary" fontWeight={700}>
                                                {formatPrice(p.price)}
                                            </Typography>
                                            {p.stock === 0 && (
                                                <Typography variant="caption" color="error">Out of stock</Typography>
                                            )}
                                        </CardContent>
                                    </CardActionArea>
                                    <CardActions>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            fullWidth
                                            disabled={p.stock === 0}
                                            onClick={() => addToCart(p._id)}   // wire up in Phase 3
                                        >
                                            Add to cart
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                </Grid>
            </Container>

            {/* ── Newsletter ── */}
            <Box sx={{ bgcolor: 'grey.100', py: 6 }}>
                <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" fontWeight={700}>Get deals in your inbox</Typography>
                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                        New products and offers, no spam.
                    </Typography>
                    <Box component="form" onSubmit={handleSubscribe} sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                            type="email"
                            placeholder="you@example.com"
                            size="small"
                            fullWidth
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={{ bgcolor: '#fff' }}
                        />
                        <Button type="submit" variant="contained">Subscribe</Button>
                    </Box>
                </Container>
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


            <Cart showCart={showCart} cart={cart} setCart={setCart} handleCartClose={handleCartClose} />
        </Box>
    )
}