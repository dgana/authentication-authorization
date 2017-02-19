var usersModel = require('../models/usersModel.js')

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
    var users = new usersModel({      username: req.body.username,      password: req.body.password
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

      users.username = req.body.username ? req.body.username : users.username;      users.password = req.body.password ? req.body.password : users.password
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
      return res.status(204).json()
    })
  }
}
