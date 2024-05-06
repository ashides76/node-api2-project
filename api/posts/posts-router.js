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

//[PUT] /api/posts/:id
router.put('/:id', (req, res) => {
    const { id } = req.params
    const { title, contents} = req.body
    if (!title || !contents) {
        res.status(400).json({
            message: "Please provide title and contents for the post"
        })
    } else {
        Post.update(id, {title, contents})
        .then(post => {
            if (!post) {
                res.status(404).json({
                    message: "The post with the specified ID does not exist"
                })
            } else {
                return Post.findById(post)
            }
        })
        .then(post => {
            res.status(200).json(post)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: "The post information could not be modified"
            })
        })
    }
})

//[DELETE] /api/posts/:id
//try 1: 
// router.delete('/:id', async (req, res) => {
//     const { id } = req.params
//     await Post.findById(id)
//     .then(post => {
//         console.log('post:', post)
//         if(!post) {
//             res.status(404).json({
//                 message: "The post with the specified ID does not exist"
//             })
//         } else {
//              Post.remove(post)
//             .then (post => {
//                 res.status(200).json(post)
//             })
//             .ctach(err => {
//                 console.log(err)
//             })
//         }
//     })
//     .catch(err => {
//         console.log(err)
//         res.status(500).json({
//             message: "The post could not be removed"
//         })
//     })
// })

//try 2:
router.delete('/:id', async (req, res) => {
    const { id } = req.params
    const postById = await Post.findById(id)
    await Post.remove(id)
        .then(post => {
            if (!post) {
                res.status(404).json({
                    message: "The post with the specified ID does not exist"
                })
            } else {
                return res.json(postById)
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: "The post with the specified ID does not exist"
            })
        })
})

//try 3:
// router.delete('/:id', async (req, res) => {
//     try{
//         const checkID = await Post.findById(req.params.id)
//         if (!checkID) {
//             res.status(404).json({
//                 message: "The post with the specified ID does not exist"
//             })
//         } else {
//             await Post.remove(req.params.id)
//             res.json(checkID)
//         }
//     } catch(err) {
//         res.status(500).json({
//             message: "The post information could not be modified"
//         })
//     }
// })

//[GET] /api/posts/:id/comments
// try 1:
// router.get('/:id/comments', async (req, res) => {
//     const { id } = req.params
//     // const checkId = await Post.findById(req.params.id)
//     await Post.findPostComments(id)
//     .then(post => {
//         if (!post) {
//             res.status(404).json({
//                 message: "The post with the specified ID does not exist"
//             })
//         } else {
//             res.json(post)
//         }
//     })
//     .catch(err => {
//         console.log(err)
//         res.status(500).json({
//             message: "The comments information could not be retrieved"
//         })
//     })
// })

//try 2:
router.get('/:id/comments', async (req, res) => {
    try{
        const { id } = req.params
        const post = await Post.findById(id)
        if (!post) {
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        } else {
            const messages = await Post.findPostComments(id)
            res.json(messages)
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "The comments information could not be retrieved"
        })
    }
})

module.exports = router