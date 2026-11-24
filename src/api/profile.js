import api from "./axios";



export const getUserProfile = () => {
    return api.get(`/profile`)
}

export const updateUserProfile = (form) => {
    return api.put(`/profile`, form)
}