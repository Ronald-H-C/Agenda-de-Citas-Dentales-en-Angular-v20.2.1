// server/routes/admin/usersRoutes.js
const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/admin/usersController');
const { authMiddleware, authorizeRoles } = require('../../middlewares/authMiddleware');

// CRUD solo accesible a admins
router.get('/', authMiddleware, authorizeRoles('admin'), usersController.getAllUsers);
router.get('/:id', authMiddleware, authorizeRoles('admin'), usersController.getUserById);
router.post('/', authMiddleware, authorizeRoles('admin'), usersController.createUser);
router.put('/:id', authMiddleware, authorizeRoles('admin'), usersController.updateUser);
router.patch('/:id/state', authMiddleware, authorizeRoles('admin'), usersController.toggleUserState);

module.exports = router;
