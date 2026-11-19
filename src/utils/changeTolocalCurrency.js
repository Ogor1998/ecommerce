export const changeTolocalCurrency = (value = Number) => {
    return value.toLocaleString('en-NG', {
        style: 'currency',
        currency: 'NGN',
    })
}