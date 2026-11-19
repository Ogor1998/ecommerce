import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';
import { getCart } from '../../api/carts';
import CartItem from './CartItem';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { formatPrice } from '../../utils/formatPrice';

import { useCart } from '../../context/CartContext';
const Cart = ({ showCart, handleCartClose }) => {
    const { cart, setCart } = useCart()
    // Fetch each time the drawer opens, so items added since last time show up
    React.useEffect(() => {
        if (!showCart) return
        const fetchData = async () => {
            try {
                const res = await getCart()
                setCart(res.data?.items || [])
                console.log('this is cart items', res.data?.items)
            } catch (err) {
                console.log(err)
            }
        }
        fetchData()
    }, [showCart, setCart])


    const total = cart?.reduce((sum, item) => {
        const price = item.product?.price || 0;
        const quantity = item.quantity || 0;
        return sum + price * quantity;
    }, 0);
    // const items = cart?.flatMap(c => c.items) ?? []

    return (
        <Drawer
            anchor="right"
            open={showCart}
            onClose={handleCartClose}
            slotProps={{
                paper: {
                    sx: { width: { xs: '100%', sm: 470 }, display: 'flex', flexDirection: 'column' },
                },
            }}
        >
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
                <Typography variant="h6" fontWeight={700}>
                    Your cart {cart.length > 0 && `(${cart.length})`}
                </Typography>
                <IconButton onClick={handleCartClose} aria-label="close cart">
                    <CloseIcon />
                </IconButton>
            </Box>
            <Divider />

            {/* Items: this area scrolls, the header and footer stay put */}
            <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2, gap: '10px', display: 'flex', flexDirection: 'column' }}>
                {cart.length === 0 ? (
                    <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 6 }}>
                        Your cart is empty
                    </Typography>
                ) : (

                    cart.filter((item) => item?.product)
                        .map((item) => (
                            <CartItem key={item.product._id} newItem={item} />
                        ))

                )}
            </Box>

            {/* Footer */}
            {cart.length > 0 && (
                <>
                    <Divider />
                    <Box sx={{ p: 2 }}>
                        <Typography fontWeight={500} sx={{ mb: 1, fontSize: '1.5rem' }}>Order Summary</Typography>

                        {cart.filter((item) => item?.product)
                            .map((item) => (
                                // <CartItem key={item.product._id} newItem={item} />
                                <Typography fontWeight={700} sx={{ mb: 1, fontSize: '0.9rem', color: '#6c757d' }}>{item.product.name} {`x ${item.quantity}`}</Typography>
                            ))
                        }
                        <Typography fontWeight={700} sx={{ mb: 1 }}>Total: {formatPrice(total)}</Typography>
                        <Button variant="contained" fullWidth size="large">
                            <ShoppingCartIcon />    Proceed to checkout
                        </Button>
                    </Box>
                </>
            )}
        </Drawer>
    )
}

export default Cart