require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product'); // Adjust path if needed


const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce';

const categories = [
    {
        name: 'Electronics',
        adjectives: ['Pro', 'Ultra', 'Wireless', 'Smart', 'Compact', 'Studio', '4K', 'Portable', 'Nano', 'Max'],
        items: ['Mechanical Keyboard', 'Noise-Cancelling Headphones', 'USB-C Hub', '4K Webcam', 'Portable SSD', 'GaN Charger', 'Bluetooth Speaker', 'Gaming Mouse', 'Monitor Light Bar', 'Smartwatch'],
        priceRange: [29, 349],
        imageKeyword: 'electronics,gadget',
    },
    {
        name: 'Apparel',
        adjectives: ['Heavyweight', 'Essential', 'Relaxed', 'Organic Cotton', 'Tailored', 'Classic', 'Everyday', 'Vintage Wash', 'Lightweight', 'Oversized'],
        items: ['Hoodie', 'Crewneck Sweatshirt', 'Oxford Shirt', 'Chino Trousers', 'Graphic Tee', 'Denim Jacket', 'Cargo Pants', 'Merino Sweater', 'Linen Shirt', 'Track Jacket'],
        priceRange: [24, 145],
        imageKeyword: 'fashion,clothing',
    },
    {
        name: 'Footwear',
        adjectives: ['Runner', 'Court', 'Trail', 'Retro', 'Knit', 'Leather', 'Cloud', 'Street', 'Velocity', 'Aero'],
        items: ['Low-Top Sneakers', 'Running Shoes', 'Chelsea Boots', 'Slip-On Loafers', 'Cross-Trainers', 'High-Top Trainers', 'Canvas Shoes', 'Hiking Boots', 'Slides', 'Derby Shoes'],
        priceRange: [45, 220],
        imageKeyword: 'sneakers,shoes',
    },
    {
        name: 'Home & Living',
        adjectives: ['Minimalist', 'Ceramic', 'Nordic', 'Handcrafted', 'Matte', 'Bamboo', 'Aroma', 'Woven', 'Linen', 'Walnut'],
        items: ['Desk Lamp', 'Pour-Over Coffee Maker', 'Throw Blanket', 'Diffuser', 'Wall Clock', 'Storage Basket', 'Planter Pot', 'Insulated Tumbler', 'Table Mirror', 'Candle Set'],
        priceRange: [18, 160],
        imageKeyword: 'minimalist,home,decor',
    },
    {
        name: 'Accessories',
        adjectives: ['Everyday', 'RFID-Blocking', 'Waterproof', 'Ballistic Nylon', 'Full-Grain Leather', 'Modular', 'Slim', 'Travel', 'Polarized', 'Titanium'],
        items: ['Crossbody Bag', 'Laptop Backpack', 'Bifold Wallet', 'Sunglasses', 'Tech Pouch', 'Weekender Duffel', 'Key Organizer', 'Watch Strap', 'Cap', 'Tote Bag'],
        priceRange: [19, 189],
        imageKeyword: 'backpack,watch,accessories',
    },
];

const brands = ['Kova', 'Velo', 'Norr', 'Aether', 'Sola', 'Marrow', 'Loom', 'Tact'];
const colors = ['Obsidian Black', 'Slate Grey', 'Sandstone', 'Forest Green', 'Navy', 'Chalk White', 'Terracotta', 'Cobalt'];

function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
}

function generateProducts(count = 200) {
    const products = [];

    for (let i = 0; i < count; i++) {
        const cat = categories[i % categories.length];
        const adj = cat.adjectives[i % cat.adjectives.length];
        const item = cat.items[Math.floor(i / categories.length) % cat.items.length];
        const brand = brands[(i * 3) % brands.length];
        const color = colors[(i * 5) % colors.length];

        const name = `${brand} ${adj} ${item} - ${color}`;
        const slug = `${slugify(name)}-${i + 1}`;

        const [minPrice, maxPrice] = cat.priceRange;
        const rawPrice = minPrice + ((i * 17) % (maxPrice - minPrice));
        const price = Number(`${rawPrice}.99`);

        // Leave ~5% of products out of stock (0) so you can test out-of-stock UI states
        const stock = i % 20 === 0 ? 0 : ((i * 7) % 65) + 3;

        products.push({
            name,
            slug,
            description: `Engineered for daily durability and clean aesthetics, the ${name} combines premium materials with modern functionality in the ${cat.name} collection.`,
            price,
            category: cat.name,
            images: [
                `https://picsum.photos/seed/${slug}-1/800/800`,
                `https://picsum.photos/seed/${slug}-2/800/800`,
                `https://picsum.photos/seed/${slug}-3/800/800`,
            ],
            stock,
            isActive: true,
        });
    }

    return products;
}

async function seedDB() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        await Product.deleteMany({});
        console.log('Cleared existing products');

        const products = generateProducts(200);
        await Product.insertMany(products);
        console.log(`Successfully seeded ${products.length} products!`);
    } catch (err) {
        console.error('Seeding failed:', err);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
}

seedDB();