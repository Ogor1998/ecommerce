const Product = require('../models/Product')
const { uploadToCloudinary } = require('../cloudinary')

const SORTS = {
    '-createdAt': { createdAt: -1 },
    'price': { price: 1 },
    '-price': { price: -1 },
    'name': { name: 1 },
}

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

module.exports.allProducts = async (req, res) => {
    const page = Math.max(Number(req.query.page) || 1, 1)
    const limit = Math.min(Number(req.query.limit) || 12, 50)   // cap it
    const skip = (page - 1) * limit

    const { q, category, minPrice, maxPrice } = req.query
    const sort = SORTS[req.query.sort] || SORTS['-createdAt']


    const filter = { isActive: true }
    if (q) filter.name = { $regex: escapeRegex(String(q)), $options: 'i' }
    if (category) filter.category = String(category)
    if (minPrice || maxPrice) {
        filter.price = {}
        if (minPrice) filter.price.$gte = Number(minPrice)
        if (maxPrice) filter.price.$lte = Number(maxPrice)
    }
    const [products, total] = await Promise.all([
        Product.find(filter).sort({ ...sort, _id: -1 }).skip(skip).limit(limit).lean(),
        Product.countDocuments(filter),
    ])

    res.json({
        products,
        total,
        totalPages: Math.ceil(total / limit),
        pagination: { hasMore: skip + products.length < total },
    })
}


module.exports.findProduct = async (req, res) => {
    const { slug } = req.params;
    const product = await Product.findOne({ slug: slug }).populate('name slug price images stock isActive');
    if (!product) {
        return res.status(404).json({
            message: 'Product not found'
        })
    }

    res.json(product)
}

module.exports.allCategories = async (req, res) => {
    const categories = await Product.distinct('category', { isActive: true })
    console.log('this is categories', categories)
    res.json(categories.sort())
}


module.exports.createProduct = async (req, res) => {
    const { name, slug, category, price, description, stock, isActive } = req.body;
    const product = new Product({
        name,
        slug,
        category,
        price,
        description,
        stock,
        isActive
    })

    if (req.files && req.files.length > 0) {

        const imageUrls = await Promise.all(
            req.files.map(async (file) => {
                const result = await uploadToCloudinary(file.buffer);
                return result.secure_url;
            })
        );

        product.images = imageUrls;
    }
    await product.save();
    console.log('this is the new product', product)
    res.json({
        messsage: 'Product added successfully',
        product
    })
}

module.exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const updateProd = { ...req.body };
    const product = await Product.findByIdAndUpdate(id, { updateProd }, {
        returnDocument: 'after',
        runValidators: true
    });
    if (!product) {
        return res.status(404).json({
            message: 'Product not found'
        })
    }

    res.json({
        message: 'Product updated successfully',
        updateProd
    })
}

module.exports.softDeleteProduct = async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    product.isActive = !product.isActive
    await product.save()

    res.json({
        message: 'Product temporary deleted',
        product
    })
}