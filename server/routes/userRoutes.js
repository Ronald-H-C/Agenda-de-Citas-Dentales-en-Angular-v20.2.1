const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.get('/', userController.getAllUsers);
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/google-login', userController.loginWithGoogle);
router.get('/me', authMiddleware, (req, res) => res.json(req.user));

module.exports = router;
