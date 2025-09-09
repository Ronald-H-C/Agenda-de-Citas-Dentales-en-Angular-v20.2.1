const db = require('../../config/database');

// Obtener todas las especialidades
exports.getAllSpecialties = async (req, res) => {
    try {
        const [rows] = await db.query(`
      SELECT id, name, description, state, created_at, updated_at
      FROM specialties
      ORDER BY id DESC
    `);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener especialidades' });
    }
};

// Obtener especialidad por ID
exports.getSpecialtyById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query(`SELECT * FROM specialties WHERE id = ?`, [id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Especialidad no encontrada' });
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener especialidad' });
    }
};

// Crear nueva especialidad
exports.createSpecialty = async (req, res) => {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: 'El nombre es obligatorio' });

    try {
        const sql = `
      INSERT INTO specialties (name, description, state, created_at, created_by)
      VALUES (?, ?, 1, NOW(), ?)
    `;
        const [result] = await db.query(sql, [name, description || '', req.user.id]);
        res.status(201).json({ message: 'Especialidad creada', id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: 'Error al crear especialidad' });
    }
};

// Actualizar especialidad
exports.updateSpecialty = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
        const fields = [];
        const values = [];

        if (name !== undefined) { fields.push('name = ?'); values.push(name); }
        if (description !== undefined) { fields.push('description = ?'); values.push(description); }

        if (fields.length === 0) return res.status(400).json({ error: 'Nada para actualizar' });

        fields.push('updated_at = NOW()', 'updated_by = ?');
        values.push(req.user.id, id);

        const sql = `UPDATE specialties SET ${fields.join(', ')} WHERE id = ?`;
        await db.query(sql, values);

        res.json({ message: 'Especialidad actualizada' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al actualizar especialidad' });
    }
};

// Activar/desactivar especialidad
exports.toggleSpecialtyState = async (req, res) => {
    const { id } = req.params;
    const { state } = req.body;
    if (typeof state === 'undefined') return res.status(400).json({ error: 'state requerido' });

    try {
        await db.query(
            'UPDATE specialties SET state = ?, updated_at = NOW(), updated_by = ? WHERE id = ?',
            [state, req.user.id, id]
        );
        res.json({ message: `Especialidad ${state ? 'activada' : 'desactivada'}` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al cambiar estado' });
    }
};
