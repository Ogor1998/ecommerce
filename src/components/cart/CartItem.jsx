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
    const { setMessage } = useNotification()
    const { deleteFromCart, setCart, increment, decrement, getProductQuantity } = useCart();

    const productId = newItem.product._id || newItem.product

    const count = getProductQuantity(productId)




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
                    <Box sx={{ marginRight: 'auto', gap: '5px', display: 'flex', alignItems: 'center' }}>
                        <IconButton sx={{ border: '0.4px solid #000', p: 0.2, borderRadius: '8px' }} onClick={() => increment(productId)}><AddIcon /></IconButton>
                        {/* <input min="1" type='number' onBlur={handleBlur} onChange={handleChange} value={count} className='input__field' />
                         */}
                        <span>{newItem.quantity}</span>
                        <IconButton sx={{ border: '0.4px solid #000', p: 0.2, borderRadius: '8px' }} onClick={() => decrement(productId)}
                        ><RemoveIcon /></IconButton>
                    </Box>
                    <IconButton onClick={() => deleteFromCart(newItem.product._id)} sx={{ fontSize: '0.7rem', fontWeight: 700 }}><DeleteIcon /></IconButton>
                </Box>
            </Box>
        </Box>
    )
}

export default CartItem