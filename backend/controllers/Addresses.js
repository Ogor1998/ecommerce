const User = require('../models/User');

module.exports.addAddress = async (req, res) => {
    const { title, lineOne, lineTwo, city, state, main } = req.body;
    console.log(req.body)
    const user = await User.findOne({ username: req.user.username }).select("-password");
    if (!user) {
        return res.status(404).json({
            message: 'User not found'
        })
    }
    // if (user.shippingAddress.length >= 2) {
    //     return res.status(403).json({
    //         message: 'You already have two addresses. Delete one before adding a new one'
    //     })
    // }
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
    console.log(updateUser)
    res.json({
        message: 'You deleted this address',
        shippingAddress: updateUser.shippingAddress
    })

}


module.exports.defaultAddress = async (req, res) => {
    const { addressId } = req.params;
    console.log('this is addressId', addressId)
    // const updateUser = await User.findOneAndUpdate({ username: req.user.username },
    //     { $in: { shippingAddress: { _id: addressId, main: !main } } },
    //     { returnDocument: 'after' })
    const user = await User.findOne({ username: req.user.username })
    if (!user) {
        return res.status(404).json({
            message: 'User not found'
        })
    }

    const targetAddress = user.shippingAddress.id(addressId)
    if (!targetAddress) {
        return res.status(404).json({ message: 'Address not found' });
    }
    user.shippingAddress.forEach(address => {
        address.main = address._id.toString() === addressId
    })
    await user.save()
    res.json({
        message: 'Default address updated',
        user
    })
}