import React from 'react'
import { createContext, useContext, useState, useEffect } from 'react'
import { useNotification } from './NotificationContext';
import { useNavigate } from 'react-router-dom';
import { getCart, deleteItemCart, updateQuantity, addCart } from '../api/carts';


const CartContext = createContext()



export function CartProvider({ children }) {
    const { setMessage } = useNotification();
    const [cart, setCart] = useState([])
    const [loading, setLoading] = useState(false)
    // const productItem = cart.flatMap(item => item.map(c => c.quantity))
    const productQuantity = cart.flatMap(item => item.quantity)
    const [count, setCount] = useState(productQuantity)
    console.log('this is qunatity count', count)


    useEffect(() => {
        const fetchCart = async () => {
            setLoading(true)
            try {
                const res = await getCart();
                setCart(res.data.items)
            } catch (err) {
                setMessage({
                    text: err?.response?.data.message,
                    severity: 'error'
                })
            } finally {
                setLoading(false)
            }
        }
        fetchCart();

    }, [])

    // console.log('this is productItem', productItem)

    const deleteFromCart = async (id) => {
        try {
            const res = await deleteItemCart(id);
            setCart((prev) =>
                prev.filter((item =>
                    (item.product._id || item.product) !== id))
            )
            setMessage({
                text: res.data?.message,
                severity: 'error'
            })
        } catch (err) {
            setMessage({
                text: 'Failed to delete',
                severity: 'error'
            })
        }
    }

    const addToCart = async (id) => {
        try {
            const res = await addCart(id)
            setCart(res.data.cart.items)
            setMessage({
                text: res.data?.message,
                severity: 'error'
            })
        } catch (err) {
            setMessage({
                text: 'Failed to add to cart',
                severity: 'error'
            })
        }
    }


    return (
        <CartContext.Provider value={{
            loading,
            cart,
            deleteFromCart,
            addToCart,
            setCart,
            count,
            setCount

        }}>
            {children}
        </CartContext.Provider>
    )
}


export function useCart() {
    return useContext(CartContext);
}
