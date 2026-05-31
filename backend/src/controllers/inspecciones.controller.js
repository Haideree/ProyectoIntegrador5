const { dbUsuarios, dbGeografico, dbPredial, dbInspecciones } = require('../config/db');

// Solicitudes de inspección
const getSolicitudes = (req, res) => {
  dbInspecciones.query('SELECT * FROM solicitudinspeccion', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

const getSolicitudById = (req, res) => {
  const { id } = req.params;
  dbInspecciones.query('SELECT * FROM solicitudinspeccion WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ mensaje: 'Solicitud no encontrada' });
    res.json(results[0]);
  });
};


const updateSolicitudEstado = (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  dbInspecciones.query('UPDATE solicitudinspeccion SET estado = ? WHERE id = ?', [estado, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ mensaje: 'Estado actualizado' });
  });
};

const getInspecciones = (req, res) => {
  dbInspecciones.query('SELECT * FROM inspeccionsanitaria', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

const createInspeccion = (req, res) => {
  const { fechaInspeccion, observaciones, resultado, tecnico_id, solicitud_id } = req.body;
  dbInspecciones.query(
    'INSERT INTO inspeccionsanitaria (fechaInspeccion, observaciones, resultado, tecnico_id, solicitud_id) VALUES (?, ?, ?, ?, ?)',
    [fechaInspeccion, observaciones, resultado, tecnico_id, solicitud_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ mensaje: 'Inspección creada', id: results.insertId });
    }
  );
};

const getInspeccionesByTecnico = (req, res) => {
  const { tecnico_id } = req.params;

  dbInspecciones.query(
    `SELECT i.*, s.fechaSolicitud, s.estado, s.productor_id, s.predio_id
 FROM inspeccionsanitaria i
 JOIN solicitudinspeccion s ON i.solicitud_id = s.id
 WHERE i.tecnico_id = ?`,
    [tecnico_id],
    (err, inspecciones) => {
      if (err) return res.status(500).json({ error: err.message });
      if (inspecciones.length === 0) return res.json([]);

      const predioIds = inspecciones.map(i => i.predio_id);

      dbPredial.query(
        `SELECT p.id, p.nombre, p.vereda, lp.nombre AS lugarproduccion, lp.municipio_id
         FROM predio p
         JOIN lugarproduccion lp ON p.lugarproduccion_id = lp.id
         WHERE p.id IN (?)`,
        [predioIds],
        (err, predios) => {
          if (err) return res.status(500).json({ error: err.message });

          const municipioIds = predios.map(p => p.municipio_id).filter(Boolean);


          dbGeografico.query(
            `SELECT m.id, m.nombre AS municipio, d.nombre AS departamento
             FROM municipio m
             JOIN departamento d ON m.departamento_id = d.id
             WHERE m.id IN (?)`,
            [municipioIds.length ? municipioIds : [0]],
            (err, municipios) => {
              if (err) return res.status(500).json({ error: err.message });

dbPredial.query(
  `SELECT DISTINCT l.predio_id, c.nombre AS cultivo
   FROM lote l
   JOIN lote_cultivo lc ON l.id = lc.lote_id
   JOIN cultivo c ON lc.cultivo_id = c.id
   WHERE l.predio_id IN (?)`,
  [predioIds],
  (err, cultivos) => {
    if (err) return res.status(500).json({ error: err.message });

    const resultado = inspecciones.map(insp => {
      const predio = predios.find(p => p.id === insp.predio_id) || {};
      const municipio = municipios.find(m => m.id === predio.municipio_id) || {};
      const cultivosDelPredio = [...new Set(
        cultivos
          .filter(c => c.predio_id === insp.predio_id)
          .map(c => c.cultivo)
      )].join(', ');

      return {
        ...insp,
        lugar: predio.nombre || 'Sin nombre',
        vereda: predio.vereda || '',
        lugarproduccion: predio.lugarproduccion || '',
        municipio: municipio.municipio || '',
        departamento: municipio.departamento || '',
        ubicacion: `${municipio.departamento || ''}/${municipio.municipio || ''}/${predio.vereda || ''}`,
        cultivos: cultivosDelPredio || 'Sin cultivos',
      };
    });

    const productorIds = [...new Set(inspecciones.map(i => i.productor_id))];

    dbUsuarios.query(
      `SELECT id, nombre FROM usuario WHERE id IN (?)`,
      [productorIds],
      (err, productores) => {
        if (err) return res.status(500).json({ error: err.message });

        const resultadoFinal = resultado.map(insp => {
          const productor = productores.find(p => p.id === insp.productor_id) || {};
          return {
            ...insp,
            nombreProductor: productor.nombre || 'Sin nombre',
          };
        });

        res.json(resultadoFinal);
      }
    );
  }
);
            }
          );
        }
      );
    }
  );
};

