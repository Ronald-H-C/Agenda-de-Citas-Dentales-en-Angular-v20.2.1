const express = require('express');
const router = express.Router();
const { getMySchedules, createSchedule, deleteSchedule } = require('../../controllers/dentist/schedulesController');
const { authMiddleware, authorizeRoles } = require('../../middlewares/authMiddleware');

// Todas estas rutas requieren autenticación y rol dentista
router.get('/', authMiddleware, authorizeRoles('dentist'), getMySchedules);
router.post('/', authMiddleware, authorizeRoles('dentist'), createSchedule);
router.delete('/:id', authMiddleware, authorizeRoles('dentist'), deleteSchedule);


module.exports = router;
