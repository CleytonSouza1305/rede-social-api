const express = require('express')
const postController = require('../controllers/post-controller')
const { authenticate } = require('../middleware/auth-middleware')
const postRouter = express.Router()

postRouter.get('/feed', postController.feedContent)
postRouter.post('/feed/create', authenticate, postController.createPostReq)
postRouter.put('/feed/:id', authenticate, postController.updatePostReq)
postRouter.delete('/feed/:id', authenticate, postController.deletePostReq)
postRouter.post('/feed/like/:id', authenticate, postController.likePostReq)

module.exports = postRouter