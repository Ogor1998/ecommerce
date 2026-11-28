import { useEffect, useState } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import {
    Avatar,
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Pagination,
    Paper,
    Select,
    Skeleton,
    Stack,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import { filterProducts, fetchCategories, deleteProduct } from '../../api/products';
import { useNotification } from '../../context/NotificationContext';
import { formatPrice } from '../../utils/formatPrice';
import RestoreIcon from '@mui/icons-material/Restore';

const PAGE_SIZE = 6;

const sortOptions = [
    { value: '-createdAt', label: 'Newest' },
    { value: 'price', label: 'Price: low to high' },
    { value: '-price', label: 'Price: high to low' },
    { value: 'stock', label: 'Stock: low to high' },
    { value: 'name', label: 'Name: A to Z' },
];

const statusTabs = [
    { value: 'all', label: 'All Products' },
    { value: 'in_stock', label: 'In Stock' },
    { value: 'low_stock', label: 'Low Stock' },
    { value: 'out_of_stock', label: 'Out of Stock' },
    { value: 'inactive_products', label: 'Hidden Products' },

];

const getStockBadge = (stock) => {
    if (stock === 0) {
        return { label: 'Out of stock', bgcolor: '#FEE2E2', color: '#DC2626' };
    }
    if (stock < 10) {
        return { label: `${stock} left (Low)`, bgcolor: '#FEF3C7', color: '#B45309' };
    }
    return { label: `${stock} in stock`, bgcolor: '#DCFCE7', color: '#16A34A' };
};

export default function AdminProducts() {
    const { setMessage } = useNotification();
    const [searchParams, setSearchParams] = useSearchParams();

    // URL-synced filters & pagination
    const status = searchParams.get('status') || 'all';
    const category = searchParams.get('category') || '';
    const sort = searchParams.get('sort') || '-createdAt';
    const page = Number(searchParams.get('page')) || 1;
    const q = searchParams.get('q') || '';

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [loading, setLoading] = useState(true);

    const [searchInput, setSearchInput] = useState(q);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const res = await fetchCategories();
                setCategories(res.data || []);
            } catch {
                // Non-blocking if categories fail to load
            }
        };
        loadCategories();
    }, []);

    const updateParams = (changes, resetPage = true) => {
        const next = new URLSearchParams(searchParams);
        Object.entries(changes).forEach(([key, value]) => {
            if (!value || value === 'all') next.delete(key);
            else next.set(key, value);
        });
        if (resetPage) next.delete('page');
        setSearchParams(next);
    };

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchInput !== q) updateParams({ q: searchInput });
        }, 400);
        return () => clearTimeout(timer);
    }, [searchInput]);

    // Fetch filtered, sorted, paginated products from backend
    useEffect(() => {
        let cancelled = false;

        const loadProducts = async () => {
            setLoading(true);
            try {
                const res = await filterProducts({
                    params: {
                        q: q || undefined,
                        category: category || undefined,
                        status: status !== 'all' ? status : undefined,
                        sort,
                        page,
                        limit: PAGE_SIZE,
                    },
                });
                if (cancelled) return;
                setProducts(res.data.products || []);
                setTotalPages(res.data.totalPages ?? 1);
                setTotalProducts(res.data.totalProducts ?? res.data.products?.length ?? 0);
            } catch (err) {
                if (!cancelled) {
                    setMessage({
                        text: err?.response?.data?.message || 'Could not load products.',
                        severity: 'error',
                    });
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        loadProducts();
        return () => {
            cancelled = true;
        };
    }, [q, category, status, sort, page]);

    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;
        setIsDeleting(true);
        try {
            await deleteProduct(deleteTarget._id);
            setProducts((prev) => prev.filter((item) => item._id !== deleteTarget._id));
            setTotalProducts((prev) => Math.max(0, prev - 1));
            setMessage({
                text: `"${deleteTarget.name}" removed from catalog`,
                severity: 'success',
            });
            setDeleteTarget(null);
        } catch (err) {
            setMessage({
                text: err?.response?.data?.message || 'Failed to delete product',
                severity: 'error',
            });
        } finally {
            setIsDeleting(false);
        }
    };

    const hasActiveFilters = Boolean(q || category || status !== 'all');

    const handleClearFilters = () => {
        setSearchInput('');
        setSearchParams({});
    };

    const restoreProduct = async (product) => {
        try {
            await deleteProduct(product._id)
            setMessage({
                text: `You restored ${product.name}`,
                severity: 'success'
            })
        } catch (err) {
            setMessage({
                text: 'failed to restore project',
                severity: 'error'
            })
            console.log(err)
        }

    }
    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
            {/* ── Header Strip ── */}
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                spacing={2}
                sx={{ mb: 3 }}

            >
                <Box>
                    <Typography variant="h5" fontWeight={700} color="text.primary">
                        Products
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage inventory, pricing, and product availability ({totalProducts} total)
                    </Typography>
                </Box>

                <Button
                    component={RouterLink}
                    to="/admin/products/new"
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{
                        bgcolor: '#111827',
                        '&:hover': { bgcolor: '#1F2937' },
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 2.5,
                    }}
                >
                    Add Product
                </Button>
            </Stack>

            {/* ── Main Inventory Surface ── */}
            <Paper
                elevation={0}
                sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 3,
                    overflow: 'hidden',
                }}
            >
                {/* Status Tabs */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, bgcolor: '#FAFAFA' }}>
                    <Tabs
                        value={status}
                        onChange={(_, newValue) => updateParams({ status: newValue })}
                        variant="scrollable"
                        scrollButtons="auto"
                    >
                        {statusTabs.map((tab) => (
                            <Tab
                                key={tab.value}
                                value={tab.value}
                                label={tab.label}
                                sx={{ textTransform: 'none', fontWeight: 600 }}
                            />
                        ))}
                    </Tabs>
                </Box>

                {/* Horizontal Filter Toolbar */}
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={2}
                    sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}
                >
                    <TextField
                        placeholder="Search by product name or slug..."
                        size="small"
                        fullWidth
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    <FormControl size="small" sx={{ minWidth: 180 }}>
                        <InputLabel id="admin-category-label">Category</InputLabel>
                        <Select
                            labelId="admin-category-label"
                            label="Category"
                            value={category}
                            onChange={(e) => updateParams({ category: e.target.value })}
                        >
                            <MenuItem value="">All Categories</MenuItem>
                            {categories.map((cat) => (
                                <MenuItem key={cat} value={cat}>
                                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 190 }}>
                        <InputLabel id="admin-sort-label">Sort by</InputLabel>
                        <Select
                            labelId="admin-sort-label"
                            label="Sort by"
                            value={sort}
                            onChange={(e) => updateParams({ sort: e.target.value })}
                        >
                            {sortOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {hasActiveFilters && (
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={handleClearFilters}
                            sx={{ whiteSpace: 'nowrap', textTransform: 'none' }}
                        >
                            Reset
                        </Button>
                    )}
                </Stack>

                {/* Products Table */}
                <TableContainer>
                    <Table sx={{ minWidth: 700 }} aria-label="admin products table">
                        <TableHead sx={{ bgcolor: '#F9FAFB' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'text.secondary' }}>
                                    PRODUCT
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'text.secondary' }}>
                                    CATEGORY
                                </TableCell>
                                <TableCell
                                    align="right"
                                    sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'text.secondary' }}
                                >
                                    PRICE
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'text.secondary' }}>
                                    INVENTORY
                                </TableCell>
                                <TableCell
                                    align="right"
                                    sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'text.secondary' }}
                                >
                                    ACTIONS
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {loading ? (
                                Array.from({ length: PAGE_SIZE }).map((_, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <Stack direction="row" spacing={1.5} alignItems="center">
                                                <Skeleton variant="rounded" width={44} height={44} />
                                                <Box sx={{ width: 160 }}>
                                                    <Skeleton width="85%" />
                                                    <Skeleton width="55%" />
                                                </Box>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton width={80} />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Skeleton width={70} sx={{ ml: 'auto' }} />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton width={95} />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Skeleton width={72} sx={{ ml: 'auto' }} />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : products.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                            No matching products
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            Try adjusting your status tab, search query, or category filter.
                                        </Typography>
                                        {hasActiveFilters && (
                                            <Button variant="outlined" size="small" onClick={handleClearFilters}>
                                                Clear filters
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                products.map((product) => {
                                    const badge = getStockBadge(product.stock);
                                    return (
                                        <TableRow
                                            key={product._id}
                                            hover
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            {/* Product Thumbnail + Title/Slug */}
                                            <TableCell>
                                                <Stack direction="row" spacing={1.5} alignItems="center">
                                                    <Avatar
                                                        variant="rounded"
                                                        src={product.images?.[0]}
                                                        alt={product.name}
                                                        sx={{
                                                            width: 44,
                                                            height: 44,
                                                            bgcolor: '#F3F4F6',
                                                            color: 'text.secondary',
                                                            fontSize: '0.85rem',
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        {product.name?.[0]?.toUpperCase()}
                                                    </Avatar>
                                                    <Box sx={{ minWidth: 0 }}>
                                                        <Typography
                                                            variant="body2"
                                                            fontWeight={600}
                                                            noWrap
                                                            sx={{ maxWidth: 260 }}
                                                        >
                                                            {product.name}
                                                        </Typography>
                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                            noWrap
                                                            display="block"
                                                        >
                                                            /{product.slug}
                                                        </Typography>
                                                    </Box>
                                                </Stack>
                                            </TableCell>

                                            {/* Category Pill */}
                                            <TableCell>
                                                <Chip
                                                    label={product.category}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: '#F3F4F6',
                                                        fontWeight: 500,
                                                        textTransform: 'capitalize',
                                                    }}
                                                />
                                            </TableCell>

                                            {/* Formatted Price */}
                                            <TableCell align="right">
                                                <Typography variant="body2" fontWeight={700}>
                                                    {formatPrice(product.price)}
                                                </Typography>
                                            </TableCell>

                                            {/* Semantic Stock Badge */}
                                            <TableCell>
                                                <Chip
                                                    label={badge.label}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: badge.bgcolor,
                                                        color: badge.color,
                                                        fontWeight: 600,
                                                        fontSize: '0.75rem',
                                                    }}
                                                />
                                            </TableCell>

                                            {/* Edit & Delete Actions */}
                                            <TableCell align="right">
                                                <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                                                    <Tooltip title="Edit product">
                                                        <IconButton
                                                            component={RouterLink}
                                                            to={`/admin/products/${product.slug}/edit`}
                                                            size="small"
                                                            aria-label={`edit ${product.name}`}
                                                        >
                                                            <EditOutlinedIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>

                                                    {product.isActive ? (
                                                        <Tooltip title="Delete product">
                                                            <IconButton
                                                                size="small"
                                                                aria-label={`delete ${product.name}`}
                                                                onClick={() => setDeleteTarget(product)}
                                                                sx={{
                                                                    color: 'text.secondary',
                                                                    '&:hover': { color: 'error.main' },
                                                                }}
                                                            >
                                                                <DeleteIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>

                                                    ) : (
                                                        <Tooltip title="Restore product">
                                                            <IconButton
                                                                size="small"
                                                                aria-label={`restore ${product.name}`}
                                                                onClick={() => restoreProduct(product)}
                                                                sx={{
                                                                    color: 'text.secondary',
                                                                    '&:hover': { color: 'error.main' },
                                                                }}
                                                            >
                                                                {product.isActive ? <DeleteIcon fontSize="small" /> : <RestoreIcon />}
                                                            </IconButton>
                                                        </Tooltip>

                                                    )}
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Footer Pagination */}
                {!loading && totalPages > 1 && (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            px: 2.5,
                            py: 2,
                            borderTop: '1px solid',
                            borderColor: 'divider',
                            bgcolor: '#FAFAFA',
                        }}
                    >
                        <Typography variant="caption" color="text.secondary">
                            Page {page} of {totalPages}
                        </Typography>
                        <Pagination
                            count={totalPages}
                            page={page}
                            color="primary"
                            size="small"
                            onChange={(_, value) => {
                                updateParams({ page: value }, false);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                        />
                    </Box>
                )}
            </Paper>

            {/* ── Delete Confirmation Dialog ── */}
            <Dialog open={Boolean(deleteTarget)} onClose={() => !isDeleting && setDeleteTarget(null)}>
                <DialogTitle fontWeight={700}>Delete Product</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to remove <strong>{deleteTarget?.name}</strong> from the store catalog?
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setDeleteTarget(null)} disabled={isDeleting}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        color="error"
                        variant="contained"
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}