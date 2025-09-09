const db = require('../../config/database');

// Obtener los horarios del dentista logueado
exports.getMySchedules = async (req, res) => {
    try {
        const dentistUserId = req.user.id; // viene del token JWT (users.id)

        // Buscamos el dentist.id asociado al usuario logueado
        const [dentistRows] = await db.query(
            'SELECT id FROM dentists WHERE user_id = ?',
            [dentistUserId]
        );

        if (dentistRows.length === 0) {
            return res.status(404).json({ message: 'Dentista no encontrado' });
        }

        const dentistId = dentistRows[0].id;

        // Traemos solo los horarios de ese dentista
        const [rows] = await db.query(
            `SELECT s.*, o.name AS office_name
       FROM schedules s
       LEFT JOIN offices o ON s.office_id = o.id
       WHERE s.dentist_id = ?`,
            [dentistId]
        );

        res.json(rows);
    } catch (error) {
        console.error('❌ Error en getMySchedules:', error);
        res.status(500).json({ message: 'Error obteniendo horarios' });
    }
};

// Crear un horario nuevo
exports.createSchedule = async (req, res) => {
    try {
        const dentistUserId = req.user.id;
        const { day_of_week, start_time, end_time, office_id } = req.body;

        const [dentistRows] = await db.query(
            'SELECT id FROM dentists WHERE user_id = ?',
            [dentistUserId]
        );

        if (dentistRows.length === 0) {
            return res.status(404).json({ message: 'Dentista no encontrado' });
        }

        const dentistId = dentistRows[0].id;

        const [result] = await db.query(
            `INSERT INTO schedules (dentist_id, day_of_week, start_time, end_time, office_id, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
            [dentistId, day_of_week, start_time, end_time, office_id || null]
        );

        res.status(201).json({ message: 'Horario creado', id: result.insertId });
    } catch (error) {
        console.error('❌ Error en createSchedule:', error);
        res.status(500).json({ message: 'Error creando horario' });
    }
};

// Eliminar un horario
exports.deleteSchedule = async (req, res) => {
    try {
        const dentistUserId = req.user.id;
        const { id } = req.params;

        const [dentistRows] = await db.query(
            'SELECT id FROM dentists WHERE user_id = ?',
            [dentistUserId]
        );

        if (dentistRows.length === 0) {
            return res.status(404).json({ message: 'Dentista no encontrado' });
        }

        const dentistId = dentistRows[0].id;

        const [result] = await db.query(
            'DELETE FROM schedules WHERE id = ? AND dentist_id = ?',
            [id, dentistId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Horario no encontrado o no autorizado' });
        }

        res.json({ message: 'Horario eliminado' });
    } catch (error) {
        console.error('❌ Error en deleteSchedule:', error);
        res.status(500).json({ message: 'Error eliminando horario' });
    }
};
