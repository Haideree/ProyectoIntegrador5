const { dbPredial, dbInspecciones } = require("../config/db");

// =============================================================================
// HELPERS INTERNOS
// =============================================================================

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
    const results = await query("SELECT * FROM LugarProduccion");
    res.json(results);
});

const getLugarById = asyncHandler(async (req, res) => {
    const rows = await query("SELECT * FROM LugarProduccion WHERE id = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ mensaje: "Lugar no encontrado" });
    res.json(rows[0]);
});

const createLugar = asyncHandler(async (req, res) => {
    const {
        nombre, municipio_id, numRegistroICA, vereda,
        area, cultivos, departamento, municipio, estado, estadoType,
    } = req.body;

    const result = await query(
        `INSERT INTO LugarProduccion
            (nombre, municipio_id, numRegistroICA, vereda, area, cultivos, departamento, municipio, estado, estadoType)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [nombre, municipio_id, numRegistroICA, vereda, area,
         Array.isArray(cultivos) ? cultivos.join(",") : cultivos,
         departamento, municipio, estado || "Sin alertas", estadoType || "success"]
    );
    res.status(201).json({ mensaje: "Lugar creado", id: result.insertId });
});

const updateLugar = asyncHandler(async (req, res) => {
    const {
        nombre, municipio_id, numRegistroICA, vereda,
        area, cultivos, departamento, municipio, estado, estadoType,
    } = req.body;

    const result = await query(
        `UPDATE LugarProduccion
         SET nombre=?, municipio_id=?, numRegistroICA=?, vereda=?, area=?,
             cultivos=?, departamento=?, municipio=?, estado=?, estadoType=?
         WHERE id=?`,
        [nombre, municipio_id, numRegistroICA, vereda, area,
         Array.isArray(cultivos) ? cultivos.join(",") : cultivos,
         departamento, municipio, estado, estadoType, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ mensaje: "Lugar no encontrado" });
    res.json({ mensaje: "Lugar actualizado" });
});

const deleteLugar = asyncHandler(async (req, res) => {
    const result = await query("DELETE FROM LugarProduccion WHERE id = ?", [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ mensaje: "Lugar no encontrado" });
    res.json({ mensaje: "Lugar eliminado" });
});

// =============================================================================
// PREDIOS
// =============================================================================

const getPredios = asyncHandler(async (req, res) => {
    const results = await query("SELECT * FROM Predio");
    res.json(results);
});

const getPredioById = asyncHandler(async (req, res) => {
    const rows = await query("SELECT * FROM Predio WHERE id = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ mensaje: "Predio no encontrado" });
    res.json(rows[0]);
});

const createPredio = asyncHandler(async (req, res) => {
    const {
        nombre, numRegistroICA, vereda, lugarProduccion_id,
        propietario_id, area, municipio, departamento, cultivos, estadoSanitario,
    } = req.body;

    const result = await query(
        `INSERT INTO Predio
            (nombre, numRegistroICA, vereda, lugarProduccion_id, propietario_id,
             area, municipio, departamento, cultivos, estadoSanitario)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [nombre, numRegistroICA, vereda, lugarProduccion_id, propietario_id,
         area, municipio, departamento,
         Array.isArray(cultivos) ? cultivos.join(",") : cultivos,
         estadoSanitario || "Aprobado"]
    );
    res.status(201).json({ mensaje: "Predio creado", id: result.insertId });
});

const updatePredio = asyncHandler(async (req, res) => {
    const {
        nombre, numRegistroICA, vereda, lugarProduccion_id,
        propietario_id, area, municipio, departamento, cultivos, estadoSanitario,
    } = req.body;

    const result = await query(
        `UPDATE Predio
         SET nombre=?, numRegistroICA=?, vereda=?, lugarProduccion_id=?,
             propietario_id=?, area=?, municipio=?, departamento=?,
             cultivos=?, estadoSanitario=?
         WHERE id=?`,
        [nombre, numRegistroICA, vereda, lugarProduccion_id, propietario_id,
         area, municipio, departamento,
         Array.isArray(cultivos) ? cultivos.join(",") : cultivos,
         estadoSanitario, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ mensaje: "Predio no encontrado" });
    res.json({ mensaje: "Predio actualizado" });
});

const deletePredio = asyncHandler(async (req, res) => {
    const result = await query("DELETE FROM Predio WHERE id = ?", [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ mensaje: "Predio no encontrado" });
    res.json({ mensaje: "Predio eliminado" });
});

// =============================================================================
// LOTES
// =============================================================================

const getLotesByLugarProduccion = asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const sql = id === 0
        ? "SELECT * FROM Lote"
        : `SELECT Lote.* FROM Lote
           INNER JOIN Predio ON Lote.predio_id = Predio.id
           WHERE Predio.lugarProduccion_id = ?`;
    const results = await query(sql, id === 0 ? [] : [id]);
    res.json(results);
});

