const User = require('../models/User')
const bcrypt = require('bcrypt')
const { sendToken } = require('../utils/setAuthToken')



module.exports.register = async (req, res) => {
    const { firstname, lastname, username, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({
        firstname,
        lastname,
        username,
        email,
        password: hashedPassword,
        role
    })

    await user.save();

    sendToken(res, user)
    const { password: _pw, ...safeUser } = user.toObject();

    res.json({
        message: 'User Registered Successfully',
        isLoggedIn: true,
        user: safeUser
    })
}


module.exports.login = async (req, res) => {
    // let triesCount
    const { username, password } = req.body;
    const user = await User.findOne({ username })
    if (!user) {
        return res.status(404).json({
            message: 'User not found',
            isLoggedIn: false
        })
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        return res.status(401).json({
            message: 'Invalid Credentials',
            isLoggedIn: false,
        })
    }
    console.log('this is user', user)
    sendToken(res, user)

    res.json({
        message: 'Logged in successfully',
        isLoggedIn: true,
        user: {
            _id: user._id,
            username: user.username
        }
    })
}

