const { dbUsuarios } = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'clave_secreta';

// Obtener todos los usuarios
const getUsuarios = (req, res) => {
  dbUsuarios.query(
    `SELECT u.id, u.numeroDocumento, u.nombre, u.correo, u.telefono, u.tarjetaProfesional, r.nombre AS rol 
     FROM usuario u
     LEFT JOIN usuariorol ur ON u.id = ur.usuario_id
     LEFT JOIN rol r ON ur.rol_id = r.id`,
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
};

// Obtener un usuario por ID
const getUsuarioById = (req, res) => {
  const { id } = req.params;
  dbUsuarios.query('SELECT * FROM usuario WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json(results[0]);
  });
};

// Crear usuario (productor desde registro público)
const createUsuario = (req, res) => {
  const { numeroDocumento, nombre, correo, contrasena, telefono } = req.body;

  bcrypt.hash(contrasena, 10, (err, hash) => {
    if (err) return res.status(500).json({ error: 'Error al hashear contraseña' });

    dbUsuarios.query(
      'INSERT INTO usuario (numeroDocumento, nombre, correo, contrasena, telefono) VALUES (?, ?, ?, ?, ?)',
      [numeroDocumento, nombre, correo, hash, telefono],
      (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        const nuevoId = results.insertId;
        dbUsuarios.query(
          'INSERT INTO usuariorol (usuario_id, rol_id) VALUES (?, ?)',
          [nuevoId, 2],
          (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ mensaje: 'Usuario creado', id: nuevoId });
          }
        );
      }
    );
  });
};

// Login
const loginUsuario = (req, res) => {
  const { correo, contrasena } = req.body;

  const query = `
    SELECT u.*, r.nombre AS rol
    FROM usuario u
    LEFT JOIN usuariorol ur ON u.id = ur.usuario_id
    LEFT JOIN rol r ON ur.rol_id = r.id
    WHERE u.correo = ?
  `;

  dbUsuarios.query(query, [correo], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos' });

    const usuario = results[0];

    bcrypt.compare(contrasena, usuario.contrasena, (err, match) => {
      if (err || !match) return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos' });

      const token = jwt.sign(
        { id: usuario.id, correo: usuario.correo, rol: usuario.rol },
        SECRET_KEY,
        { expiresIn: '8h' }
      );

      res.json({
        mensaje: 'Login exitoso',
        token,
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          correo: usuario.correo,
          rol: usuario.rol
        }
      });
    });
  });
};

// Eliminar usuario
const deleteUsuario = (req, res) => {
  const { id } = req.params;

  dbUsuarios.query('DELETE FROM usuariorol WHERE usuario_id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });

    dbUsuarios.query('DELETE FROM usuario WHERE id = ?', [id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ mensaje: 'Usuario eliminado' });
    });
  });
};

// Actualizar usuario
const updateUsuario = (req, res) => {
  const { id } = req.params;
  const { nombre, correo, telefono, numeroDocumento, tarjetaProfesional } = req.body;

  dbUsuarios.query(
    'UPDATE usuario SET nombre=?, correo=?, telefono=?, numeroDocumento=?, tarjetaProfesional=? WHERE id=?',
    [nombre, correo, telefono, numeroDocumento, tarjetaProfesional || null, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ mensaje: 'Usuario actualizado' });
    }
  );
};

// Crear usuario con rol (técnico o admin desde el panel)
const createUsuarioConRol = (req, res) => {
  const { numeroDocumento, nombre, correo, contrasena, telefono, rol_id, tarjetaProfesional } = req.body;

  bcrypt.hash(contrasena, 10, (err, hash) => {
    if (err) return res.status(500).json({ error: 'Error al hashear contraseña' });

    dbUsuarios.query(
      'INSERT INTO usuario (numeroDocumento, nombre, correo, contrasena, telefono, tarjetaProfesional) VALUES (?, ?, ?, ?, ?, ?)',
      [numeroDocumento, nombre, correo, hash, telefono, tarjetaProfesional || null],
      (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        const nuevoId = results.insertId;

        dbUsuarios.query(
          'INSERT INTO usuariorol (usuario_id, rol_id) VALUES (?, ?)',
          [nuevoId, rol_id],
          (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ mensaje: 'Usuario creado', id: nuevoId });
          }
        );
      }
    );
  });
};

module.exports = { getUsuarios, getUsuarioById, createUsuario, loginUsuario, deleteUsuario, updateUsuario, createUsuarioConRol };