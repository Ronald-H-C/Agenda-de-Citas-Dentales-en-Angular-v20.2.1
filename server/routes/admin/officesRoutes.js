const express = require('express');
const router = express.Router();
const officesController = require('../../controllers/admin/officesController');
const { authMiddleware, authorizeRoles } = require('../../middlewares/authMiddleware');


// CRUD oficinas
router.get('/', authMiddleware, authorizeRoles('admin'), officesController.getAllOffices);
router.get('/:id', authMiddleware, authorizeRoles('admin'), officesController.getOfficeById);
router.post('/', authMiddleware, authorizeRoles('admin'), officesController.createOffice);
router.put('/:id', authMiddleware, authorizeRoles('admin'), officesController.updateOffice);
router.patch('/:id/state', authMiddleware, authorizeRoles('admin'), officesController.toggleOfficeState);

module.exports = router;


