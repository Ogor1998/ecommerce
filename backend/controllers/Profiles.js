const User = require('../models/User')
const Order = require('../models/Order')
const { uploadToCloudinary } = require('../cloudinary')


module.exports.findUser = async (req, res) => {
    const user = await User.findOne({ username: req.user.username }).select('-password')
    if (!user) {
        return res.status(404).json({
            message: 'user not found'
        })
    }
    // console.log('gets here')
    res.json(user)
}

module.exports.updateUser = async (req, res) => {
    console.log(req.body)
    const { firstname, lastname, email, shippingAddress, description } = req.body;
    const updateData = { firstname, lastname, email, shippingAddress, description }
    if (req.file) {
        const result = await uploadToCloudinary(req.file.buffer)
        updateData.image = result.secure_url
    }
    const user = await User.findOneAndUpdate({ username: req.user.username },
        { $set: updateData },
        { returnDocument: 'after', runValidators: true }).select('-password')

    if (!user) {
        return res.status(404).json({
            message: 'user not found'
        })
    }
    console.log(user)
    res.json(user)
}