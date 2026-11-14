if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express')
const app = express();
const port = process.env.PORT
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const userRoutes = require('./routes/userRoutes');
const AppError = require('./utils/AppError');
const { isLoggedIn } = require('./middleware/auth');
const catchAsync = require('./utils/catchAsync');
const User = require('./models/User');




mongoose.connect(process.env.DB_URL).then(() => {
    console.log(`Mongo connection active `)
}).catch((err) => {
    console.log(`Mongo failed because`, err)
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(cookieParser());

app.use('/', userRoutes)


app.get('/check-auth', isLoggedIn, catchAsync(async (req, res) => {
    const user = await User.findById(req.user.userId).select('-password')
    res.json({
        isLoggedIn: true,
        user
    })
}))

app.all(/(.*)/, (req, res, next) => {
    next(new AppError('Page not found', 404))
})


app.post('/logout', async (req, res) => {
    res.clearCookie('token')
    res.json({
        message: 'Logged Out'
    })
})




app.listen(port, () => {
    console.log(`Server running on ${port}`)
})