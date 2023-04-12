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
    colls.forEach(coll => {
        if(coll.title === '')
            //remove the collection from the array
            colls.splice(colls.indexOf(coll), 1)
    })

    res.render('allCollections', {
        colls: colls
    })
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
    article.markdown = req.body.markdown
    coll.title = article.collectionName
    if(req.body.title === '') return res.send(`Title cannot be empty. Go back to <a href="/articles/new">Create article</a>`)
    try {
        if((await Collection.findOne({ title: req.body.collectionName })) == null) {
            await coll.save()
        }
        console.log('coll: ', coll)
        if((await Article.findOne({ title: req.body.title })) == null) {
            await article.save()
            res.redirect(`/articles/${article.title}`) 
        } else { res.send(`An article with this title already exists so go back to create another article <a href="/articles/new">Go back</a>`) }
        
    } catch (error) {
        console.log(error)
    }
})

router.put('/:title', async(req, res) => {
    const article = await Article.findOne({ title: req.params.title })
    article.title = req.body.title
    article.collectionName = req.body.collectionName
    article.markdown = req.body.markdown
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
