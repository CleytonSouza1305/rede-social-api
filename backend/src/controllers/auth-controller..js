const HttpError = require("../error/HttpError")
const { registerUser, save, findUserByEmail, getAllUsers, findUserById, updateUser, deleteUser } = require("../models/auth-user")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = {
  // POST /auth/register
  register: (req, res) => {
    const { userName, password, email } = req.body

    if (typeof userName !== 'string' || typeof password !== 'string'
       || typeof email !== 'string') throw new HttpError(400, 'Tipos de dados inválidos.')

    const existUser = findUserByEmail(email)
    if (existUser) throw new HttpError(400, 'Usuário já existente.')

    const encryptedPassword = bcrypt.hashSync(password, 10)
    
    const newUser = registerUser(userName, encryptedPassword, email)
    save(newUser)

    res.status(201).json({ id: newUser.id, userName: newUser.userName, email: newUser.email, role: newUser.role })
  },

  // POST /auth/login
  login: (req, res) => {
    const { email, password } = req.body

    const user = findUserByEmail(email)
    if (!user) throw new HttpError(404, 'Usuário não registrado.')
      
    const isValidPassword = bcrypt.compareSync(password, user.password)
    
    if (!isValidPassword) throw new HttpError(400, 'Credenciais inválidas.')
    
    const payload = { id: user.id, email: user,email }
    
    const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '1d' })
  
    res.status(200).json({ token })
  },

  // GET /auth/users
  allUsers: (req, res) => {
    const allUsers = getAllUsers()
    res.status(200).json(allUsers)
  },

  // GET /auth/users/:id
  userById: (req, res) => {
    const { id } = req.params
    const user = findUserById(id)

    if (!user) throw new HttpError(404, 'Usuário não encontrado.')

    res.status(200).json(user)
  },

  // PUT /auth/users/:id
  update: (req, res) => {
    const { id } = req.params
    const updatedUser = {}

    const { userName, password, email } = req.body
    if (userName && typeof userName === 'string') {
      updatedUser.userName = userName
    }

    if (password && typeof password === 'string') {
      const encryptedPassword = bcrypt.hashSync(password, 10)
      updatedUser.password = encryptedPassword
    }

    if (email && typeof email === 'string') {
      updatedUser.email = email
    }

    updatedUser.updatedAt = new Date().toLocaleString()
    const updatedData = updateUser(id, updatedUser)
    res.status(200).json(updatedData)
  },

  // DELETE /auth/users/:id
  delete: (req, res) => {
    const { id } = req.params

    deleteUser(id)
    res.status(200).json({ message: 'Usuário deletado.' })
  }
}