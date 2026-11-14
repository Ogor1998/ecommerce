const express = require('express')
const router = express.Router();
const { createProduct, updateProduct, softDeleteProduct } = require('../controllers/Products');
const { catchAsync } = require('../utils/catchAsync');
const { isAdmin } = require('../middleware/middleware')
const { isLoggedIn } = require('../middleware/auth')

router.post('/new', catchAsync(createProduct))
router.patch('/update/:id', catchAsync(updateProduct))
router.post('/delete/:id', catchAsync(softDeleteProduct))


module.exports = router