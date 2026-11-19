import api from "./axios";


export const fetchProducts = (specs = {}) => {
    // accept both fetchProducts({ q }) and fetchProducts({ params: { q } })
    const params = specs.params ?? specs
    return api.get('/products', { params })
}
export const fetchProduct = (slug) => {
    return api.get(`/products/${slug}`)
}
export const fetchCategories = () => api.get('/products/categories')
export const newProduct = (specs) => {
    return api.post('/products/new', { specs })
}
export const updateProduct = (productId, specs) => {
    return api.patch(`/update/${productId}`, { specs })
}

export const deleteProduct = (productId) => {
    return api.post(`/delete/${productId}`)
}