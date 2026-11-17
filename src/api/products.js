import api from "./axios";


export const fetchProducts = () => {
    return api.get('/products')
}
export const newProduct = ({ specs }) => {
    return api.post('/products/new', { specs })
}
export const updateProduct = (productId, { specs }) => {
    return api.patch(`/update/${productId}`, { specs })
}

export const deleteProduct = (productId) => {
    return api.post(`/delete/${productId}`)
}