const updateInspeccion = (req, res) => {
  const { id } = req.params;
  const { fechaInspeccion, fechaFin, observaciones, resultado, plagaDetectada, nivelRiesgo, cantidadPlantas, estadoFitosanitario } = req.body;
  
  dbInspecciones.query(
    'UPDATE inspeccionsanitaria SET fechaInspeccion = ?, fechaFin = ?, observaciones = ?, resultado = ?, plagaDetectada = ?, nivelRiesgo = ?, cantidadPlantas = ?, estadoFitosanitario = ? WHERE id = ?',
    [fechaInspeccion, fechaFin, observaciones, resultado, plagaDetectada, nivelRiesgo, cantidadPlantas, estadoFitosanitario, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      
      if (resultado === 'Completada') {
        dbInspecciones.query(
          'UPDATE solicitudinspeccion SET estado = ? WHERE id = (SELECT solicitud_id FROM inspeccionsanitaria WHERE id = ?)',
          ['completada', id],
          (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ mensaje: 'Inspección actualizada' });
          }
        );
      } else {
        res.json({ mensaje: 'Inspección actualizada' });
      }
    }
  );
};

const getLotesByPredio = (req, res) => {
  const { predio_id } = req.params;
  dbPredial.query(
    `SELECT l.id, l.nombre, l.area, l.estado, 
     GROUP_CONCAT(c.nombre SEPARATOR ', ') AS cultivos
     FROM lote l
     LEFT JOIN lote_cultivo lc ON l.id = lc.lote_id
     LEFT JOIN cultivo c ON lc.cultivo_id = c.id
     WHERE l.predio_id = ?
     GROUP BY l.id`,
    [predio_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
};

const getSolicitudesCompletas = (req, res) => {
  dbInspecciones.query(
    `SELECT s.*, 
     i.id AS inspeccion_id, i.tecnico_id, i.resultado
     FROM solicitudinspeccion s
     LEFT JOIN inspeccionsanitaria i ON i.solicitud_id = s.id
     ORDER BY s.fechaSolicitud DESC`,
    (err, solicitudes) => {
      if (err) return res.status(500).json({ error: err.message });
      if (solicitudes.length === 0) return res.json([]);

      const predioIds = [...new Set(solicitudes.map(s => s.predio_id))];
      const productorIds = [...new Set(solicitudes.map(s => s.productor_id))];
      const tecnicoIds = [...new Set(solicitudes.map(s => s.tecnico_id).filter(Boolean))];

      dbPredial.query(
        `SELECT p.id, p.nombre, p.vereda, lp.nombre AS lugarproduccion, lp.municipio_id
         FROM predio p
         JOIN lugarproduccion lp ON p.lugarproduccion_id = lp.id
         WHERE p.id IN (?)`,
        [predioIds],
        (err, predios) => {
          if (err) return res.status(500).json({ error: err.message });

          const municipioIds = predios.map(p => p.municipio_id).filter(Boolean);

          dbGeografico.query(
  `SELECT m.id, m.nombre AS municipio, d.nombre AS departamento
   FROM municipio m
   JOIN departamento d ON m.departamento_id = d.id
   WHERE m.id IN (?)`,
  [municipioIds.length ? municipioIds : [0]],
  (err, municipios) => {
    if (err) return res.status(500).json({ error: err.message });

              dbPredial.query(
                `SELECT DISTINCT l.predio_id, c.nombre AS cultivo
                 FROM lote l
                 JOIN lote_cultivo lc ON l.id = lc.lote_id
                 JOIN cultivo c ON lc.cultivo_id = c.id
                 WHERE l.predio_id IN (?)`,
                [predioIds],
                (err, cultivos) => {
                  if (err) return res.status(500).json({ error: err.message });

                  dbUsuarios.query(
                    `SELECT id, nombre, correo, telefono FROM usuario WHERE id IN (?)`,
                    [productorIds],
                    (err, productores) => {
                      if (err) return res.status(500).json({ error: err.message });

                      if (tecnicoIds.length === 0) {
                        const resultado = solicitudes.map(s => {
                          const predio = predios.find(p => p.id === s.predio_id) || {};
                          const municipio = municipios.find(m => m.id === predio.municipio_id) || {};
                          const productor = productores.find(p => p.id === s.productor_id) || {};
                          const cultivosDelPredio = [...new Set(cultivos.filter(c => c.predio_id === s.predio_id).map(c => c.cultivo))].join(', ');
                          return {
                            ...s,
                            predio: predio.nombre || 'Sin nombre',
                            vereda: predio.vereda || '',
                            municipio: municipio.municipio || '',
                            departamento: municipio.departamento || '',
                            cultivos: cultivosDelPredio || 'Sin cultivos',
                            tecnicoAsignado: null,
                            productor: { nombre: productor.nombre || '', correo: productor.correo || '', telefono: productor.telefono || '' }
                          };
                        });
                        return res.json(resultado);
                      }

                      dbUsuarios.query(
                        `SELECT id, nombre FROM usuario WHERE id IN (?)`,
                        [tecnicoIds],
                        (err, tecnicos) => {
                          if (err) return res.status(500).json({ error: err.message });

                          const resultado = solicitudes.map(s => {
                            const predio = predios.find(p => p.id === s.predio_id) || {};
                            const municipio = municipios.find(m => m.id === predio.municipio_id) || {};
                            const productor = productores.find(p => p.id === s.productor_id) || {};
                            const tecnico = tecnicos.find(t => t.id === s.tecnico_id) || {};
                            const cultivosDelPredio = [...new Set(cultivos.filter(c => c.predio_id === s.predio_id).map(c => c.cultivo))].join(', ');
                            return {
                              ...s,
                              predio: predio.nombre || 'Sin nombre',
                              vereda: predio.vereda || '',
                              municipio: municipio.municipio || '',
                              departamento: municipio.departamento || '',
                              cultivos: cultivosDelPredio || 'Sin cultivos',
                              tecnicoAsignado: tecnico.nombre || null,
                              productor: { nombre: productor.nombre || '', correo: productor.correo || '', telefono: productor.telefono || '' }
                            };
                          });
                          res.json(resultado);
                        }
                      );
                    }
                  );
                }
              );
            }
          );
        }
      );
    }
  );
};

const getPrediosByProductor = (req, res) => {
  const { productor_id } = req.params;
  dbPredial.query(
    `SELECT p.id, p.nombre, p.numRegistroICA, p.vereda, 
            lp.nombre as lugarproduccion
     FROM predio p
     JOIN lugarproduccion lp ON p.lugarproduccion_id = lp.id
     WHERE p.propietario_id = ?`,
    [productor_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
};


// Crear solicitud de inspección
const createSolicitud = (req, res) => {
  const { productor_id, predio_id, fechaSolicitud, observaciones } = req.body;
  if (!productor_id || !predio_id || !fechaSolicitud) {
    return res.status(400).json({ mensaje: 'Faltan campos requeridos' });
  }
  dbInspecciones.query(
    `INSERT INTO solicitudinspeccion (fechaSolicitud, estado, productor_id, predio_id, observaciones) 
     VALUES (?, 'pendiente', ?, ?, ?)`,
    [fechaSolicitud, productor_id, predio_id, observaciones || ''],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ mensaje: 'Solicitud creada', id: results.insertId });
    }
  );
};

// Obtener solicitudes de un productor
const getSolicitudesByProductor = (req, res) => {
  const { productor_id } = req.params;
  dbInspecciones.query(
    `SELECT s.*, 
            i.id AS inspeccion_id,
            i.observaciones AS observacionesInspeccion,
            i.resultado,
            i.nivelRiesgo,
            i.estadoFitosanitario,
            i.plagaDetectada,
            i.fechaInspeccion
     FROM solicitudinspeccion s
     LEFT JOIN inspeccionsanitaria i ON i.solicitud_id = s.id
     WHERE s.productor_id = ? 
     ORDER BY s.fechaSolicitud DESC`,
    [productor_id],
    (err, solicitudes) => {
      if (err) return res.status(500).json({ error: err.message });
      if (solicitudes.length === 0) return res.json([]);

      const predioIds = [...new Set(solicitudes.map(s => s.predio_id))];

      dbPredial.query(
        `SELECT p.id, p.nombre, lp.nombre AS lugarproduccion
         FROM predio p
         JOIN lugarproduccion lp ON p.lugarproduccion_id = lp.id
         WHERE p.id IN (?)`,
        [predioIds],
        (err, predios) => {
          if (err) return res.status(500).json({ error: err.message });

          dbPredial.query(
            `SELECT l.id, l.nombre, l.area, l.estado, l.predio_id,
             GROUP_CONCAT(c.nombre SEPARATOR ', ') AS cultivos
             FROM lote l
             LEFT JOIN lote_cultivo lc ON l.id = lc.lote_id
             LEFT JOIN cultivo c ON lc.cultivo_id = c.id
             WHERE l.predio_id IN (?)
             GROUP BY l.id`,
            [predioIds],
            (err, lotes) => {
              if (err) return res.status(500).json({ error: err.message });

              const resultado = solicitudes.map(s => {
                const predio = predios.find(p => p.id === s.predio_id) || {};
                const lotesDelPredio = lotes.filter(l => l.predio_id === s.predio_id);
                return {
                  ...s,
                  nombrePredio: predio.nombre || `Predio #${s.predio_id}`,
                  lugarproduccion: predio.lugarproduccion || '',
                  lotes: lotesDelPredio
                };
              });

              res.json(resultado);
            }
          );
        }
      );
    }
  );
};

const createInspeccionLotes = (req, res) => {
  const { inspeccion_id, lotes } = req.body;
  if (!lotes?.length) return res.json({ mensaje: 'Sin lotes' });

 const valores = lotes.map(l => [
  inspeccion_id,
  l.lote_id,
  l.observaciones || '',
  l.plagasDetectadas || '',
  l.cantidadPlantas || null
]);

dbInspecciones.query(
  'INSERT INTO inspeccion_lote (inspeccion_id, lote_id, observaciones, plagasDetectadas, cantidadPlantas) VALUES ?',
  [valores],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ mensaje: 'Lotes guardados' });
    }
  );
};

