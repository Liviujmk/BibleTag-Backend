const mongoose = require('mongoose');
const Collection = require('./coll')
const {marked} = require('marked')
const slugify = require('slugify')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)

const ArticleSchema = new mongoose.Schema({ 
    title: String,
    content: String,
    createdAt: { type: Date, default: Date.now },
    collectionName: [String],
    collectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Collection'
    },
    markdown: {
      type: String,
      required: true
    },
});

ArticleSchema.pre('validate', function(next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true })
  }

  if (this.markdown) {
    this.content = dompurify.sanitize(marked(this.markdown))
  }

  next()
})

const Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;