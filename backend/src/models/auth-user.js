const HttpError = require('../error/HttpError')

const uuid = require('uuid').v4

const users = [
  { 
    id: '1',
    userName: 'Cleyton', 
    password: '$2b$10$k3k2vR5eeMLcQkrBPgdG2eOb4KmyyCsdjy7Bw72PKPQdahiCkZwJe', 
    email: 'cleyton@gmail.com', 
    role: 'Admin',
    createdAt: new Date().toLocaleString(),
    updatedAt: new Date().toLocaleString(),
    followers: 0,
    following: 0,
    posts: []
  }
]

module.exports = users

module.exports = {
  getAllUsers: () => {
    if (users.length > 0) {
      return users.map((user) => ({ id: user.id, userName: user.userName, email: user.email, role: user.role }))
    } else {
      return []
    }
  },

  findUserByEmail: (email) => {
    return users.find((user) => user.email === email)
  },

  findUserById: (id) => {
    return users.find((user) => user.id === id)
  },

  registerUser: (userName, password, email) => {
    const newUser = {
      id: uuid(),
      userName,
      password,
      email,
      role: 'Standard',
      createdAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString(),
      followers: 0,
      following: 0,
      posts: []
    }

    return newUser
  },

  save: (newUser) => {
    users.push(newUser)
  },

  updateUser: (id, updatedData) => {
    const index = users.findIndex((user) => user.id === id)
    if (index === -1) throw new HttpError(404, 'Usuário não encontrado.')

    users[index] = { ...users[index], ...updatedData }
    return users[index]
  },

  deleteUser: (id) => {
    const userIndex = users.findIndex((user) => user.id === id)
    
    if (userIndex === -1) throw new HttpError(404, 'Usuário não encontrado.')

    users.splice(userIndex, 1)
    return users[userIndex]
  }
}