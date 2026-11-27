const express = require('express')
const router = express.Router({ mergeParams: true });
const { addTocart, deleteFromCart, userCart, updateQuantity } = require('../controllers/Carts');
const { catchAsync } = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware/auth');




router.get('/', isLoggedIn, catchAsync(userCart))
router.post('/:productId', isLoggedIn, catchAsync(addTocart))
router.patch('/:productId', isLoggedIn, catchAsync(updateQuantity))
router.delete('/:productId', isLoggedIn, catchAsync(deleteFromCart))



module.exports = router