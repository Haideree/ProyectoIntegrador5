const { dbPredial, dbInspecciones } = require('../config/db');

// Lugares de producción
const getLugares = (req, res) => {
  dbPredial.query('SELECT * FROM lugarproduccion', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

const createLugar = (req, res) => {
  const { nombre, municipio_id } = req.body;
  dbPredial.query('INSERT INTO lugarproduccion (nombre, municipio_id) VALUES (?, ?)', [nombre, municipio_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ mensaje: 'Lugar creado', id: results.insertId });
  });
};

// Predios
const getPredios = (req, res) => {
  dbPredial.query('SELECT * FROM predio', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

const createPredio = (req, res) => {
  const { nombre, numRegistroICA, vereda, lugarproduccion_id, propietario_id } = req.body;
  dbPredial.query(
    'INSERT INTO predio (nombre, numRegistroICA, vereda, lugarproduccion_id, propietario_id) VALUES (?, ?, ?, ?, ?)',
    [nombre, numRegistroICA, vereda, lugarproduccion_id, propietario_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ mensaje: 'Predio creado', id: results.insertId });
    }
  );
};

const deletePredio = (req, res) => {
  const { id } = req.params;
  dbPredial.query('DELETE FROM predio WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ mensaje: 'Predio eliminado' });
  });
};

// Lotes
const getLotesByPredio = (req, res) => {
  const { id } = req.params;
  dbPredial.query('SELECT * FROM lote WHERE predio_id = ?', [id], (err, results) => {
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
  dbPredial.query('SELECT * FROM cultivo', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

const getPrediosConRiesgo = (req, res) => {
  dbPredial.query(
    `SELECT p.id, p.nombre, p.vereda,
            lp.nombre AS lugarproduccion,
            lp.municipio_id
     FROM predio p
     JOIN lugarproduccion lp ON p.lugarproduccion_id = lp.id`,
    (err, predios) => {
      if (err) return res.status(500).json({ error: err.message });
      if (predios.length === 0) return res.json([]);

      const predioIds = predios.map(p => p.id);

      dbInspecciones.query(
        `SELECT i.solicitud_id, s.predio_id, i.nivelRiesgo
         FROM inspeccionsanitaria i
         JOIN solicitudinspeccion s ON i.solicitud_id = s.id
         WHERE s.predio_id IN (?)
         ORDER BY i.fechaInspeccion DESC`,
        [predioIds],
        (err, inspecciones) => {
          if (err) return res.status(500).json({ error: err.message });

          const resultado = predios.map(p => {
            const ultimaInsp = inspecciones.find(i => i.predio_id === p.id);
            return {
              ...p,
              nivelRiesgo: ultimaInsp?.nivelRiesgo || 'bajo',
            };
          });

          res.json(resultado);
        }
      );
    }
  );
};

module.exports = { getLugares, createLugar, getPredios, createPredio, deletePredio, getLotesByPredio, createLote, getCultivos,
  getPrediosConRiesgo
 };