export const formatPrice = (amount) =>
    new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'NGN', // Change to 'NGN' if pricing in Naira
    }).format(amount);