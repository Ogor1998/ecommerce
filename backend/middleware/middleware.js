
const User = require('../models/User')
const { productSchema, userSchema } = require('../schemas')
const AppError = require('../utils/AppError')

module.exports.isAdmin = async (req, res) => {
    const user = await User.findById(req.user.userId)
    if (!user) {
        return res.status(404).json({
            message: 'User not found'
        })
    }
    if (user.role !== 'admin') {
        return res.status(403).json({
            message: 'You do not have permission to do that'
        })
    }
}


module.exports.validateProduct = async (req, res, next) => {
    const { error } = productSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new AppError(msg, 400)
    } else {
        next()
    }
}


module.exports.validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new AppError(msg, 400)
    } else {
        next();
    }
}

