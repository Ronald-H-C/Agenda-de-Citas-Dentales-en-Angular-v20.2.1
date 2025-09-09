const express = require('express');
const router = express.Router();
const appointmentsController = require('../../controllers/dentist/appointmentsController');
const { authMiddleware, authorizeRoles } = require('../../middlewares/authMiddleware');

// 📌 Solo dentistas pueden acceder
router.get(
    '/',
    authMiddleware,
    authorizeRoles('dentist'),
    appointmentsController.getMyAppointments
);

module.exports = router;
