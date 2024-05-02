// implement your posts router here
const express = require('express')
const Post = require('./posts-model')

const router = express.Router()

//1 [GET] /api/posts
router.get('/', (req, res) => {
    Post.find()
        .then(post => {
            res.status(200).json(post)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: "The posts information could not be retrieved"
            })
        })
})

//[GET] /api/posts/:id
router.get('/:id', (req, res) => {
    const { id } = req.params
    Post.findById(id)
        .then(post => {
            if (post) {
                res.status(200).json(post)
            } else {
                res.status(404).json({
                    message: "The post with the specified ID does not exist"
                })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: "The posts information could not be retrieved"
            })
        })
})

//[POST] /api/posts
router.post('/', (req, res) => {
    const {title, contents} = req.body
    if (!title || !contents) {
        res.status(400).json({
            message: "Please provide title and contents for the post"
        }) 
    } else {
        Post.insert({title, contents})
            .then(({id}) => {
                return Post.findById(id)
            })
            .then(post => {
                res.status(201).json(post)
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({
                    message: "There was an error while saving the post to the database"
                })
            })
    }
})

module.exports = router