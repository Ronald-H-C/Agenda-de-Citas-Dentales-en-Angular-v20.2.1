// server/routes/admin/schedulesRoutes.js
const express = require('express');
const router = express.Router();
const schedulesController = require('../../controllers/admin/schedulesController');
const { authMiddleware, authorizeRoles } = require('../../middlewares/authMiddleware');

// CRUD solo accesible a admins
router.get('/', authMiddleware, authorizeRoles('admin'), schedulesController.getAllSchedules);
router.get('/:id', authMiddleware, authorizeRoles('admin'), schedulesController.getScheduleById);
router.post('/', authMiddleware, authorizeRoles('admin'), schedulesController.createSchedule);
router.put('/:id', authMiddleware, authorizeRoles('admin'), schedulesController.updateSchedule);
router.patch('/:id/state', authMiddleware, authorizeRoles('admin'), schedulesController.toggleScheduleState);

module.exports = router;