const getInspeccionLotes = (req, res) => {
  const { inspeccion_id } = req.params;
  dbInspecciones.query(
    'SELECT * FROM inspeccion_lote WHERE inspeccion_id = ?',
    [inspeccion_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.json([]);

      const loteIds = results.map(r => r.lote_id);

      dbPredial.query(
        'SELECT id, nombre FROM lote WHERE id IN (?)',
        [loteIds],
        (err, lotes) => {
          if (err) return res.status(500).json({ error: err.message });

          const enriquecidos = results.map(r => {
            const lote = lotes.find(l => l.id === r.lote_id) || {};
            return { ...r, nombreLote: lote.nombre || `Lote #${r.lote_id}` };
          });

          res.json(enriquecidos);
        }
      );
    }
  );
};

const guardarProgreso = (req, res) => {
  const { inspeccion_id } = req.params;
  const { datos } = req.body;
  
  dbInspecciones.query(
    `INSERT INTO inspeccion_progreso (inspeccion_id, datos) VALUES (?, ?)
     ON DUPLICATE KEY UPDATE datos = ?, ultima_actualizacion = CURRENT_TIMESTAMP`,
    [inspeccion_id, JSON.stringify(datos), JSON.stringify(datos)],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ mensaje: 'Progreso guardado' });
    }
  );
};

const getProgreso = (req, res) => {
  const { inspeccion_id } = req.params;
  dbInspecciones.query(
    'SELECT * FROM inspeccion_progreso WHERE inspeccion_id = ?',
    [inspeccion_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.json(null);
      
      const row = results[0];
      // MySQL puede devolver datos ya como objeto o como string según la versión
      const datos = typeof row.datos === 'string' ? JSON.parse(row.datos) : row.datos;
      
      res.json({ ...row, datos });
    }
  );
};

const eliminarProgreso = (req, res) => {
  const { inspeccion_id } = req.params;
  dbInspecciones.query(
    'DELETE FROM inspeccion_progreso WHERE inspeccion_id = ?',
    [inspeccion_id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ mensaje: 'Progreso eliminado' });
    }
  );
};

module.exports = { 
  getSolicitudes, getSolicitudById, createSolicitud, updateSolicitudEstado, 
  getInspecciones, createInspeccion, getInspeccionesByTecnico, updateInspeccion, 
  getLotesByPredio, getSolicitudesCompletas, getSolicitudesByProductor, 
  getPrediosByProductor, createInspeccionLotes, getInspeccionLotes,
  guardarProgreso, getProgreso, eliminarProgreso  
};
