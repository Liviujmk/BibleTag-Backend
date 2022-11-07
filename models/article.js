const mongoose = require('mongoose');
const Collection = require('./coll')

const ArticleSchema = new mongoose.Schema({ 
    title: String,
    content: String,
    createdAt: { type: Date, default: Date.now },
    collectionName: [{type: String}],
    collectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Collection'
    }
});

const Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;
