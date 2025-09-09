const express = require('express');
const router = express.Router();
const specialtiesController = require('../../controllers/admin/specialtiesController');
const { authMiddleware, authorizeRoles } = require('../../middlewares/authMiddleware');

// CRUD solo accesible a admins
router.get('/', authMiddleware, authorizeRoles('admin'), specialtiesController.getAllSpecialties);
router.get('/:id', authMiddleware, authorizeRoles('admin'), specialtiesController.getSpecialtyById);
router.post('/', authMiddleware, authorizeRoles('admin'), specialtiesController.createSpecialty);
router.put('/:id', authMiddleware, authorizeRoles('admin'), specialtiesController.updateSpecialty);
router.patch('/:id/state', authMiddleware, authorizeRoles('admin'), specialtiesController.toggleSpecialtyState);

module.exports = router;
