const { dbPredial, dbInspecciones } = require("../config/db");

const query = (sql, params = []) =>
    new Promise((resolve, reject) =>
        dbPredial.query(sql, params, (err, results) =>
            err ? reject(err) : resolve(results)
        )
    );

const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// =============================================================================
// LUGAR DE PRODUCCIÓN
// =============================================================================

const getLugares = asyncHandler(async (req, res) => {
    const productorId = req.query.productor_id;

    const lugares = productorId
        ? await query(
            `SELECT lp.*, COUNT(p.id) AS predios
             FROM lugarproduccion lp
             LEFT JOIN predio p ON p.lugarproduccion_id = lp.id
             WHERE lp.productor_id = ?
             GROUP BY lp.id`,
            [productorId]
          )
        : await query(
            `SELECT lp.*, COUNT(p.id) AS predios
             FROM lugarproduccion lp
             LEFT JOIN predio p ON p.lugarproduccion_id = lp.id
             GROUP BY lp.id`
          );
          console.log("lugar raw:", JSON.stringify(lugares[0]));
    for (const lugar of lugares) {
        lugar.cultivos = await query(
            `SELECT c.id, c.nombre FROM cultivo c
             JOIN lugarproduccion_cultivo lc ON c.id = lc.cultivo_id
             WHERE lc.lugarproduccion_id = ?`,
            [lugar.id]
        );

        // Paso 1: trae los predio_ids del lugar
        const prediosLugar = await query(
            `SELECT id FROM predio WHERE lugarproduccion_id = ?`,
            [lugar.id]
        );
        const predioIds = prediosLugar.map(p => p.id);

        // Paso 2: consulta inspecciones en dbInspecciones
        if (predioIds.length > 0) {
            lugar.nivelesRiesgo = await new Promise((resolve, reject) =>
    dbInspecciones.query(
        `SELECT i.nivelRiesgo
         FROM inspeccionsanitaria i
         JOIN solicitudinspeccion s ON i.solicitud_id = s.id
         WHERE s.predio_id IN (?)
         AND i.nivelRiesgo IS NOT NULL 
         AND i.nivelRiesgo != ''
         ORDER BY i.fechaInspeccion DESC`,
        [predioIds],
        (err, results) => err ? reject(err) : resolve(results)
    )
);
        } else {
            lugar.nivelesRiesgo = [];
        }
    }
    res.json(lugares);
});



