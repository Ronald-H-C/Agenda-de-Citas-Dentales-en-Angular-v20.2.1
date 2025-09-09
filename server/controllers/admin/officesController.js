const db = require('../../config/database');

// 📌 Obtener todas las oficinas
exports.getAllOffices = async (req, res) => {
    try {
        const [rows] = await db.query(`
      SELECT id, name, location, description, state, created_at, updated_at
      FROM offices
      ORDER BY id DESC
    `);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener oficinas' });
    }
};

// 📌 Obtener oficina por ID
exports.getOfficeById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query(`
      SELECT id, name, location, description, state, created_at, updated_at
      FROM offices WHERE id = ?
    `, [id]);

        if (rows.length === 0) return res.status(404).json({ error: 'Oficina no encontrada' });
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener oficina' });
    }
};

// 📌 Crear nueva oficina
exports.createOffice = async (req, res) => {
    const { name, location, description } = req.body;
    if (!name) return res.status(400).json({ error: 'El nombre es obligatorio' });

    try {
        const sql = `
      INSERT INTO offices (name, location, description, state, created_at, created_by)
      VALUES (?, ?, ?, 1, NOW(), ?)
    `;
        const [result] = await db.query(sql, [name, location || '', description || '', req.user.id]);

        res.status(201).json({ message: 'Oficina creada', id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: 'Error al crear oficina' });
    }
};

// 📌 Actualizar oficina
exports.updateOffice = async (req, res) => {
    const { id } = req.params;
    const { name, location, description, state } = req.body;

    try {
        const fields = [];
        const values = [];

        if (name !== undefined) { fields.push('name = ?'); values.push(name); }
        if (location !== undefined) { fields.push('location = ?'); values.push(location); }
        if (description !== undefined) { fields.push('description = ?'); values.push(description); }
        if (state !== undefined) { fields.push('state = ?'); values.push(state); }

        if (fields.length === 0) return res.status(400).json({ error: 'Nada para actualizar' });

        fields.push('updated_at = NOW()', 'updated_by = ?');
        values.push(req.user.id, id);

        const sql = `UPDATE offices SET ${fields.join(', ')} WHERE id = ?`;
        await db.query(sql, values);

        res.json({ message: 'Oficina actualizada' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al actualizar oficina' });
    }
};

// 📌 Cambiar estado (activar/desactivar)
exports.toggleOfficeState = async (req, res) => {
    const { id } = req.params;
    const { state } = req.body;
    if (typeof state === 'undefined') return res.status(400).json({ error: 'state requerido' });

    try {
        await db.query(
            'UPDATE offices SET state = ?, updated_at = NOW(), updated_by = ? WHERE id = ?',
            [state, req.user.id, id]
        );
        res.json({ message: `Oficina ${state ? 'activada' : 'desactivada'}` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al cambiar estado de oficina' });
    }
};
