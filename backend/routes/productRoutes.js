const express = require('express')
const router = express.Router();
const { createProduct, updateProduct, softDeleteProduct, allProducts, allCategories, findProduct, filterProducts } = require('../controllers/Products');
const { catchAsync } = require('../utils/catchAsync');
const { isAdmin, validateProduct } = require('../middleware/middleware')
const { isLoggedIn } = require('../middleware/auth')
const { upload } = require('../cloudinary')


const newPage = async (req, res) => {
    return res.json({
        message: 'This works'
    })
}
router.get('/', catchAsync(allProducts))
router.get('/filter', catchAsync(filterProducts))
router.get('/categories', catchAsync(allCategories))
router.get('/shop', catchAsync(allProducts))
router.get('/:slug', catchAsync(findProduct))
router.post('/new', upload.array('images', 10), validateProduct, catchAsync(createProduct))
router.patch('/update/:id', catchAsync(updateProduct))
router.post('/delete/:id', catchAsync(softDeleteProduct))


module.exports = router