const getLugarById = asyncHandler(async (req, res) => {
    const rows = await query("SELECT * FROM lugarproduccion WHERE id = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ mensaje: "Lugar no encontrado" });

    const lugar = rows[0];

    lugar.cultivos = await query(
        `SELECT c.id, c.nombre FROM cultivo c
         JOIN lugarproduccion_cultivo lc ON c.id = lc.cultivo_id
         WHERE lc.lugarproduccion_id = ?`,
        [lugar.id]
    );

    lugar.predios = await query(
        `SELECT id, nombre, area, vereda FROM predio WHERE lugarproduccion_id = ?`,
        [lugar.id]
    );

    lugar.numeroPredios = lugar.predios.length;

    res.json(lugar);
});

const createLugar = asyncHandler(async (req, res) => {
    const { nombre, municipio_id, vereda, departamento, municipio, cultivos, productor_id } = req.body;

    // Genera numRegistroICA único para el lugar
    const anio = new Date().getFullYear();
    const rows = await query(
        `SELECT numRegistroICA FROM lugarproduccion 
         WHERE numRegistroICA LIKE ? 
         ORDER BY numRegistroICA DESC LIMIT 1`,
        [`LP-${anio}-%`]
    );
    let siguiente = 1;
    if (rows.length > 0) {
        const ultimo = rows[0].numRegistroICA;
        const partes = ultimo.split("-");
        siguiente = parseInt(partes[2]) + 1;
    }
    const numRegistroICA = `LP-${anio}-${String(siguiente).padStart(4, "0")}`;

    const result = await query(
        `INSERT INTO lugarproduccion (nombre, municipio_id, vereda, departamento, municipio, productor_id, numRegistroICA)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [nombre, municipio_id, vereda, departamento, municipio, productor_id, numRegistroICA]
    );
    const lugarId = result.insertId;

    if (Array.isArray(cultivos) && cultivos.length) {
        for (const cultivoId of cultivos) {
            await query(
                "INSERT INTO lugarproduccion_cultivo (lugarproduccion_id, cultivo_id) VALUES (?, ?)",
                [lugarId, cultivoId]
            );
        }
    }
    res.status(201).json({ mensaje: "Lugar creado", id: lugarId });
});

const updateLugar = asyncHandler(async (req, res) => {
    const { nombre, municipio_id, vereda, departamento, municipio, cultivos } = req.body;

    const result = await query(
        `UPDATE lugarproduccion
         SET nombre=?, municipio_id=?, vereda=?, departamento=?, municipio=?
         WHERE id=?`,
        [nombre, municipio_id, vereda, departamento, municipio, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ mensaje: "Lugar no encontrado" });

    if (Array.isArray(cultivos)) {
        await query("DELETE FROM lugarproduccion_cultivo WHERE lugarproduccion_id = ?", [req.params.id]);
        for (const cultivoId of cultivos) {
            await query(
                "INSERT INTO lugarproduccion_cultivo (lugarproduccion_id, cultivo_id) VALUES (?, ?)",
                [req.params.id, cultivoId]
            );
        }
    }

    res.json({ mensaje: "Lugar actualizado" });
});

const deleteLugar = asyncHandler(async (req, res) => {
    const result = await query("DELETE FROM lugarproduccion WHERE id = ?", [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ mensaje: "Lugar no encontrado" });
    res.json({ mensaje: "Lugar eliminado" });
});

// =============================================================================
// PREDIOS
// =============================================================================

const getPredios = asyncHandler(async (req, res) => {
    const propietarioId = req.query.propietario_id;

    const predios = propietarioId
        ? await query(
            `SELECT p.*, lp.nombre AS lugarNombre, lp.departamento, lp.municipio
             FROM predio p
             JOIN lugarproduccion lp ON p.lugarproduccion_id = lp.id
             WHERE p.propietario_id = ?`,
            [propietarioId]
          )
        : await query(
            `SELECT p.*, lp.nombre AS lugarNombre, lp.departamento, lp.municipio
             FROM predio p
             JOIN lugarproduccion lp ON p.lugarproduccion_id = lp.id`
          );

    for (const predio of predios) {
        predio.cultivos = await query(
            `SELECT c.id, c.nombre FROM cultivo c
             JOIN predio_cultivo pc ON c.id = pc.cultivo_id
             WHERE pc.predio_id = ?`,
            [predio.id]
        );
    }
    console.log("primer predio raw:", JSON.stringify(predios[0]));
    res.json(predios);
});

const getPredioById = asyncHandler(async (req, res) => {
    const rows = await query(
        `SELECT p.*, lp.nombre AS lugarNombre, lp.departamento, lp.municipio
         FROM predio p
         JOIN lugarproduccion lp ON p.lugarproduccion_id = lp.id
         WHERE p.id = ?`,
        [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ mensaje: "Predio no encontrado" });

    const predio = rows[0];
    predio.cultivos = await query(
        `SELECT c.id, c.nombre FROM cultivo c
         JOIN predio_cultivo pc ON c.id = pc.cultivo_id
         WHERE pc.predio_id = ?`,
        [predio.id]
    );

    res.json(predio);
});

const createPredio = asyncHandler(async (req, res) => {
    let {
        nombre, numRegistroICA, vereda,
        lugarProduccion_id, lugarproduccion_id,
        propietario_id, area, cultivos,
    } = req.body;

    const lugarId = lugarProduccion_id || lugarproduccion_id;

    // ← NUEVO: genera matrícula automática si no viene
    if (!numRegistroICA) {
        const anio = new Date().getFullYear();
        const rows = await query(
            `SELECT numRegistroICA FROM predio 
             WHERE numRegistroICA LIKE ? 
             ORDER BY numRegistroICA DESC LIMIT 1`,
            [`ICA-${anio}-%`]
        );
        let siguiente = 1;
        if (rows.length > 0) {
            const ultimo = rows[0].numRegistroICA; // "ICA-2026-0007"
            const partes = ultimo.split("-");
            siguiente = parseInt(partes[2]) + 1;
        }
        numRegistroICA = `ICA-${anio}-${String(siguiente).padStart(4, "0")}`;
    }

    const result = await query(
        `INSERT INTO predio (nombre, numRegistroICA, vereda, lugarproduccion_id, propietario_id, area)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [nombre, numRegistroICA, vereda, lugarId, propietario_id, area]
    );

    const predioId = result.insertId;

    if (Array.isArray(cultivos) && cultivos.length) {
        for (const cultivoId of cultivos) {
            await query(
                "INSERT INTO predio_cultivo (predio_id, cultivo_id) VALUES (?, ?)",
                [predioId, cultivoId]
            );
        }
    }

    res.status(201).json({ mensaje: "Predio creado", id: predioId });
});

const updatePredio = asyncHandler(async (req, res) => {
    const {
        nombre, numRegistroICA, vereda,
        lugarProduccion_id, lugarproduccion_id,
        propietario_id, area, cultivos,
    } = req.body;

    const lugarId = lugarProduccion_id || lugarproduccion_id;
    console.log("updatePredio - lugarId:", lugarId); // ← agrega esto
    console.log("updatePredio - body:", req.body);   // ← y esto

    const result = await query(
        `UPDATE predio
         SET nombre=?, numRegistroICA=?, vereda=?, lugarproduccion_id=?,
             propietario_id=?, area=?
         WHERE id=?`,
        [nombre, numRegistroICA, vereda, lugarId, propietario_id, area, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ mensaje: "Predio no encontrado" });

    if (Array.isArray(cultivos)) {
        await query("DELETE FROM predio_cultivo WHERE predio_id = ?", [req.params.id]);
        for (const cultivoId of cultivos) {
            await query(
                "INSERT INTO predio_cultivo (predio_id, cultivo_id) VALUES (?, ?)",
                [req.params.id, cultivoId]
            );
        }
    }

    res.json({ mensaje: "Predio actualizado" });
});

const deletePredio = asyncHandler(async (req, res) => {
    const result = await query("DELETE FROM predio WHERE id = ?", [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ mensaje: "Predio no encontrado" });
    res.json({ mensaje: "Predio eliminado" });
});

// =============================================================================
// LOTES
// =============================================================================

const getLotesByLugarProduccion = asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const sql = id === 0
        ? "SELECT * FROM lote"
        : `SELECT lote.* FROM lote
           INNER JOIN predio ON lote.predio_id = predio.id
           WHERE predio.lugarproduccion_id = ?`;
    const lotes = await query(sql, id === 0 ? [] : [id]);

    for (const lote of lotes) {
        lote.cultivos = await query(
            `SELECT c.id, c.nombre FROM cultivo c
             JOIN lote_cultivo lc ON c.id = lc.cultivo_id
             WHERE lc.lote_id = ?`,
            [lote.id]
        );
    }

    res.json(lotes);
});

