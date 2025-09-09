const db = require('../../config/database');

// Obtener todos los dentistas con su usuario y especialidad
exports.getAllDentists = async (req, res) => {
    try {
        const [rows] = await db.query(`
      SELECT d.id, u.name, u.firstLastName, u.secondLastName, u.email, u.username,
             s.name AS specialty, d.license_number, d.experience_years, d.phone, d.state,
             d.created_at, d.updated_at
      FROM dentists d
      INNER JOIN users u ON d.user_id = u.id
      INNER JOIN specialties s ON d.specialty_id = s.id
      ORDER BY d.id DESC
    `);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener dentistas' });
    }
};

// Obtener un dentista por ID
exports.getDentistById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query(`
      SELECT d.id, u.name, u.firstLastName, u.secondLastName, u.email, u.username,
             s.name AS specialty, d.license_number, d.experience_years, d.phone, d.state
      FROM dentists d
      INNER JOIN users u ON d.user_id = u.id
      INNER JOIN specialties s ON d.specialty_id = s.id
      WHERE d.id = ?
    `, [id]);

        if (rows.length === 0) return res.status(404).json({ error: 'Dentista no encontrado' });
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener dentista' });
    }
};

// Crear un dentista
exports.createDentist = async (req, res) => {
    const { user_id, specialty_id, license_number, experience_years, phone } = req.body;

    if (!user_id || !specialty_id || !license_number) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    try {
        const sql = `
      INSERT INTO dentists (user_id, specialty_id, license_number, experience_years, phone, state, created_at, created_by)
      VALUES (?, ?, ?, ?, ?, 1, NOW(), ?)
    `;
        const [result] = await db.query(sql, [
            user_id, specialty_id, license_number, experience_years || 0, phone || '', req.user.id
        ]);
        res.status(201).json({ message: 'Dentista creado', id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: 'Error al crear dentista' });
    }
};

// Actualizar un dentista
exports.updateDentist = async (req, res) => {
    const { id } = req.params;
    const { specialty_id, license_number, experience_years, phone } = req.body;

    try {
        const fields = [];
        const values = [];

        if (specialty_id !== undefined) { fields.push('specialty_id = ?'); values.push(specialty_id); }
        if (license_number !== undefined) { fields.push('license_number = ?'); values.push(license_number); }
        if (experience_years !== undefined) { fields.push('experience_years = ?'); values.push(experience_years); }
        if (phone !== undefined) { fields.push('phone = ?'); values.push(phone); }

        if (fields.length === 0) return res.status(400).json({ error: 'Nada para actualizar' });

        fields.push('updated_at = NOW()', 'updated_by = ?');
        values.push(req.user.id, id);

        const sql = `UPDATE dentists SET ${fields.join(', ')} WHERE id = ?`;
        await db.query(sql, values);

        res.json({ message: 'Dentista actualizado' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al actualizar dentista' });
    }
};

// Activar/desactivar dentista
exports.toggleDentistState = async (req, res) => {
    const { id } = req.params;
    const { state } = req.body;
    if (typeof state === 'undefined') return res.status(400).json({ error: 'state requerido' });

    try {
        await db.query(
            'UPDATE dentists SET state = ?, updated_at = NOW(), updated_by = ? WHERE id = ?',
            [state, req.user.id, id]
        );
        res.json({ message: `Dentista ${state ? 'activado' : 'desactivado'}` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al cambiar estado' });
    }
};
