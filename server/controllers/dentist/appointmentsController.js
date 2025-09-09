// server/controllers/dentist/appointmentsController.js
const db = require('../../config/database');

// ====================== GET MY APPOINTMENTS ======================
exports.getMyAppointments = async (req, res) => {
    try {
        const dentistUserId = req.user.id; // 👈 viene del JWT (usuario logueado)

        // 1. Buscar el ID de dentist asociado al usuario
        const [dentistRows] = await db.query(
            'SELECT id FROM dentists WHERE user_id = ?',
            [dentistUserId]
        );

        if (dentistRows.length === 0) {
            return res.status(404).json({ error: 'No se encontró un perfil de dentista para este usuario' });
        }

        const dentistId = dentistRows[0].id;

        // 2. Buscar todas las citas asociadas a ese dentist_id
        const [rows] = await db.query(`
          SELECT a.id, a.appointment_date, a.appointment_time, a.reason, a.status,
                 p.name AS patient_name, p.firstLastName AS patient_lastname
          FROM appointments a
          LEFT JOIN users p ON a.patient_id = p.id
          WHERE a.dentist_id = ?
          ORDER BY a.appointment_date DESC, a.appointment_time DESC
        `, [dentistId]);

        res.json(rows);
    } catch (err) {
        console.error("❌ Error en getMyAppointments:", err);
        res.status(500).json({ error: 'Error al obtener las citas del dentista' });
    }
};
