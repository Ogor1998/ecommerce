const express = require('express')
const router = express.Router();
const { login, register } = require('../controllers/Users')
const { catchAsync } = require('../utils/catchAsync')


router.post('/login', catchAsync(login))
router.post('/register', catchAsync(register))



module.exports = router;