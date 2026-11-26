const express = require('express');
const { isLoggedIn } = require('../middleware/auth');
const router = express.Router({ mergeParams: true });
const { addAddress, deleteAddress, defaultAddress } = require('../controllers/Addresses');
const { catchAsync } = require('../utils/catchAsync');


router.post('/', isLoggedIn, catchAsync(addAddress))
router.delete('/:addressId', isLoggedIn, catchAsync(deleteAddress))
router.patch('/:addressId', isLoggedIn, catchAsync(defaultAddress))
// router.post('/addresses', isLoggedIn, catchAsync(addAddress))



module.exports = router