import { useEffect, useState } from 'react'
import { Link as RouterLink, useSearchParams } from 'react-router-dom'
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardActionArea,
    CardMedia,
    CardContent,
    CardActions,
    Button,
    Skeleton,
    TextField,
    InputAdornment,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Chip,
    Stack,
    Pagination,
    Drawer,
    IconButton,
    Slider,
    useMediaQuery,
    useTheme,
    Badge
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import FilterListIcon from '@mui/icons-material/FilterList'
import CloseIcon from '@mui/icons-material/Close'
import { fetchProducts, fetchCategories } from '../api/products'
import Cart from '../components/cart/Cart'
import Fab from '@mui/material/Fab';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { addCart } from '../api/carts'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/formatPrice'

const PAGE_SIZE = 6
const MAX_PRICE = 500000   // in naira, adjust to your catalogue

// Prices are stored in kobo
// const formatPrice = (kobo) =>
//     new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(kobo / 100)

// Replace with categories from your API

const sortOptions = [
    { value: '-createdAt', label: 'Newest' },
    { value: 'price', label: 'Price: low to high' },
    { value: '-price', label: 'Price: high to low' },
    { value: 'name', label: 'Name: A to Z' },
]

export default function Shop({ setShowCart, }) {
    const theme = useTheme()
    const { cart, setCart, handleCartClose, handleCartOpen, showCart, addToCart } = useCart()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    // The URL is the source of truth, so filters survive refresh and can be shared as links
    const [searchParams, setSearchParams] = useSearchParams()
    const category = searchParams.get('category') || ''
    const sort = searchParams.get('sort') || '-createdAt'
    const page = Number(searchParams.get('page')) || 1
    const q = searchParams.get('q') || ''
    const minPrice = Number(searchParams.get('minPrice')) || 0
    const maxPrice = Number(searchParams.get('maxPrice')) || MAX_PRICE

    const [products, setProducts] = useState([])
    const [totalPages, setTotalPages] = useState(1)
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const [searchInput, setSearchInput] = useState(q)
    const [priceRange, setPriceRange] = useState([minPrice, maxPrice])
    const [drawerOpen, setDrawerOpen] = useState(false)


    const [categories, setCategories] = useState([])
    useEffect(() => {
        const fetchCat = async () => {
            const res = await fetchCategories()
            console.log(res.data)
            setCategories(res.data)
        }
        fetchCat();
    }, [])

    // Update one or more URL params; reset to page 1 when a filter changes
    const updateParams = (changes, resetPage = true) => {
        const next = new URLSearchParams(searchParams)
        Object.entries(changes).forEach(([key, value]) => {
            if (value === '' || value === null || value === undefined) next.delete(key)
            else next.set(key, value)
        })
        if (resetPage) next.delete('page')
        setSearchParams(next)
    }

    // Debounce the search box so we don't call the API on every keystroke
    useEffect(() => {
        const t = setTimeout(() => {
            if (searchInput !== q) updateParams({ q: searchInput })
        }, 400)
        return () => clearTimeout(t)
    }, [searchInput])


    useEffect(() => {
        let cancelled = false
        const load = async () => {
            setLoading(true)
            setError('')
            try {
                // GET /products?q=&category=&sort=&page=&limit=&minPrice=&maxPrice=   (build this in Phase 2)
                const res = await fetchProducts({
                    params: {
                        q: q || undefined,
                        category: category || undefined,
                        sort,
                        page,
                        limit: PAGE_SIZE,
                        minPrice: minPrice ? minPrice * 100 : undefined,   // naira to kobo
                        // maxPrice: maxPrice < MAX_PRICE ? maxPrice * 100 : undefined,
                    },
                })
                if (cancelled) return
                setProducts(res.data.products)
                setTotal(res.data.total ?? res.data.products.length)
                setTotalPages(res.data.totalPages ?? 1)
            } catch (err) {
                if (!cancelled) setError('Could not load products. Please try again.')
            } finally {
                if (!cancelled) setLoading(false)
            }
        }
        load()
        return () => { cancelled = true }   // ignore stale responses when filters change quickly
    }, [q, category, sort, page, minPrice, maxPrice])

    const clearAll = () => {
        setSearchInput('')
        setPriceRange([0, MAX_PRICE])
        setSearchParams({})
    }

    const hasFilters = q || category || minPrice || maxPrice < MAX_PRICE

    // ── Filters panel (used in the sidebar on desktop and in a drawer on mobile) ──
    const filters = (
        <Box sx={{ width: { xs: 280, md: '100%' }, p: { xs: 2, md: 0 } }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6" fontWeight={700}>Filters</Typography>
                {isMobile && (
                    <IconButton onClick={() => setDrawerOpen(false)} aria-label="close filters">
                        <CloseIcon />
                    </IconButton>
                )}
            </Stack>

            <Typography fontWeight={600} sx={{ mb: 1 }}>Category</Typography>
            <Stack spacing={1} alignItems="flex-start" sx={{ mb: 3 }}>
                <Chip
                    label="All"
                    clickable
                    color={!category ? 'primary' : 'default'}
                    onClick={() => updateParams({ category: '' })}
                />
                {categories.map((c) => (
                    <Chip
                        key={c}
                        label={c.charAt(0).toUpperCase() + c.slice(1)}
                        clickable
                        color={category === c ? 'primary' : 'default'}
                        onClick={() => updateParams({ category: c })}
                    />
                ))}
            </Stack>

            <Typography fontWeight={600}>Price (₦)</Typography>
            <Slider
                value={priceRange}
                min={0}
                max={MAX_PRICE}
                step={1000}
                valueLabelDisplay="auto"
                onChange={(e, value) => setPriceRange(value)}
                // only hit the API when the user lets go of the slider
                onChangeCommitted={(e, [min, max]) => updateParams({ minPrice: min || '', maxPrice: max < MAX_PRICE ? max : '' })}
                sx={{ mt: 4, mb: 1 }}
            />
            <Typography variant="body2" color="text.secondary">
                ₦{priceRange[0].toLocaleString()} to ₦{priceRange[1].toLocaleString()}
            </Typography>

            {hasFilters && (
                <Button onClick={clearAll} sx={{ mt: 3 }} fullWidth variant="outlined">
                    Clear all filters
                </Button>
            )}
        </Box>
    )

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>Shop</Typography>

            {/* ── Toolbar: search, sort, mobile filter button ── */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
                <TextField
                    placeholder="Search products"
                    size="small"
                    fullWidth
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start"><SearchIcon /></InputAdornment>
                            ),
                        },
                    }}
                />
                <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel id="sort-label">Sort by</InputLabel>
                    <Select
                        labelId="sort-label"
                        label="Sort by"
                        value={sort}
                        onChange={(e) => updateParams({ sort: e.target.value })}
                    >
                        {sortOptions.map((o) => (
                            <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {isMobile && (
                    <Button variant="outlined" startIcon={<FilterListIcon />} onClick={() => setDrawerOpen(true)}>
                        Filters
                    </Button>
                )}
            </Stack>

            <Grid container spacing={3}>
                {/* ── Sidebar (desktop) ── */}
                {!isMobile && (
                    <Grid size={{ md: 3 }}>{filters}</Grid>
                )}

                {/* ── Results ── */}
                <Grid size={{ xs: 12, md: 9 }}>
                    {!loading && !error && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {total} {total === 1 ? 'product' : 'products'}
                            {category && ` in ${category}`}
                            {q && ` matching "${q}"`}
                        </Typography>
                    )}

                    {error && (
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                            <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
                            <Button variant="outlined" onClick={() => setSearchParams(searchParams)}>Try again</Button>
                        </Box>
                    )}

                    <Grid container spacing={2}>
                        {loading
                            ? Array.from({ length: 6 }).map((_, i) => (
                                <Grid key={i} size={{ xs: 6, md: 4 }}>
                                    <Skeleton variant="rounded" height={180} />
                                    <Skeleton width="80%" sx={{ mt: 1 }} />
                                    <Skeleton width="40%" />
                                </Grid>
                            ))
                            : products.map((p) => (
                                <Grid key={p._id} size={{ xs: 6, md: 4 }}>
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
                                                sx={{ backgroundColor: '#111827' }}
                                                onClick={() => addToCart(p._id)}   // wire up in Phase 3
                                            >
                                                Add to cart
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                    </Grid>

                    {/* ── Empty state ── */}
                    {!loading && !error && products.length === 0 && (
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                            <Typography variant="h6" gutterBottom>No products found</Typography>
                            <Typography color="text.secondary" sx={{ mb: 2 }}>
                                Try a different search or remove some filters.
                            </Typography>
                            {hasFilters && <Button variant="contained" onClick={clearAll}>Clear filters</Button>}
                        </Box>
                    )}

                    {/* ── Pagination ── */}
                    {!loading && totalPages > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <Pagination
                                count={totalPages}
                                page={page}
                                color="primary"
                                onChange={(e, value) => {
                                    updateParams({ page: value }, false)
                                    window.scrollTo({ top: 0, behavior: 'smooth' })
                                }}
                            />
                        </Box>
                    )}
                </Grid>
            </Grid>
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
            {/* ── Mobile filter drawer ── */}
            <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                {filters}
            </Drawer>
        </Container>
    )
}