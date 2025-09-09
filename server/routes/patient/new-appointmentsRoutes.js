const express = require('express');
const router = express.Router();
const newAppointmentsController = require('../../controllers/patient/new-appointmentsController');
const { authMiddleware, authorizeRoles } = require('../../middlewares/authMiddleware');

// 📌 Crear nueva cita
router.post('/', authMiddleware, authorizeRoles('patient'), newAppointmentsController.createAppointment);

module.exports = router;
