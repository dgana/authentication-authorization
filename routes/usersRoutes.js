var express = require('express')
var router = express.Router()
var usersController = require('../controllers/usersController.js')

router.get('/', usersController.list)
router.get('/:id', usersController.show)
router.post('/', usersController.create)
router.put('/:id', usersController.update)
router.delete('/:id', usersController.remove)

module.exports = router
