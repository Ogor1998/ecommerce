import api from "./axios";



export const addCart = async (productId) => {
    return api.post(`/cart/${productId}`)
}
export const getCart = async () => {
    return api.get('/cart')
}

export const deleteItemCart = async (productId) => {
    return api.delete(`/cart/${productId}`)
}
export const updateQuantity = async (productId, quantity) => {
    return api.patch(`/cart/${productId}`, { quantity })
}

