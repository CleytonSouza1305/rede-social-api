const HttpError = require("../error/HttpError")
const postModel = require("../models/post-model")
const multer = require('multer')
const path = require('path')

module.exports = {
  feedContent: (req, res) => {
    const posts = postModel.allPosts()
    res.json(posts)
  },

  createPostReq: (req, res) => {
    const { postTitle } = req.body;
    const image = req.file ? req.file.filename : ''

    if (typeof postTitle !== 'string') {
      return res.status(400).json({ message: 'Tipos de dados inválidos.' });
    }

    const user = req.user;
    if (!user) return res.status(404).json({ message: 'Usuário não registrado.' });

    const newPost = postModel.createPost(postTitle, user.id, image);
    return res.status(201).json(newPost); 
  },
  
  updatePostReq: (req, res) => {
    const { id } = req.params
    const { postTitle } = req.body

    const updatedPost = {}

    if (postTitle && typeof postTitle === 'string') {
      updatedPost.postTitle = postTitle
    }

    const update = postModel.updatePost(id, updatedPost)
    res.status(201).json(update)
  },

  deletePostReq: (req, res) => {
    const { id } = req.params

    postModel.deletePost(id)
    res.status(200).json({ message: 'Post deletado com sucesso!' })
  },

  likePostReq: (req, res) => {
    const { id } = req.params

    const user = req.user
    if (!user) throw new HttpError(404, 'Usuário não registrado.')

    const likePost = postModel.likePost(id, user.id)

    res.status(200).json(likePost)
  },

  commitPostrReq: (req, res) => {
    const { id } = req.params

    const user = req.user
    if (!user) throw new HttpError(404, 'Usuário não registrado.')

    const { commit } = req.body
    
    if (!commit) throw new HttpError(400, 'O comentário não pode estar vazio.')
    
    const commitPost = postModel.commitPost(id, user.id, commit)
    res.status(200).json(commitPost)
  }
}