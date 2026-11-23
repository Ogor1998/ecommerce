import api from "./axios";



export const getUserProfile = (username) => {
    return api.get(`/profile/${username}`)
}

export const updateUserProfile = (form) => {
    return api.put(`/profile`, form)
}