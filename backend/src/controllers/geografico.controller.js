const { dbGeografico } = require('../config/db');

// Departamentos
const getDepartamentos = (req, res) => {
  dbGeografico.query('SELECT * FROM Departamento', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

const createDepartamento = (req, res) => {
  const { nombre } = req.body;
  dbGeografico.query('INSERT INTO Departamento (nombre) VALUES (?)', [nombre], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ mensaje: 'Departamento creado', id: results.insertId });
  });
};

// Municipios
const getMunicipios = (req, res) => {
  dbGeografico.query('SELECT * FROM Municipio', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

const getMunicipiosByDepartamento = (req, res) => {
  const { id } = req.params;
  dbGeografico.query('SELECT * FROM Municipio WHERE departamento_id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

const createMunicipio = (req, res) => {
  const { nombre, departamento_id } = req.body;
  dbGeografico.query('INSERT INTO Municipio (nombre, departamento_id) VALUES (?, ?)', [nombre, departamento_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ mensaje: 'Municipio creado', id: results.insertId });
  });
};

module.exports = { getDepartamentos, createDepartamento, getMunicipios, getMunicipiosByDepartamento, createMunicipio };