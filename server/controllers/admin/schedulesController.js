// server/controllers/admin/schedulesController.js
const db = require('../../config/database');

// Obtener todos los horarios
exports.getAllSchedules = async (req, res) => {
    try {
        const [rows] = await db.query(`
      SELECT s.id, s.dentist_id, s.day_of_week, s.start_time, s.end_time, s.state,
             u.name AS dentist_name, u.firstLastName, sp.name AS specialty
      FROM schedules s
      JOIN dentists d ON s.dentist_id = d.id
      JOIN users u ON d.user_id = u.id
      JOIN specialties sp ON d.specialty_id = sp.id
      ORDER BY s.id DESC
    `);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener horarios' });
    }
};

// Obtener horario por ID
exports.getScheduleById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query(`
      SELECT s.id, s.dentist_id, s.day_of_week, s.start_time, s.end_time, s.state,
             u.name AS dentist_name, u.firstLastName, sp.name AS specialty
      FROM schedules s
      JOIN dentists d ON s.dentist_id = d.id
      JOIN users u ON d.user_id = u.id
      JOIN specialties sp ON d.specialty_id = sp.id
      WHERE s.id = ?
    `, [id]);

        if (rows.length === 0) return res.status(404).json({ error: 'Horario no encontrado' });
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener horario' });
    }
};

// Crear horario
exports.createSchedule = async (req, res) => {
    const { dentist_id, day_of_week, start_time, end_time } = req.body;
    if (!dentist_id || !day_of_week || !start_time || !end_time) {
        return res.status(400).json({ error: 'Campos obligatorios faltantes' });
    }

    try {
        const sql = `
      INSERT INTO schedules (dentist_id, day_of_week, start_time, end_time, state, created_at, created_by)
      VALUES (?, ?, ?, ?, 1, NOW(), ?)
    `;
        const [result] = await db.query(sql, [dentist_id, day_of_week, start_time, end_time, req.user.id]);
        res.status(201).json({ message: 'Horario creado', id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: 'Error al crear horario' });
    }
};

// Actualizar horario
exports.updateSchedule = async (req, res) => {
    const { id } = req.params;
    const { dentist_id, day_of_week, start_time, end_time, state } = req.body;

    try {
        const fields = [];
        const values = [];

        if (dentist_id !== undefined) { fields.push('dentist_id = ?'); values.push(dentist_id); }
        if (day_of_week !== undefined) { fields.push('day_of_week = ?'); values.push(day_of_week); }
        if (start_time !== undefined) { fields.push('start_time = ?'); values.push(start_time); }
        if (end_time !== undefined) { fields.push('end_time = ?'); values.push(end_time); }
        if (state !== undefined) { fields.push('state = ?'); values.push(state); }

        if (fields.length === 0) return res.status(400).json({ error: 'Nada para actualizar' });

        fields.push('updated_at = NOW()', 'updated_by = ?');
        values.push(req.user.id, id);

        const sql = `UPDATE schedules SET ${fields.join(', ')} WHERE id = ?`;
        await db.query(sql, values);

        res.json({ message: 'Horario actualizado' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al actualizar horario' });
    }
};

// Activar/desactivar horario
exports.toggleScheduleState = async (req, res) => {
    const { id } = req.params;
    const { state } = req.body;
    if (typeof state === 'undefined') return res.status(400).json({ error: 'state requerido' });

    try {
        await db.query(
            'UPDATE schedules SET state = ?, updated_at = NOW(), updated_by = ? WHERE id = ?',
            [state, req.user.id, id]
        );
        res.json({ message: `Horario ${state ? 'activado' : 'desactivado'}` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al cambiar estado' });
    }
};
