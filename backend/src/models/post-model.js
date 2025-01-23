const HttpError = require('../error/HttpError')
const { post } = require('../routes/authroures')
const { findUserById } = require('./auth-user')

const uuid = require('uuid').v4

const posts = [
  { 
    postId: '1', 
    userId: '1',
    postTitle: 'Primeiro Post', 
    postContent: 'Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem',
    likedBy: [],
    likes: 0,
    postCommit: []
  }
]

module.exports = {
  allPosts: () => posts.map((post) => (
     { 
      id: post.postId, 
      userId: post.userId, 
      postTitle: post.postTitle,
      postContent: post.postContent,
      likes: post.likes,
      postCommit: []
     }
    )),

  createPost: (postTitle, postContent, userId) => {
    const newPost = {
      postId: uuid(), 
      userId,
      postTitle,
      postContent,
      likedBy: [],
      likes: 0,
      postCommit: []
    }

    const actualUser = findUserById(userId)
    actualUser.posts.push(newPost)

    posts.push(newPost)
    return newPost
  },

  updatePost: (postId, updatedPost) => {
    const index = posts.findIndex((post) => post.postId === postId)
    if (index === -1) throw new HttpError(404, 'Post não encontrado.')

    posts[index] = { ...posts[index], ...updatedPost }
    
    return posts[index]
  },

  deletePost: (postId) => {
    const index = posts.findIndex((post) => post.postId === postId)
    if (index === -1) throw new HttpError(404, 'Post não encontrado.')

    posts.splice(index, 1)
  },

  likePost: (postId, userId) => {
    const index = posts.findIndex((post) => post.postId === postId)
    if (index === -1) throw new HttpError(404, 'Post não encontrado.')

    const actualUser = findUserById(userId)

    const alreadyLiked = posts[index].likedBy.some((pos) => pos.id === userId);
    if (alreadyLiked) {
      return posts[index];
    }

    posts[index].likedBy.push({ id: userId, likedBy: actualUser.userName })
    posts[index].likes = posts[index].likedBy.length

    return posts[index]
  }
}