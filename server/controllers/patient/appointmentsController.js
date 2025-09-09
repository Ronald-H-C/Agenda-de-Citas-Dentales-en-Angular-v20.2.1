const db = require('../../config/database');

// ====================== GET MY APPOINTMENTS ======================
exports.getMyAppointments = async (req, res) => {
    try {
        const patientUserId = req.user.id; // 👈 viene del token JWT

        const [rows] = await db.query(`
            SELECT a.id, a.appointment_date, a.appointment_time, a.reason, a.status,
                   d.first_name AS dentist_name, d.last_name AS dentist_lastname,
                   o.name AS office_name
            FROM appointments a
            INNER JOIN dentists d ON a.dentist_id = d.id
            INNER JOIN offices o ON a.office_id = o.id
            WHERE a.patient_id = ?
            ORDER BY a.appointment_date DESC, a.appointment_time DESC
        `, [patientUserId]);

        res.json(rows);
    } catch (err) {
        console.error('❌ Error en getMyAppointments:', err);
        res.status(500).json({ error: 'Error al obtener las citas del paciente' });
    }
};
