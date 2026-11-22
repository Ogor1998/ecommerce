const User = require('../models/User')
const Order = require('../models/Order')
const { uploadToCloudinary } = require('../cloudinary')


module.exports.findUser = async (req, res) => {
    const user = await User.findOne({ username: req.user.username }).select('-password').populate('firstname', 'image', 'description')
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
    const { firstname, lastname, email, shippingAddress } = req.body;
    const updateData = { firstname, lastname, email, shippingAddress }
    const user = await User.findOneAndUpdate({ username: req.user.username },
        { updateData },
        { returnDocument: 'after' })

    if (req.file) {
        const result = await uploadToCloudinary(req.file.buffer)
        updateData.image = result.secure_url
    }
    if (!user) {
        return res.status(404).json({
            message: 'user not found'
        })
    }
    res.json(user)
}