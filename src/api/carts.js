import api from "./axios";



export const addCart = async (productIdid) => {
    return api.post(`$/cart/${productIdid}`)
}
export const getCart = async () => {
    return api.get('/cart')
}

export const deleteItemCart = async (productId) => {
    return api.delete(`/cart/${productId}`)
}
export const updateQuantity = async (productId) => {
    return api.patch(`/cart/${productId}`)
}

