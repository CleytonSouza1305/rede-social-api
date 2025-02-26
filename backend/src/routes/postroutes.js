const express = require('express')
const postController = require('../controllers/post-controller')
const { authenticate } = require('../middleware/auth-middleware')
const postRouter = express.Router()
const multer = require('../config/multerConfig')

postRouter.get('/feed', postController.feedContent)
postRouter.post('/feed/create', authenticate, multer.single('image'), postController.createPostReq)
postRouter.put('/feed/:id', authenticate, postController.updatePostReq)
postRouter.delete('/feed/:id', authenticate, postController.deletePostReq)
postRouter.post('/feed/like/:id', authenticate, postController.likePostReq)
postRouter.post('/feed/commit/:id', authenticate, postController.commitPostrReq)

module.exports = postRouter