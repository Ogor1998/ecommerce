import api from "./axios";



export const getUserProfile = (username) => {
    return api.get(`/profile/${username}`)
}

export const updateUserProfile = (username, specs) => {
    return api.patch(`/profile/${username}/edit`, { specs })
}