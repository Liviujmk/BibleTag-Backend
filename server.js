const express = require('express')
const app = express()
const port = 4000
const methodOverride = require('method-override')
const Article = require('./models/article')
const mongoose = require('mongoose');
const router = require('./routes/routes')

require('dotenv').config();

const conn = process.env.DB_STRING;
mongoose.connect(conn, {useNewUrlParser: true, useUnifiedTopology: true})
    .then( () =>console.log('DB Ok'))
    .catch(err => console.log(err))

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use('/public', express.static('public'))

app.set('view engine', 'ejs');

app.get('/', async(req, res) => {
    const articles = await Article.find().sort({ updatedAt: 'desc' })
    articles.forEach(async article => {
        if(article.title === '') 
        //remove the article from the array
        articles.splice(articles.indexOf(article), 1)
    })
    if(articles.length === 0) res.send('no articles so <a href="/articles/new">Create one</a>')
    else {
        res.render('index', {
            articles: articles
        })
    }
})

app.use('/articles', require('./routes/routes'))

app.use(function (req, res) {
    res.status(404).send('404: Page not found')
})

app.listen(process.env.PORT || port, () => console.log(`Example app at http://localhost:${port}/`))
