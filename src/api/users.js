import api from "./axios";


export const login = (form) => {
    return api.post('/login', form)
}