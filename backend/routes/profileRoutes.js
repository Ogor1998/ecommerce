const express = require('express')
const router = express.Router({ mergeParams: true });
const { updateUser, findUser } = require('../controllers/Profiles');
const { catchAsync } = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware/auth');
const { upload } = require('../cloudinary')



router.get('/', isLoggedIn, catchAsync(findUser))
router.put('/', isLoggedIn, upload.single('image'), catchAsync(updateUser))



module.exports = router