// Compatibilidad con dashboard técnico y otros endpoints existentes
const getLotesByPredio = asyncHandler(async (req, res) => {
    const results = await query("SELECT * FROM Lote WHERE predio_id = ?", [req.params.id]);
    res.json(results);
});

const getLoteById = asyncHandler(async (req, res) => {
    const rows = await query("SELECT * FROM Lote WHERE id = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ mensaje: "Lote no encontrado" });
    res.json(rows[0]);
});

const createLote = asyncHandler(async (req, res) => {
    const { nombre, area, estado, predio_id, cultivos } = req.body;
    const result = await query(
        "INSERT INTO Lote (nombre, area, estado, predio_id, cultivos) VALUES (?, ?, ?, ?, ?)",
        [nombre, area, estado || "Activo", predio_id,
         Array.isArray(cultivos) ? cultivos.join(",") : cultivos]
    );
    res.status(201).json({ mensaje: "Lote creado", id: result.insertId });
});

const updateLote = asyncHandler(async (req, res) => {
    const { nombre, area, estado, predio_id, cultivos } = req.body;
    const result = await query(
        "UPDATE Lote SET nombre=?, area=?, estado=?, predio_id=?, cultivos=? WHERE id=?",
        [nombre, area, estado, predio_id,
         Array.isArray(cultivos) ? cultivos.join(",") : cultivos,
         req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ mensaje: "Lote no encontrado" });
    res.json({ mensaje: "Lote actualizado" });
});

const deleteLote = asyncHandler(async (req, res) => {
    const result = await query("DELETE FROM Lote WHERE id = ?", [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ mensaje: "Lote no encontrado" });
    res.json({ mensaje: "Lote eliminado" });
});

// =============================================================================
// CULTIVOS — solo lectura
// =============================================================================

const getCultivos = asyncHandler(async (req, res) => {
    res.json(await query("SELECT * FROM Cultivo"));
});

// =============================================================================
// PREDIOS CON NIVEL DE RIESGO — usado por el dashboard del admin
// =============================================================================

const getPrediosConRiesgo = asyncHandler(async (req, res) => {
    const predios = await query(
        `SELECT p.id, p.nombre, p.vereda,
                lp.nombre AS lugarproduccion,
                lp.municipio_id
         FROM Predio p
         JOIN LugarProduccion lp ON p.lugarProduccion_id = lp.id`
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

    const resultado = predios.map(p => ({
        ...p,
        nivelRiesgo: inspecciones.find(i => i.predio_id === p.id)?.nivelRiesgo || 'bajo',
    }));

    res.json(resultado);
});

// =============================================================================
// PRODUCTOR
// =============================================================================

const getProductores = asyncHandler(async (req, res) => {
    res.json(await query("SELECT * FROM Productor"));
});

const getProductorById = asyncHandler(async (req, res) => {
    const rows = await query("SELECT * FROM Productor WHERE id = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ mensaje: "Productor no encontrado" });
    res.json(rows[0]);
});

const createProductor = asyncHandler(async (req, res) => {
    const { nombre, identificacion, telefono, correo } = req.body;
    const result = await query(
        "INSERT INTO Productor (nombre, identificacion, telefono, correo) VALUES (?, ?, ?, ?)",
        [nombre, identificacion, telefono, correo]
    );
    res.status(201).json({ mensaje: "Productor creado", id: result.insertId });
});

const updateProductor = asyncHandler(async (req, res) => {
    const { nombre, identificacion, telefono, correo } = req.body;
    const result = await query(
        "UPDATE Productor SET nombre=?, identificacion=?, telefono=?, correo=? WHERE id=?",
        [nombre, identificacion, telefono, correo, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ mensaje: "Productor no encontrado" });
    res.json({ mensaje: "Productor actualizado" });
});

const deleteProductor = asyncHandler(async (req, res) => {
    const result = await query("DELETE FROM Productor WHERE id = ?", [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ mensaje: "Productor no encontrado" });
    res.json({ mensaje: "Productor eliminado" });
});

// =============================================================================
// EXPORTACIONES
// =============================================================================
module.exports = {
    // Lugar de producción
    getLugares, getLugarById, createLugar, updateLugar, deleteLugar,
    // Predios
    getPredios, getPredioById, createPredio, updatePredio, deletePredio,
    // Lotes
    getLotesByLugarProduccion, getLotesByPredio, getLoteById, createLote, updateLote, deleteLote,
    // Cultivos
    getCultivos,
    // Admin dashboard
    getPrediosConRiesgo,
    // Productor
    getProductores, getProductorById, createProductor, updateProductor, deleteProductor,
};