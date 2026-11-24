import api from "./axios";



export const addUserAddress = (form) => {
    return api.post('/addresses', { form })
}
export const deleteUserAddress = (id) => {
    return api.delete(`/addresses/${id}`)
}