const db = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Obtener todos los usuarios
exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, name, firstLastName, secondLastName, username, email, role FROM users'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

// Registro manual
exports.registerUser = async (req, res) => {
  const { name, firstLastName, secondLastName, username, email, password } = req.body;
  if (!name || !email || !username || !password) {
    return res.status(400).json({ error: 'Campos obligatorios faltantes' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = `
      INSERT INTO users (name, firstLastName, secondLastName, username, email, password)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await db.query(sql, [name, firstLastName, secondLastName, username, email, hashedPassword]);

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error al registrar usuario. Verifica datos.' });
  }
};

// Login manual
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [results] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (results.length === 0) return res.status(401).json({ error: 'Credenciales inválidas' });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Login con Google
exports.loginWithGoogle = async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) return res.status(400).json({ error: 'Falta el token de Google' });

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: [
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_ANDROID_CLIENT_ID
      ]
    });

    const payload = ticket.getPayload();
    const { email, name, email_verified } = payload;

    if (!email_verified) {
      return res.status(403).json({ error: 'Correo no verificado por Google' });
    }

    const [results] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    let user;
    if (results.length === 0) {
      const [result] = await db.query(
        `INSERT INTO users (name, email, provider, email_verified_at) VALUES (?, ?, 'google', NOW())`,
        [name, email]
      );
      user = { id: result.insertId, name, email, provider: 'google' };
    } else {
      user = results[0];
    }

    const tokenJwt = jwt.sign(
      { id: user.id, email: user.email, role: user.role || 'patient' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token: tokenJwt, user });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(401).json({ error: 'Token de Google inválido' });
  }
};
