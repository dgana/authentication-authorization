var usersModel = require('../models/usersModel.js')
const passwordHash = require('password-hash')
const jwt = require('jsonwebtoken')

module.exports = {
  list: function (req, res) {
    usersModel.find(function (err, users) {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting users.',
          error: err
        })
      }
      return res.json(users)
    })
  },

  show: function (req, res) {
    var id = req.params.id
    usersModel.findOne({_id: id}, function (err, users) {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting users.',
          error: err
        })
      }
      if (!users) {
        return res.status(404).json({
          message: 'No such users'
        })
      }
      return res.json(users)
    })
  },

  create: function (req, res) {
    var users = new usersModel({      username: req.body.username,      password: passwordHash.generate(req.body.password)
    })

    users.save(function (err, users) {
      if (err) {
        return res.status(500).json({
          message: 'Error when creating users',
          error: err
        })
      }
      return res.status(201).json(users)
    })
  },

  update: function (req, res) {
    var id = req.params.id
    usersModel.findOne({_id: id}, function (err, users) {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting users',
          error: err
        })
      }
      if (!users) {
        return res.status(404).json({
          message: 'No such users'
        })
      }

      users.username = req.body.username ? req.body.username : users.username;      users.password = passwordHash.generate(req.body.password) ? passwordHash.generate(req.body.password) : passwordHash.verify(req.body.password, users.password)

      users.save(function (err, users) {
        if (err) {
          return res.status(500).json({
            message: 'Error when updating users.',
            error: err
          })
        }

        return res.json(users)
      })
    })
  },

  remove: function (req, res) {
    var id = req.params.id
    usersModel.findByIdAndRemove(id, function (err, users) {
      if (err) {
        return res.status(500).json({
          message: 'Error when deleting the users.',
          error: err
        })
      }
      return res.status(203).json(users)
    })
  },

  signin: (req, res) => {
    if (!req.body.username) {
      res.status(400).json('Username Required')
    }
    if (!req.body.password) {
      res.status(400).json('Password Required')
    }

    usersModel.findOne({username: req.body.username}, (err, user) => {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting users.',
          error: err
        })
      }
      if (!user) {
        return res.status(404).json({
          message: 'No such users'
        })
      }

      if (!passwordHash.verify(req.body.password, user.password)) {
        res.json('Invalid Password')
      } else {
        let myToken = jwt.sign({id: user._id, username: user.username}, 'secret', {expiresIn: '24h'})
        res.json(myToken)
      }
    })
  },

  verify: (req, res, next) => {
    let decoded = jwt.verify(req.header('auth'), 'secret')
    if (decoded) {
      next()
    } else {
      res.json('You have no access!')
    }
  }
}
