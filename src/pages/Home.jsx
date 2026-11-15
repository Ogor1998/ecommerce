import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNotification } from '../context/NotificationContext'

const Home = () => {
    const [products, setProducts] = useState([])
    const { setMessage } = useNotification()
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('/products');
                console.log(res.data)
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