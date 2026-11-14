const Joi = require('joi')



module.exports.productSchema = Joi.object({
    name: Joi.string().required(),
    slug: Joi.string().required(),
    description: Joi.string(),
    price: Joi.number(),
    category: Joi.string(),
    stock: Joi.number()
})



module.exports.userSchema = Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().min(3).required(),
    password: Joi.string().required(),
    firstname: Joi.string(),
    lastname: Joi.string()
})
