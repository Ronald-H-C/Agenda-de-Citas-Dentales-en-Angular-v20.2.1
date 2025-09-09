const db = require('../../config/database');

// ====================== GET ALL ======================
// ====================== GET ALL ======================
exports.getAllAppointments = async (req, res) => {
    try {
        const [rows] = await db.query(`
      SELECT a.*, 
             p.name AS patient_name, p.firstLastName AS patient_lastname,
             u.name AS dentist_name, u.firstLastName AS dentist_lastname,
             o.name AS office_name
      FROM appointments a
      LEFT JOIN users p ON a.patient_id = p.id
      LEFT JOIN dentists d ON a.dentist_id = d.id
      LEFT JOIN users u ON d.user_id = u.id
      LEFT JOIN offices o ON a.office_id = o.id
      ORDER BY a.appointment_date, a.appointment_time
    `);

        res.json(rows);
    } catch (err) {
        console.error('❌ Error en getAllAppointments:', err);
        res.status(500).json({ error: 'Error al obtener las citas' });
    }
};


// ====================== GET BY ID ======================
exports.getAppointmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query(`
      SELECT a.*, 
             p.name AS patient_name, p.firstLastName AS patient_lastname,
             d.firstName AS dentist_name, d.firstLastName AS dentist_lastname,
             o.name AS office_name
      FROM appointments a
      LEFT JOIN users p ON a.patient_id = p.id
      LEFT JOIN dentists d ON a.dentist_id = d.id
      LEFT JOIN offices o ON a.office_id = o.id
      WHERE a.id = ?
    `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Cita no encontrada' });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error('❌ Error en getAppointmentById:', err);
        res.status(500).json({ error: 'Error al obtener la cita' });
    }
};

// ====================== CREATE ======================
exports.createAppointment = async (req, res) => {
    try {
        const {
            patient_id,
            dentist_id,
            office_id,
            appointment_date,
            appointment_time,
            reason,
            status,
            created_by
        } = req.body;

        const [result] = await db.query(`
      INSERT INTO appointments 
      (patient_id, dentist_id, office_id, appointment_date, appointment_time, reason, status, created_at, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?)
    `, [
            patient_id,
            dentist_id,
            office_id,
            appointment_date,
            appointment_time,
            reason,
            status,
            created_by
        ]);

        res.json({ id: result.insertId, message: 'Cita creada correctamente' });
    } catch (err) {
        console.error('❌ Error en createAppointment:', err);
        res.status(500).json({ error: 'Error al crear la cita' });
    }
};

// ====================== UPDATE ======================
exports.updateAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            patient_id,
            dentist_id,
            office_id,
            appointment_date,
            appointment_time,
            reason,
            status,
            updated_by
        } = req.body;

        const [result] = await db.query(`
      UPDATE appointments 
      SET patient_id = ?, dentist_id = ?, office_id = ?, 
          appointment_date = ?, appointment_time = ?, 
          reason = ?, status = ?, updated_at = NOW(), updated_by = ?
      WHERE id = ?
    `, [
            patient_id,
            dentist_id,
            office_id,
            appointment_date,
            appointment_time,
            reason,
            status,
            updated_by,
            id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Cita no encontrada' });
        }

        res.json({ message: 'Cita actualizada correctamente' });
    } catch (err) {
        console.error('❌ Error en updateAppointment:', err);
        res.status(500).json({ error: 'Error al actualizar la cita' });
    }
};

// ====================== DELETE ======================
exports.deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query(
            `DELETE FROM appointments WHERE id = ?`,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Cita no encontrada' });
        }

        res.json({ message: 'Cita eliminada correctamente' });
    } catch (err) {
        console.error('❌ Error en deleteAppointment:', err);
        res.status(500).json({ error: 'Error al eliminar la cita' });
    }
};

// ====================== CHANGE STATUS ======================
exports.changeStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, updated_by } = req.body;

        const [result] = await db.query(`
      UPDATE appointments
      SET status = ?, updated_at = NOW(), updated_by = ?
      WHERE id = ?
    `, [status, updated_by, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Cita no encontrada' });
        }

        res.json({ message: 'Estado de la cita actualizado correctamente' });
    } catch (err) {
        console.error('❌ Error en changeStatus:', err);
        res.status(500).json({ error: 'Error al cambiar el estado de la cita' });
    }
};
