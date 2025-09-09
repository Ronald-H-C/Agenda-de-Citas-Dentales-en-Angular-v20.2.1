const db = require('../../config/database');

// 📌 Obtener perfil del paciente autenticado
exports.getProfile = async (req, res) => {
    try {
        const patientUserId = req.user.id; // viene del token JWT

        const [rows] = await db.query(
            `SELECT u.id, u.name, u.firstLastName, u.email, u.phone, u.role
       FROM users u
       WHERE u.id = ? AND u.role = 'patient'`,
            [patientUserId]
        );

        if (!rows.length) {
            return res.status(404).json({ message: 'Perfil no encontrado' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('❌ Error en getProfile:', error);
        res.status(500).json({ message: 'Error al obtener perfil' });
    }
};

// 📌 Actualizar perfil del paciente autenticado
exports.updateProfile = async (req, res) => {
    try {
        const patientUserId = req.user.id;
        const { name, firstLastName, email, phone } = req.body;

        await db.query(
            `UPDATE users
       SET name = ?, firstLastName = ?, email = ?, phone = ?, updated_at = NOW()
       WHERE id = ? AND role = 'patient'`,
            [name, firstLastName, email, phone, patientUserId]
        );

        res.json({ message: 'Perfil actualizado correctamente' });
    } catch (error) {
        console.error('❌ Error en updateProfile:', error);
        res.status(500).json({ message: 'Error al actualizar perfil' });
    }
};
