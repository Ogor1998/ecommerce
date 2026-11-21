module.exports.SORTS = {
    '-createdAt': { createdAt: -1 },
    'price': { price: 1 },
    '-price': { price: -1 },
    'name': { name: 1 },
}

module.exports.escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')