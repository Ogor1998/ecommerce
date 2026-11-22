const express = require('express')
const router = express.Router({ mergeParams: true });
const { updateUser, findUser } = require('../controllers/Profiles');
const { catchAsync } = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware/auth');



router.get('/:username', isLoggedIn, catchAsync(findUser))
router.patch('/edit', catchAsync(updateUser))



module.exports = router