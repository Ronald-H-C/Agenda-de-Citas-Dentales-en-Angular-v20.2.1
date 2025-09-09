const express = require('express');
const router = express.Router();
const profileController = require('../../controllers/patient/profileController');
const { authMiddleware, authorizeRoles } = require('../../middlewares/authMiddleware');

// 📌 Todas requieren autenticación
router.get('/', authMiddleware, authorizeRoles('patient'), profileController.getProfile);
router.put('/', authMiddleware, authorizeRoles('patient'), profileController.updateProfile);

module.exports = router;
