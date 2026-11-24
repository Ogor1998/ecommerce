const User = require('../models/User');

module.exports.addAddress = async (req, res) => {
    const { title, lineOne, lineTwo, city, state, main } = req.body;
    const user = await User.findOne({ username: req.user.username });
    if (!user) {
        return res.status(404).json({
            message: 'User not found'
        })
    }
    if (user.shippingAddress.length >= 2) {
        return res.status(403).json({
            message: 'You already have two addresses. Delete one before adding a new one'
        })
    }
    const isFirstAddress = user.shippingAddress.length === 0;
    const isMain = isFirstAddress ? true : Boolean(main);
    if (isMain && !isFirstAddress) {
        user.shippingAddress.forEach((addr) => {
            addr.main = false;
        });
    }

    const newAddress = { title, lineOne, lineTwo, city, state, main: isMain }


    user.shippingAddress.push(newAddress)
    await user.save();
    console.log(user)

    res.json({
        message: 'You added a new shipping address',
        shippingAddress: user.shippingAddress
    })


}

module.exports.deleteAddress = async (req, res) => {
    const { addressId } = req.params;
    const updateUser = await User.findOneAndUpdate({ username: req.user.username },
        { $pull: { shippingAddress: { _id: addressId } } },
        { returnDocument: 'after' })
    if (!updateUser) {
        return res.status(404).json({
            message: 'User not found'
        })
    }

    res.json({
        message: 'You deleted this address',
        updateUser
    })

}