const getLotesByPredio = asyncHandler(async (req, res) => {
    const lotes = await query("SELECT * FROM lote WHERE predio_id = ?", [req.params.id]);

    for (const lote of lotes) {
        lote.cultivos = await query(
            `SELECT c.id, c.nombre FROM cultivo c
             JOIN lote_cultivo lc ON c.id = lc.cultivo_id
             WHERE lc.lote_id = ?`,
            [lote.id]
        );
    }

    res.json(lotes);
});

const getLoteById = asyncHandler(async (req, res) => {
    const rows = await query("SELECT * FROM lote WHERE id = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ mensaje: "Lote no encontrado" });

    const lote = rows[0];
    lote.cultivos = await query(
        `SELECT c.id, c.nombre FROM cultivo c
         JOIN lote_cultivo lc ON c.id = lc.cultivo_id
         WHERE lc.lote_id = ?`,
        [lote.id]
    );

    res.json(lote);
});

const createLote = asyncHandler(async (req, res) => {
    const { nombre, area, estado, predio_id, cultivos } = req.body;

    const result = await query(
        "INSERT INTO lote (nombre, area, estado, predio_id) VALUES (?, ?, ?, ?)",
        [nombre, area, estado || "Activo", predio_id]
    );

    const loteId = result.insertId;

    if (Array.isArray(cultivos) && cultivos.length) {
        for (const cultivoId of cultivos) {
            await query(
                "INSERT INTO lote_cultivo (lote_id, cultivo_id) VALUES (?, ?)",
                [loteId, cultivoId]
            );
        }
    }

    res.status(201).json({ mensaje: "Lote creado", id: loteId });
});

const updateLote = asyncHandler(async (req, res) => {
    const { nombre, area, estado, predio_id, cultivos } = req.body;

    const result = await query(
        "UPDATE lote SET nombre=?, area=?, estado=?, predio_id=? WHERE id=?",
        [nombre, area, estado, predio_id, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ mensaje: "Lote no encontrado" });

    if (Array.isArray(cultivos)) {
        await query("DELETE FROM lote_cultivo WHERE lote_id = ?", [req.params.id]);
        for (const cultivoId of cultivos) {
            await query(
                "INSERT INTO lote_cultivo (lote_id, cultivo_id) VALUES (?, ?)",
                [req.params.id, cultivoId]
            );
        }
    }

    res.json({ mensaje: "Lote actualizado" });
});

const deleteLote = asyncHandler(async (req, res) => {
    const result = await query("DELETE FROM lote WHERE id = ?", [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ mensaje: "Lote no encontrado" });
    res.json({ mensaje: "Lote eliminado" });
});

// =============================================================================
// CULTIVOS — solo lectura
// =============================================================================

const getCultivos = asyncHandler(async (req, res) => {
    res.json(await query("SELECT * FROM cultivo"));
});

// Cultivos disponibles para un lugar específico
const getCultivosByLugar = asyncHandler(async (req, res) => {
    const results = await query(
        `SELECT c.id, c.nombre FROM cultivo c
         JOIN lugarproduccion_cultivo lc ON c.id = lc.cultivo_id
         WHERE lc.lugarproduccion_id = ?`,
        [req.params.id]
    );
    res.json(results);
});

// Cultivos disponibles para un predio específico
const getCultivosByPredio = asyncHandler(async (req, res) => {
    const results = await query(
        `SELECT c.id, c.nombre FROM cultivo c
         JOIN predio_cultivo pc ON c.id = pc.cultivo_id
         WHERE pc.predio_id = ?`,
        [req.params.id]
    );
    res.json(results);
});

// =============================================================================
// PREDIOS CON NIVEL DE RIESGO — dashboard admin
// =============================================================================

const getPrediosConRiesgo = asyncHandler(async (req, res) => {
    const predios = await query(
        `SELECT p.id, p.nombre, p.vereda,
                lp.nombre AS lugarNombre,
                lp.nombre AS lugarproduccion,
                lp.municipio_id, lp.departamento, lp.municipio
         FROM predio p
         JOIN lugarproduccion lp ON p.lugarproduccion_id = lp.id`
    );
    if (!predios.length) return res.json([]);

    const predioIds = predios.map(p => p.id);

    const inspecciones = await new Promise((resolve, reject) =>
        dbInspecciones.query(
            `SELECT i.solicitud_id, s.predio_id, i.nivelRiesgo
             FROM inspeccionsanitaria i
             JOIN solicitudinspeccion s ON i.solicitud_id = s.id
             WHERE s.predio_id IN (?)
             ORDER BY i.fechaInspeccion DESC`,
            [predioIds],
            (err, results) => err ? reject(err) : resolve(results)
        )
    );

    // Capitaliza la primera letra para que coincida con el frontend
    const capitalizar = (str) => str
        ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
        : null;

    const resultado = predios.map(p => {
        const inspeccion = inspecciones.find(i => i.predio_id === p.id);
        return {
            ...p,
            nivelRiesgo: inspeccion ? capitalizar(inspeccion.nivelRiesgo) : null,
        };
    });

    res.json(resultado);
});

// =============================================================================
// PRODUCTOR
// =============================================================================

const getProductores = asyncHandler(async (req, res) => {
    res.json(await query("SELECT * FROM productor"));
});

const getProductorById = asyncHandler(async (req, res) => {
    const rows = await query("SELECT * FROM productor WHERE id = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ mensaje: "Productor no encontrado" });
    res.json(rows[0]);
});

const createProductor = asyncHandler(async (req, res) => {
    const { nombre, identificacion, telefono, correo } = req.body;
    const result = await query(
        "INSERT INTO productor (nombre, identificacion, telefono, correo) VALUES (?, ?, ?, ?)",
        [nombre, identificacion, telefono, correo]
    );
    res.status(201).json({ mensaje: "Productor creado", id: result.insertId });
});

const updateProductor = asyncHandler(async (req, res) => {
    const { nombre, identificacion, telefono, correo } = req.body;
    const result = await query(
        "UPDATE productor SET nombre=?, identificacion=?, telefono=?, correo=? WHERE id=?",
        [nombre, identificacion, telefono, correo, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ mensaje: "Productor no encontrado" });
    res.json({ mensaje: "Productor actualizado" });
});

const deleteProductor = asyncHandler(async (req, res) => {
    const result = await query("DELETE FROM productor WHERE id = ?", [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ mensaje: "Productor no encontrado" });
    res.json({ mensaje: "Productor eliminado" });
});

// =============================================================================
// EXPORTACIONES
// =============================================================================
module.exports = {
    getLugares, getLugarById, createLugar, updateLugar, deleteLugar,
    getPredios, getPredioById, createPredio, updatePredio, deletePredio,
    getLotesByLugarProduccion, getLotesByPredio, getLoteById, createLote, updateLote, deleteLote,
    getCultivos, getCultivosByLugar, getCultivosByPredio,
    getPrediosConRiesgo,
    getProductores, getProductorById, createProductor, updateProductor, deleteProductor,
};