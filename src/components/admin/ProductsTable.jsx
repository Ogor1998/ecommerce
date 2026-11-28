import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';
import { filterProducts } from '../../api/products';
import { useNotification } from '../../context/NotificationContext';
import { Box, Divider, Pagination } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { Avatar, Stack, Typography } from '@mui/material';

export default function ProductsTable({ status }) {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [totalPages, setTotalPages] = useState(1)
    const [searchParams, setSearchParams] = useSearchParams()
    const page = Number(searchParams.get('page')) || 1
    const { setMessage } = useNotification()
    const PAGE_SIZE = 6
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const res = await filterProducts(
                    {
                        params: {
                            page,
                            limit: PAGE_SIZE,
                            status: status && status !== 'all' ? status : undefined,
                        },
                    }
                )
                setProducts(res.data.products)
                setTotalPages(res.data.totalPages ?? 1)

            } catch (err) {
                setMessage({
                    text: err?.response?.data?.message,
                    severity: 'error'
                })
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [page, status])
    console.log('this is status', status)

    const updateParams = (changes, resetPage = true) => {
        const next = new URLSearchParams(searchParams)
        Object.entries(changes).forEach(([key, value]) => {
            if (value === '' || value === null || value === undefined) next.delete(key)
            else next.set(key, value)
        })
        if (resetPage) next.delete('page')
        setSearchParams(next)
    }

    return (
        <TableContainer component={Paper} sx={{ py: 2 }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead sx={{ backgroundColor: '#F9FAFB' }}>
                    <TableRow>
                        <TableCell sx={{ fontWeight: '400', fontSize: '12px' }}>PRODUCT</TableCell>
                        <TableCell align="right" sx={{ fontWeight: '400', fontSize: '12px' }}>CATEGORY</TableCell>
                        <TableCell align="right" sx={{ fontWeight: '400', fontSize: '12px' }}>PRICE</TableCell>
                        <TableCell align="right" sx={{ fontWeight: '400', fontSize: '12px' }}>STOCK</TableCell>
                        {/* <TableCell align="right">Protein&nbsp;(g)</TableCell> */}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {products.map((product) => (
                        <TableRow
                            key={product._id}
                            sx={{
                                '& td, & th': { borderBottom: '1px solid rgba(224, 224, 224, 1)' },
                                '&:last-child td, &:last-child th': { border: 0 }
                            }}
                        >
                            <TableCell component="th" scope="row">
                                <Stack direction="row" sx={{ display: 'flex', alignItems: 'center' }} spacing={2}>
                                    <Avatar
                                        src={product.images?.[0]}
                                        alt={product.name}
                                        variant="rounded" // Optional: 'rounded' or 'square' often looks better for products
                                    />
                                    <Typography variant="body2" noWrap>
                                        {product.name}
                                    </Typography>
                                </Stack>
                            </TableCell>
                            <TableCell align="right">{product.category}</TableCell>
                            <TableCell align="right" sx={{ fontWeight: '700' }}>{product.price}</TableCell>
                            <TableCell align="right" sx={{ color: product.stock === 0 ? 'error.main' : 'inherit' }}>{product.stock} left
                                {product.stock < 10 && <span style={{
                                    color: '#B45309',
                                    backgroundColor: '#FEF3C7',
                                    borderRadius: '25px',
                                    fontSize: '11px',
                                    padding: '0px 2px',
                                    marginLeft: '5px'

                                }}>{product.stock < 10 ? 'low stock' : ''}</span>}
                            </TableCell>

                        </TableRow>

                    ))}

                </TableBody>
            </Table>
            {!loading && totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        color="primary"
                        onChange={(e, value) => {
                            updateParams({ page: value }, false)
                            // window.scrollTo({ top: 0, behavior: 'smooth' })
                        }}
                    />
                </Box>
            )}
        </TableContainer>
    );
}
