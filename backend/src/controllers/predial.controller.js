const { dbPredial } = require('../config/db');

// Lugares de producción
const getLugares = (req, res) => {
  dbPredial.query('SELECT * FROM LugarProduccion', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

const createLugar = (req, res) => {
  const { nombre, municipio_id } = req.body;
  dbPredial.query('INSERT INTO LugarProduccion (nombre, municipio_id) VALUES (?, ?)', [nombre, municipio_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ mensaje: 'Lugar creado', id: results.insertId });
  });
};

// Predios
const getPredios = (req, res) => {
  dbPredial.query('SELECT * FROM Predio', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

const createPredio = (req, res) => {
  const { nombre, numRegistroICA, vereda, lugarProduccion_id, propietario_id } = req.body;
  dbPredial.query(
    'INSERT INTO Predio (nombre, numRegistroICA, vereda, lugarProduccion_id, propietario_id) VALUES (?, ?, ?, ?, ?)',
    [nombre, numRegistroICA, vereda, lugarProduccion_id, propietario_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ mensaje: 'Predio creado', id: results.insertId });
    }
  );
};

const deletePredio = (req, res) => {
  const { id } = req.params;
  dbPredial.query('DELETE FROM Predio WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ mensaje: 'Predio eliminado' });
  });
};

// Lotes
const getLotesByPredio = (req, res) => {
  const { id } = req.params;
  dbPredial.query('SELECT * FROM Lote WHERE predio_id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

const createLote = (req, res) => {
  const { nombre, area, estado, predio_id } = req.body;
  dbPredial.query(
    'INSERT INTO Lote (nombre, area, estado, predio_id) VALUES (?, ?, ?, ?)',
    [nombre, area, estado, predio_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ mensaje: 'Lote creado', id: results.insertId });
    }
  );
};

// Cultivos
const getCultivos = (req, res) => {
  dbPredial.query('SELECT * FROM Cultivo', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

module.exports = { getLugares, createLugar, getPredios, createPredio, deletePredio, getLotesByPredio, createLote, getCultivos };