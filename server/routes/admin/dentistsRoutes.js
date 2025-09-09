const express = require('express');
const router = express.Router();
const dentistsController = require('../../controllers/admin/dentistsController');
const { authMiddleware, authorizeRoles } = require('../../middlewares/authMiddleware');

// CRUD solo accesible a admins
router.get('/', authMiddleware, authorizeRoles('admin'), dentistsController.getAllDentists);
router.get('/:id', authMiddleware, authorizeRoles('admin'), dentistsController.getDentistById);
router.post('/', authMiddleware, authorizeRoles('admin'), dentistsController.createDentist);
router.put('/:id', authMiddleware, authorizeRoles('admin'), dentistsController.updateDentist);
router.patch('/:id/state', authMiddleware, authorizeRoles('admin'), dentistsController.toggleDentistState);

module.exports = router;
