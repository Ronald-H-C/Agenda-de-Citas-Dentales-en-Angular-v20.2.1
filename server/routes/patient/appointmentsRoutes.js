const express = require('express');
const router = express.Router();
const appointmentsController = require('../../controllers/patient/appointmentsController');
const { authMiddleware, authorizeRoles } = require('../../middlewares/authMiddleware');

// 📌 Paciente solo puede ver SUS citas
router.get('/', authMiddleware, authorizeRoles('patient'), appointmentsController.getMyAppointments);

module.exports = router;
