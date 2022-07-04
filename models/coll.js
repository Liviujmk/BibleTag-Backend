const mongoose = require('mongoose');


const CollectionSchema = new mongoose.Schema({ 
    title: String,
    createdAt: { type: Date, default: Date.now }
});

const Collection = mongoose.model('Collection', CollectionSchema);

module.exports = Collection;