import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNotification } from '../context/NotificationContext'
import { fetchProducts } from '../api/products'

const Home = () => {
    const [products, setProducts] = useState([])
    const { setMessage } = useNotification()
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetchProducts();
                console.log(res.data.message)
                setProducts(res.data.products)
            } catch (err) {
                setMessage({
                    message: err?.response?.data.message,
                    severity: 'error'
                })
            }
        }
        fetchData();
    }, [])
    return (
        <ul>
            {products.map(item => {
                return <li>{item.name}</li>
            })}
        </ul>

    )
}

export default Home