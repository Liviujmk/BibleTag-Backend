const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Article = require('../models/article');
const Collection = require('../models/coll');

router.get('/new', (req, res) => {
    res.render('new',{
        article: new Article()
    })
})


router.get('/collections', async(req, res) => {
    const colls = await Collection.find().sort({ createdAt: 'desc' })
    res.render('allCollections', {
        colls: colls
    })
    console.log(colls);
})

router.get('/collections/:coltitle', async(req, res) => {
    //const articles = await Article.find({ collectionName: req.params.coltitle }).exec()
    const articles = await Article.find({ collectionName: req.params.coltitle }).sort({ createdAt: 'desc' })
    const coll = await Collection.findOne({ title: req.params.coltitle })
    
    if(!coll) return res.status(404).send(`no such collection. Go back to <a href="/articles/collections">All collections</a>`)
    res.render('collection', {
        articles: articles,
        coll: coll
    })
})

router.post('/collections/:coltitle', async(req, res) => {
    const coll = await Collection.findOne({ title: req.params.coltitle })
    const article = new Article({
        title: req.body.title,
        collectionName: req.params.coltitle
    })
    try {
        await article.save()
        coll.articles.push(article)
        await coll.save()
        res.redirect(`/articles/collections/${req.params.coltitle}`)
    } catch (error) {
        console.warn(error)
        res.redirect(`/articles/collections/${req.params.coltitle}`)
    }
})

router.get('/:title', async(req, res) => {
    const article = await Article.findOne({ title: req.params.title })
    if(!article) return res.status(404).send(`Article not found. Go to <a href="/">home</a>`)
    res.render('article', {
        article: article
    })
})

router.get('/:title/edit', async(req, res) => {
    const article = await Article.findOne({ title: req.params.title })
    res.render('edit', {
        article: article
    })
})

router.post('/', async(req, res) => {
    const article = new Article()
    const coll = new Collection()
    article.title = req.body.title
    article.collectionName = req.body.collectionName
    article.content = req.body.content
    coll.title = article.collectionName
    try {
        if((await Collection.findOne({ title: article.collectionName })) == null) {
            await coll.save()
        }

        if((await Article.findOne({ title: article.title })) === null) {
            await article.save()
            res.redirect(`/articles/${article.title}`) 
        } else { res.send(`an article with this title already exists so go back to create another article <a href="/articles/new">Go back</a>`) }
        
    } catch (error) {
        console.log(error)
    }
})

router.put('/:title', async(req, res) => {
    const article = await Article.findOne({ title: req.params.title })
    article.title = req.body.title
    article.collectionName = req.body.collectionName
    article.content = req.body.content
    try {
        await article.save()
        res.redirect(`/articles/${article.title}`)
    } catch (error) {
        console.log(error)
    }
})

router.delete('/:title', async(req, res) => {
    await Article.findOneAndDelete({ title: req.params.title })
    try {
        res.redirect(`/`)
    } catch (error) {
        console.log(error)
    }
})


router.delete('/collections/:coltitle', async(req, res) => {
    const Articles = await Article.find({ collectionName: req.params.coltitle }).exec()
    await Collection.findOneAndDelete({ title: req.params.title })
    try {
        res.redirect(`/`)
    } catch (error) {
        console.log(error)
    }
})


module.exports = router;
