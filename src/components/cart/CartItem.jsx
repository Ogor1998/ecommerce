import React, { useState } from 'react'
import { Box, Button, Icon, IconButton, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import './CartItem.css';
import { updateQuantity } from '../../api/carts';
import { useNotification } from '../../context/NotificationContext';
import { changeTolocalCurrency } from '../../utils/changeTolocalCurrency';
import { useCart } from '../../context/CartContext';




const CartItem = ({ newItem = {} }) => {
    // const [count, setCount] = useState(newItem.quantity)
    const { setMessage } = useNotification()
    const { deleteFromCart, setCart, count, setCount } = useCart();
    const increment = async () => {
        const current = Number(count) || 0;
        const nextCount = current + 1;
        setCount(nextCount);
        try {
            const res = await updateQuantity(newItem.product._id, nextCount);
            setCart(res.data.updatedCart.items)
        } catch (err) {
            setCount(previousCount);
            console.log('failed to update quantity', err)
        }
    }

    const decrement = async () => {
        const current = Number(count) || 1;
        if (current <= 1) return
        const nextCount = current - 1;
        setCount(nextCount)
        try {
            await updateQuantity(newItem.product._id, nextCount);
        } catch (err) {
            setCount(previousCount);
            console.log('failed to update quantity', err)
        }
    }


    const handleChange = (e) => {
        setCount(e.target.value)

        if (rawValue === '') {
            setCount('');
            return;
        }
        const parsed = parseInt(rawValue, 10);
        if (!Number.isNaN(parsed) && parsed >= 1) {
            setCount(parsed);
        }
    }

    const handleBlur = async () => {
        const validCount = Number(count) >= 1 ? Number(count) : newItem.quantity;
        setCount(validCount);

        if (validCount !== newItem.quantity) {
            await updateQuantity(newItem.product._id, validCount);
        }
    };



    const updatePrice = (price, count) => {
        let currentPrice = price
        if (increment) {
            currentPrice = currentPrice * count
        } else {
            currentPrice = currentPrice - price
        }
        return currentPrice
    }

    return (
        <Box sx={{
            // height: '100%',
            // width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '10px',
            border: '0.6px solid #000',
            px: 1,
            py: 0.2,
            borderRadius: '15px'
        }}>
            <img src={newItem?.product?.images[0]} style={{ height: '90px', width: '90px', borderRadius: '10px' }} />
            <Box sx={{ minWidth: '300px' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: '10px', p: 1 }}>
                    <Typography variant="h4" sx={{ fontSize: '0.9rem' }}>
                        {newItem.product.name}
                    </Typography>

                    <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h5" sx={{ fontSize: '1.05rem' }}>
                            {changeTolocalCurrency(updatePrice(newItem.product.price, count))}
                        </Typography>
                        <Typography variant="h5" sx={{ fontSize: '0.8rem', fontWeight: 300 }}>
                            {changeTolocalCurrency(newItem.product.price)} each
                        </Typography>

                    </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', }}>
                    <Box sx={{ marginRight: 'auto', gap: '5px', display: 'flex' }}>
                        <IconButton sx={{ border: '0.4px solid #000', p: 0.2, borderRadius: '8px' }} onClick={increment}><AddIcon /></IconButton>
                        <input min="1" type='number' onBlur={handleBlur} onChange={handleChange} value={count} className='input__field' />
                        <IconButton sx={{ border: '0.4px solid #000', p: 0.2, borderRadius: '8px' }} disabled={count <= 0 ? true : false} onClick={decrement}
                        ><RemoveIcon /></IconButton>
                    </Box>
                    <IconButton onClick={() => deleteFromCart(newItem.product._id)} sx={{ fontSize: '0.7rem', fontWeight: 700 }}><DeleteIcon /></IconButton>
                </Box>
            </Box>
        </Box>
    )
}

export default CartItem