// server/controllers/admin/usersController.js
const db = require('../../config/database');
const bcrypt = require('bcrypt');

// Obtener todos los usuarios
exports.getAllUsers = async (req, res) => {
    try {
        const [rows] = await db.query(`
      SELECT id, name, firstLastName, secondLastName, username, email, role, provider, state, created_at, updated_at
      FROM users
      ORDER BY id DESC
    `);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};

// Obtener usuario por ID
exports.getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query(`
      SELECT id, name, firstLastName, secondLastName, username, email, role, provider, state, created_at, updated_at
      FROM users WHERE id = ?
    `, [id]);

        if (rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener usuario' });
    }
};

// poder Crear usuario
exports.createUser = async (req, res) => {
    const { name, firstLastName, secondLastName, username, email, password, role } = req.body;
    if (!name || !username || !email || !password || !role) {
        return res.status(400).json({ error: 'Campos obligatorios faltantes' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = `
      INSERT INTO users (name, firstLastName, secondLastName, username, email, password, role, provider, state, created_at, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'local', 1, NOW(), ?)
    `;
        const [result] = await db.query(sql, [
            name, firstLastName || '', secondLastName || '',
            username, email, hashedPassword, role, req.user.id
        ]);
        res.status(201).json({ message: 'Usuario creado', id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: 'Error al crear usuario' });
    }
};

// poder editar cada usuario selecionado
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, firstLastName, secondLastName, username, email, password, role, state } = req.body;

    try {
        const fields = [];
        const values = [];

        if (name !== undefined) { fields.push('name = ?'); values.push(name); }
        if (firstLastName !== undefined) { fields.push('firstLastName = ?'); values.push(firstLastName); }
        if (secondLastName !== undefined) { fields.push('secondLastName = ?'); values.push(secondLastName); }
        if (username !== undefined) { fields.push('username = ?'); values.push(username); }
        if (email !== undefined) { fields.push('email = ?'); values.push(email); }
        if (role !== undefined) { fields.push('role = ?'); values.push(role); }
        if (state !== undefined) { fields.push('state = ?'); values.push(state); }

        if (password) {
            const hashed = await bcrypt.hash(password, 10);
            fields.push('password = ?');
            values.push(hashed);
        }

        if (fields.length === 0) return res.status(400).json({ error: 'Nada para actualizar' });

        fields.push('updated_at = NOW()', 'updated_by = ?');
        values.push(req.user.id, id);

        const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
        await db.query(sql, values);

        res.json({ message: 'Usuario actualizado' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al actualizar usuario' });
    }
};

// Activar/desactivar usuario, es el eliminado logico
exports.toggleUserState = async (req, res) => {
    const { id } = req.params;
    const { state } = req.body;
    if (typeof state === 'undefined') return res.status(400).json({ error: 'state requerido' });

    try {
        await db.query('UPDATE users SET state = ?, updated_at = NOW(), updated_by = ? WHERE id = ?', [state, req.user.id, id]);
        res.json({ message: `Usuario ${state ? 'activado' : 'desactivado'}` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al cambiar estado' });
    }
};
