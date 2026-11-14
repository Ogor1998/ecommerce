const express = require('express')
const router = express.Router();
const { login, register } = require('../controllers/Users')
const { isAdmin } = require('../middleware/middleware')
const { isLoggedIn } = require('../middleware/auth')
const { catchAsync } = require('../utils/catchAsync')



router.post('/login', catchAsync(login))
router.post('/register', catchAsync(register))
router.get('/admin', isLoggedIn, isAdmin, catchAsync(register))



module.exports = router;