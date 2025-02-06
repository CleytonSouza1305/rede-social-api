const HttpError = require('../error/HttpError')
const { post } = require('../routes/authroures')
const { findUserById } = require('./auth-user')

const uuid = require('uuid').v4

const posts = [
  { 
    postId: '1', 
    userId: '1',
    postTitle: 'Primeiro Post', 
    postImage: 'https://pm1.aminoapps.com/6929/74373da2c7de5b5e1448195e362372fddaec1bd6r1-720-554v2_uhq.jpg',
    createdAt: new Date().toLocaleString(),
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
      postImage: post.postImage,
      createdAt: post.createdAt,
      likes: post.likes,
      postCommit: post.postCommit
     }
    )),

  createPost: (postTitle, userId, postImage) => {
    const newPost = {
      postId: uuid(), 
      userId,
      postTitle,
      postImage,
      likedBy: [],
      likes: 0,
      createdAt: new Date().toLocaleString(),
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
  },

  commitPost: (postId, userId, commit) => {
    const index = posts.findIndex((post) => post.postId === postId)
    if (index === -1) throw new HttpError(404, 'Post não encontrado.')

    posts[index].postCommit.push({ userId, commit })
    return posts[index]
  }
}