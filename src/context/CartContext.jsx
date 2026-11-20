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

    const [showCart, setShowCart] = useState(false)
    const handleCartOpen = () => setShowCart(true)
    const handleCartClose = () => setShowCart(false)


    const addToCart = async (id) => {
        try {
            const res = await addCart(id)
            setCart(res.data.cart.items || [])
            setMessage({
                text: res.data?.message,
                severity: 'success'
            })
            handleCartOpen()
        } catch (err) {
            setMessage({
                text: 'Failed to add to cart',
                severity: 'error'
            })
        }
    }


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


    const getProductQuantity = (productId) => {
        const item = cart.find((item) => (item.product._id || item.product) === productId)
        return item ? item.quantity : 0
    }

    // 2. Increment using `cart` as the single source of truth
    const increment = async (productId) => {
        const currentQty = getProductQuantity(productId);

        // If product isn't in cart yet (e.g., clicking + on ProductDetail), add it
        if (currentQty === 0) {
            return addToCart(productId);
        }

        const nextQty = currentQty + 1;
        let snapshot = [];

        setCart((prev) => {
            snapshot = prev;
            return prev.map((item) =>
                (item.product?._id || item.product) === productId
                    ? { ...item, quantity: nextQty }
                    : item
            );
        });

        try {
            const res = await updateQuantity(productId, nextQty);
            if (res.data?.updatedCart?.items) {
                setCart(res.data.updatedCart.items.filter((i) => i?.product));
            }
        } catch (err) {
            setCart(snapshot);
            console.error('Failed to increment:', err);
        }
    };

    // 3. Decrement using `cart` as the single source of truth
    const decrement = async (productId) => {
        const currentQty = getProductQuantity(productId);
        if (currentQty <= 0) return;

        // If quantity is 1, decrementing removes it from cart
        if (currentQty === 1) {
            return deleteFromCart(productId);
        }

        const nextQty = currentQty - 1;
        let snapshot = [];

        setCart((prev) => {
            snapshot = prev;
            return prev.map((item) =>
                (item.product?._id || item.product) === productId
                    ? { ...item, quantity: nextQty }
                    : item
            );
        });

        try {
            const res = await updateQuantity(productId, nextQty);
            if (res.data?.updatedCart?.items) {
                setCart(res.data.updatedCart.items.filter((i) => i?.product));
            }
        } catch (err) {
            setCart(snapshot);
            console.error('Failed to decrement:', err);
        }
    };

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



    return (
        <CartContext.Provider value={{
            loading,
            cart,
            deleteFromCart,
            addToCart,
            setCart,
            increment,
            decrement,
            getProductQuantity,
            handleCartOpen,
            handleCartClose,
            showCart

        }}>
            {children}
        </CartContext.Provider>
    )
}


export function useCart() {
    return useContext(CartContext);
}
