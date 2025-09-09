const express = require('express');
const router = express.Router();
const appointmentsController = require('../../controllers/admin/appointmentsController');
const { authMiddleware, authorizeRoles } = require('../../middlewares/authMiddleware');

// 📌 Rutas protegidas para ADMIN
router.get('/', authMiddleware, authorizeRoles('admin'), appointmentsController.getAllAppointments);
router.get('/:id', authMiddleware, authorizeRoles('admin'), appointmentsController.getAppointmentById);
router.post('/', authMiddleware, authorizeRoles('admin'), appointmentsController.createAppointment);
router.put('/:id', authMiddleware, authorizeRoles('admin'), appointmentsController.updateAppointment);
router.patch('/:id/status', authMiddleware, authorizeRoles('admin'), appointmentsController.changeStatus);
router.delete('/:id', authMiddleware, authorizeRoles('admin'), appointmentsController.deleteAppointment);

module.exports = router;
