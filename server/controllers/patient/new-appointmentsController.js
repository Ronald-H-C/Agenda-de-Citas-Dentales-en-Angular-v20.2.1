const pool = require('../../config/database');

// 📌 Crear nueva cita
exports.createAppointment = async (req, res) => {
    try {
        const patientUserId = req.user.id; // viene del token JWT
        const { dentist_id, office_id, appointment_date, appointment_time, reason } = req.body;

        if (!dentist_id || !office_id || !appointment_date || !appointment_time || !reason) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        const [result] = await pool.query(
            `INSERT INTO appointments 
        (patient_id, dentist_id, office_id, appointment_date, appointment_time, reason, status, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, 'pending', NOW())`,
            [patientUserId, dentist_id, office_id, appointment_date, appointment_time, reason]
        );

        res.status(201).json({
            message: '✅ Cita creada exitosamente',
            appointmentId: result.insertId
        });
    } catch (error) {
        console.error('❌ Error en createAppointment:', error);
        res.status(500).json({ message: 'Error al crear la cita', error: error.message });
    }
};
