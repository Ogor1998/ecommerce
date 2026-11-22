const User = require('../models/User')
const Order = require('../models/Order')
const { uploadToCloudinary } = require('../cloudinary')


module.exports.findUser = async (req, res) => {
    const user = await User.findOne({ username: req.user.username }).select('-password')
    // const order = await Order.findOne({ user: req.user.userId }) || {}
    if (!user) {
        return res.status(404).json({
            message: 'user not found'
        })
    }

    // console.log(user)
    // if (!order) {
    //     res.status(401).json({
    //         message: 'Not orders yet'
    //     })
    // }
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
        { returnDocument: 'after' })

    if (!user) {
        return res.status(404).json({
            message: 'user not found'
        })
    }
    console.log(user)
    res.json(user)
}