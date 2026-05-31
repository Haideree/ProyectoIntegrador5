import { useState, useEffect, useCallback } from "react";

// ══════════════════════════════════════════════════════════════════════════════
// PALETA DE COLORES GLOBAL
// Todas las páginas y componentes la importan desde aquí. Cambiar un valor
// aquí lo propaga automáticamente a toda la UI.
// ══════════════════════════════════════════════════════════════════════════════
const C = {
    verde: "#2E7D32", verdeClaro: "#4CAF50", verdePastel: "#E8F5E9", verdeMedio: "#A5D6A7",
    amarillo: "#F9A825", amarilloPastel: "#FFFDE7", naranja: "#E65100", naranjaPastel: "#FFF3E0",
    gris: "#546E7A", grisPastel: "#ECEFF1", blanco: "#FFFFFF", texto: "#1B2631",
    textoMuted: "#607D8B", borde: "#CFD8DC", azul: "#1565C0", azulPastel: "#E3F2FD",
    rojo: "#C62828", rojoPastel: "#FFEBEE",
};

// ══════════════════════════════════════════════════════════════════════════════
// URL BASE DE LA API
// Apunta al backend del proyecto. Cambiar aquí para dev / producción.
// ══════════════════════════════════════════════════════════════════════════════
const BASE_URL = "https://proyectointegrador5.onrender.com/api";

// ══════════════════════════════════════════════════════════════════════════════
// HELPER: fetch centralizado con manejo de errores
// Lanza un Error con el mensaje del servidor si la respuesta no es 2xx.
// Todos los llamados a la API pasan por aquí para no repetir lógica.
// ══════════════════════════════════════════════════════════════════════════════
async function apiFetch(path, options = {}) {
    const res  = await fetch(`${BASE_URL}${path}`, {
        headers: { "Content-Type": "application/json" },
        ...options,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.mensaje || data.error || "Error en la solicitud");
    return data;
}

// ══════════════════════════════════════════════════════════════════════════════
// MAPEO FRONTEND ↔ BACKEND
// Convierte los campos del backend a la forma que usan los componentes UI,
// y viceversa. Así ningún componente visual necesita conocer la forma del API.
// ══════════════════════════════════════════════════════════════════════════════

// --- Lugar de producción ---
// Backend: { id, nombre, municipio_id, numRegistroICA, area, cultivos (csv), ... }
// Frontend: { id, nombre, municipio, ica, areaHa, cultivos (array), ... }
const calcularEstadoLugar = (nivelesRiesgo = []) => {
    if (!nivelesRiesgo.length) return { estado: "Sin alertas", estadoType: "success" };
    const niveles = nivelesRiesgo.map(n => n.nivelRiesgo?.toLowerCase());
    if (niveles.some(n => n === "alto"))   return { estado: "Alerta",       estadoType: "danger" };
    if (niveles.some(n => n === "medio"))  return { estado: "Alerta media", estadoType: "warning" };
    return { estado: "Sin alertas", estadoType: "success" };
};

const lugarToFront = (l) => {
    const { estado, estadoType } = calcularEstadoLugar(l.nivelesRiesgo);
    return {
        id:           l.id,
        nombre:       l.nombre,
        municipio:    l.municipio    || "",
        departamento: l.departamento || "",
        vereda:       l.vereda       || "",
        cultivos:     Array.isArray(l.cultivos) ? l.cultivos : [],
        ica:          l.numRegistroICA || "",
        estado,
        estadoType,
    };
};

// Convierte un objeto frontend de lugar al cuerpo que espera el backend (POST/PUT)
const lugarToBack = (f, municipioId) => ({
    nombre:       f.nombre,
    municipio_id: municipioId || f.municipioId || null,
    vereda:       f.vereda,
    departamento: f.departamento,
    municipio:    f.municipio,
    productor_id: JSON.parse(localStorage.getItem("usuario") || "{}").id || null, // ← cambiado
    cultivos:     f.cultivos.map(c => typeof c === "object" ? c.id : c),
});

// --- Predio ---
// Backend: { id, nombre, numRegistroICA, vereda, lugarProduccion_id, area, cultivos (csv), ... }
// Frontend: { id, nombre, matricula, vereda, lugarId, lugarNombre, areaHa, cultivos (array), ... }
const predioToFront = (p, lugares = []) => {
    const lugarId = p.lugarProduccion_id || p.lugarproduccion_id || p.lugarId || null;
    const lugar = lugares.find(l => l.id === lugarId);
    return {
        id:          p.id,
        nombre:      p.nombre,
        lugarId:     lugarId,
        lugarNombre: lugar?.nombre || p.lugarNombre || "",
        matricula:   p.numRegistroICA || p.matricula || "",
        areaHa:      parseFloat(p.area || p.areaHa || 0),
        municipio:    p.municipio    || lugar?.municipio    || "",
        departamento: p.departamento || lugar?.departamento || "",
        vereda:       p.vereda       || "",
        cultivos:     Array.isArray(p.cultivos) ? p.cultivos : [],
        proximaInspeccion: p.proximaInspeccion || null,
    };
};

// Convierte un predio frontend al cuerpo que espera el backend (POST/PUT)
const predioToBack = (f) => ({
    nombre:             f.nombre,
    numRegistroICA:     f.matricula,
    vereda:             f.vereda,
    lugarProduccion_id: f.lugarId,
    propietario_id:     JSON.parse(localStorage.getItem("usuario") || "{}").id || null,
    area:               f.areaHa,
    // se envían solo los IDs
    cultivos:           f.cultivos.map(c => typeof c === "object" ? c.id : c),
});

// --- Lote ---
// Backend: { id, nombre, area, estado, predio_id, cultivos (csv) }
// Frontend: { id, nombre, areaHa, estadoLote, predioId, predioNombre, lugarNombre, cultivos (array) }
const loteToFront = (l, predios = []) => {
    const predio = predios.find(p => p.id === (l.predio_id || l.predioId));
    return {
        id:           l.id,
        nombre:       l.nombre,
        predioId:     l.predio_id  || l.predioId  || null,
        predioNombre: predio?.nombre      || l.predioNombre || "",
        lugarNombre:  predio?.lugarNombre || l.lugarNombre  || "",
        areaHa:       parseFloat(l.area || l.areaHa || 0),
        cultivos:     Array.isArray(l.cultivos) ? l.cultivos : [],
        estadoLote:   l.estado || l.estadoLote || "Activo",
    };
};

// Convierte un lote frontend al cuerpo que espera el backend (POST/PUT)
const loteToBack = (f) => ({
    nombre:    f.nombre,
    area:      f.areaHa,
    estado:    f.estadoLote,
    predio_id: f.predioId,
    cultivos:  f.cultivos.map(c => typeof c === "object" ? c.id : c),
});





// Genera 3 lotes por cada predio como datos de prueba.
// Cada lote hereda cultivos y área proporcional de su predio padre.
const generarLotes = (predios) =>
    predios.flatMap(p =>
        [1, 2, 3].map(n => ({
            id:           p.id * 10 + n,
            nombre:       `Lote ${n}`,
            predioId:     p.id,
            predioNombre: p.nombre,
            lugarNombre:  p.lugarNombre,
            areaHa:       parseFloat((p.areaHa / 3).toFixed(1)),
            cultivos:     p.cultivos,
            // El lote 2 de cada predio empieza en revisión para mostrar badge distinto
            estadoLote:   n === 2 ? "En revisión" : "Activo",
        }))
    );



// ══════════════════════════════════════════════════════════════════════════════
// CONSTANTES GLOBALES DE VALIDACIÓN Y NAVEGACIÓN
// ══════════════════════════════════════════════════════════════════════════════

// Fecha de referencia para calcular días restantes hasta próxima inspección
const HOY = new Date();
// Calcula cuántos días faltan para una fecha dada (string "YYYY-MM-DD")
const diasRestantes = (f) => Math.ceil((new Date(f) - HOY) / 86400000);

// Formatea "YYYY-MM-DD" → "DD/MM/YYYY" para mostrar en la UI
const fmt = (s) => { const [y, m, d] = s.split("-"); return `${d}/${m}/${y}`; };

// Devuelve el id más alto del array + 1 (para IDs locales de datos de prueba)
const nextId = (arr) => arr.length === 0 ? 1 : Math.max(...arr.map(x => x.id)) + 1;

// Límites de validación coherentes con la realidad agrícola colombiana
const AREA_MAX_HA        = 5000; // máximo hectáreas por registro
const AREA_MIN_HA        = 0.01; // mínimo: equivale a 100 m²
const CULTIVOS_MAX_LUGAR = 5;    // máximo cultivos distintos por lugar de producción

// Estructura del menú lateral. subItems genera el acordeón de "Lugares"
const NAV = [
    { key: "dashboard",    label: "Inicio",                icono: "📊" },
    { key: "lugares",      label: "Lugares de producción", icono: "🗺️", subItems: [
        { key: "predios", label: "Predios", icono: "🏡" },
        { key: "lotes",   label: "Lotes",   icono: "🌿" },
    ]},
    { key: "inspecciones", label: "Inspecciones", icono: "✅" },
];

// Títulos que muestra el Header según la sección activa
const TITULOS = {
    dashboard:    "Panel del productor",
    lugares:      "Lugares de producción",
    predios:      "Predios asociados",
    lotes:        "Lotes",
    inspecciones: "Inspecciones",
};

// ══════════════════════════════════════════════════════════════════════════════
// BADGE — Etiqueta de estado con color semántico
// tipoBadge() devuelve los colores según el valor de estado.
// Badge renderiza el pill coloreado.
// ══════════════════════════════════════════════════════════════════════════════
function tipoBadge(estado) {
    if (["Aprobado", "Sin alertas", "completada", "Aprobada", "Activo"].includes(estado))
        return { bg: C.verdePastel,    color: C.verde };
    if (["Con observaciones", "Alerta media", "Pendiente", "En revisión"].includes(estado))
        return { bg: C.amarilloPastel, color: "#B7770D" };
    if (["Alerta", "rechazada"].includes(estado))
        return { bg: C.rojoPastel,     color: C.rojo };
    if (["asignada"].includes(estado))
        return { bg: C.azulPastel,     color: C.azul };
    return { bg: C.grisPastel, color: C.gris };
}

function Badge({ estado, children }) {
    const texto = children || estado;
    const s     = tipoBadge(estado);
    return (
        <span style={{
            background: s.bg, color: s.color, fontSize: 13, fontWeight: 700,
            padding: "3px 11px", borderRadius: 20, whiteSpace: "nowrap", display: "inline-block",
        }}>
            {texto}
        </span>
    );
}

// ══════════════════════════════════════════════════════════════════════════════
// SIDEBAR — Menú lateral con acordeón para "Lugares de producción"
//
// FIX: El submenú (acordeón) ahora solo se abre/cierra cuando se hace clic en
// el ítem "Lugares de producción". Si se vuelve a hacer clic en ese mismo ítem
// estando ya activo, el submenú se cierra. Hacer clic en "Inicio" o
// "Inspecciones" también cierra el submenú.
// ══════════════════════════════════════════════════════════════════════════════
function Sidebar({ activa, setActiva, menuAbierto, setMenuAbierto }) {
    // desplegado controla si el acordeón de subItems está visible
    const [desplegado, setDesplegado] = useState(false);

    const handleClick = (key, tieneSubItems) => {
        if (tieneSubItems) {
            // Alterna el acordeón al hacer clic repetido en el mismo ítem padre
            setDesplegado(d => !d);
            setActiva(key);
        } else {
            // Al navegar a otra sección, cierra siempre el acordeón
            setActiva(key);
            setDesplegado(false);
        }
    };

    return (
        <aside style={{
            width: menuAbierto ? 230 : 62, background: C.verde, flexShrink: 0,
            transition: "width 0.25s ease", overflow: "hidden", display: "flex",
            flexDirection: "column", height: "100vh", position: "sticky", top: 0,
        }}>
            {/* Logo e identificador del módulo */}
            <div style={{
                padding: "0 16px", height: 56, display: "flex", alignItems: "center",
                gap: 10, borderBottom: `1px solid rgba(255,255,255,0.15)`, flexShrink: 0,
            }}>
                <img src="/LogoICA.png" alt="Logo ICA"
                    style={{ width: 32, height: 32, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
                <span style={{
                    color: C.blanco, fontSize: 15, fontWeight: 700, whiteSpace: "nowrap",
                    opacity: menuAbierto ? 1 : 0, transition: "opacity 0.2s",
                }}>
                    Productor
                </span>
            </div>

            {/* Etiqueta de rol — se abrevia cuando el menú está colapsado */}
            <div style={{
                padding: "10px 20px", background: "rgba(0,0,0,0.12)",
                borderBottom: `1px solid rgba(255,255,255,0.1)`, whiteSpace: "nowrap",
            }}>
                <div style={{
                    fontSize: 10, fontWeight: 700, color: C.verdeMedio,
                    textTransform: "uppercase", letterSpacing: 1.2,
                }}>
                    {menuAbierto ? "PRODUCTOR" : "PRD"}
                </div>
            </div>

            {/* Ítems de navegación */}
            <nav style={{ flex: 1, padding: "10px 0", overflowY: "auto" }}>
                {NAV.map(({ key, label, icono, subItems }) => (
                    <div key={key}>
                        {/* Ítem principal */}
                        <button
                            onClick={() => handleClick(key, !!subItems)}
                            style={{
                                display: "flex", alignItems: "center", gap: 12, width: "100%",
                                padding: "12px 20px", border: "none", textAlign: "left",
                                whiteSpace: "nowrap", cursor: "pointer",
                                background: activa === key || (subItems && subItems.some(s => s.key === activa))
                                    ? "rgba(255,255,255,0.18)" : "transparent",
                                color: activa === key || (subItems && subItems.some(s => s.key === activa))
                                    ? C.blanco : C.verdeMedio,
                                fontWeight: activa === key || (subItems && subItems.some(s => s.key === activa))
                                    ? 700 : 400,
                                fontSize: 15,
                                borderLeft: activa === key || (subItems && subItems.some(s => s.key === activa))
                                    ? `3px solid ${C.blanco}` : "3px solid transparent",
                                transition: "all 0.15s",
                            }}
                        >
                            <span style={{ fontSize: 17, flexShrink: 0 }}>{icono}</span>
                            <span style={{ opacity: menuAbierto ? 1 : 0, transition: "opacity 0.2s", flex: 1 }}>
                                {label}
                            </span>
                            {/* Flecha de acordeón: solo visible con menú abierto */}
                            {subItems && menuAbierto && (
                                <span style={{ fontSize: 11, opacity: 0.8 }}>
                                    {desplegado ? "▲" : "▼"}
                                </span>
                            )}
                        </button>

                        {/* Subítems del acordeón (solo si está desplegado y menú abierto) */}
                        {subItems && desplegado && menuAbierto && (
                            <div style={{ background: "rgba(0,0,0,0.15)" }}>
                                {subItems.map(sub => (
                                    <button
                                        key={sub.key}
                                        onClick={() => setActiva(sub.key)}
                                        style={{
                                            display: "flex", alignItems: "center", gap: 12,
                                            width: "100%", padding: "10px 20px 10px 40px",
                                            border: "none", textAlign: "left", whiteSpace: "nowrap",
                                            cursor: "pointer",
                                            background: activa === sub.key
                                                ? "rgba(255,255,255,0.15)" : "transparent",
                                            color: activa === sub.key ? C.blanco : C.verdeMedio,
                                            fontWeight: activa === sub.key ? 700 : 400,
                                            fontSize: 14,
                                            borderLeft: activa === sub.key
                                                ? `3px solid ${C.blanco}` : "3px solid transparent",
                                            transition: "all 0.15s",
                                        }}
                                    >
                                        <span style={{ fontSize: 15, flexShrink: 0 }}>{sub.icono}</span>
                                        <span>{sub.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </nav>

            {/* Botón de cerrar sesión — limpia localStorage y redirige */}
            <div style={{ borderTop: `1px solid rgba(255,255,255,0.12)`, flexShrink: 0 }}>
                <button
                    onClick={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("usuario");
                        window.location.href = "/login";
                    }}
                    style={{
                        display: "flex", alignItems: "center", gap: 12, width: "100%",
                        padding: "14px 20px", border: "none", background: "transparent",
                        color: "#FFCDD2", cursor: "pointer", fontWeight: 600, fontSize: 15,
                        whiteSpace: "nowrap",
                    }}
                >
                    <span style={{ fontSize: 17, flexShrink: 0 }}>🚪</span>
                    <span style={{ opacity: menuAbierto ? 1 : 0, transition: "opacity 0.2s" }}>
                        Cerrar sesión
                    </span>
                </button>
            </div>
        </aside>
    );
}

// ══════════════════════════════════════════════════════════════════════════════
// HEADER — Barra superior fija con título, toggle de menú y datos del usuario
// ══════════════════════════════════════════════════════════════════════════════
function Header({ titulo, menuAbierto, setMenuAbierto }) {
    // Lee el usuario guardado en localStorage (seteado en el login)
    const usuario   = JSON.parse(localStorage.getItem("usuario") || "{}");
    const nombre    = usuario.nombre || "Usuario";
    // Toma las iniciales del nombre completo (máx. 2 letras)
    const iniciales = nombre.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

    return (
        <header style={{
            background: C.verde, color: C.blanco, padding: "0 24px", height: 56,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            position: "sticky", top: 0, zIndex: 10,
            boxShadow: "0 2px 12px rgba(0,0,0,0.18)", flexShrink: 0,
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                {/* Botón hamburguesa: colapsa/expande el sidebar */}
                <button
                    onClick={() => setMenuAbierto(!menuAbierto)}
                    style={{
                        background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 8,
                        width: 36, height: 36, cursor: "pointer", display: "flex",
                        flexDirection: "column", alignItems: "center", justifyContent: "center",
                        gap: 4, flexShrink: 0,
                    }}
                >
                    {[0, 1, 2].map(i => (
                        <span key={i} style={{ display: "block", width: 18, height: 2, background: C.blanco, borderRadius: 2 }} />
                    ))}
                </button>
                <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: -0.3 }}>{titulo}</span>
            </div>

            {/* Avatar + nombre del productor autenticado */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>{nombre}</div>
                    <div style={{ fontSize: 13, opacity: 0.75 }}>Productor registrado</div>
                </div>
                <div style={{
                    width: 34, height: 34, borderRadius: "50%",
                    background: "rgba(255,255,255,0.2)", display: "flex",
                    alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700,
                }}>
                    {iniciales}
                </div>
            </div>
        </header>
    );
}

// ══════════════════════════════════════════════════════════════════════════════
// COMPONENTES REUTILIZABLES DE UI
// ══════════════════════════════════════════════════════════════════════════════

// Título de sección con barra verde a la izquierda
function SectionTitle({ children }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <div style={{ width: 4, height: 22, background: C.verde, borderRadius: 2 }} />
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: C.texto }}>{children}</h2>
        </div>
    );
}

// Tarjeta de estadística para el dashboard (ícono + label + valor numérico)
function StatCard({ icono, label, value, colorTexto, colorFondo }) {
    return (
        <div style={{
            background: C.blanco, borderRadius: 12, border: `1px solid ${C.borde}`,
            padding: "18px 20px", display: "flex", flexDirection: "column", gap: 10,
        }}>
            <div style={{
                width: 40, height: 40, borderRadius: 10, background: colorFondo,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
            }}>
                {icono}
            </div>
            <div>
                <div style={{
                    fontSize: 11, fontWeight: 700, color: C.textoMuted,
                    textTransform: "uppercase", letterSpacing: 0.7, marginBottom: 3,
                }}>
                    {label}
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: colorTexto, lineHeight: 1 }}>
                    {value}
                </div>
            </div>
        </div>
    );
}

// Botones con variantes semánticas (acción principal, neutro, peligro, editar, outline)
function BtnVerde({ onClick, children, style = {} })  {
    return <button onClick={onClick} style={{ background: C.verde,      color: C.blanco, border: "none",                         borderRadius: 8, padding: "9px 18px", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, ...style }}>{children}</button>;
}
function BtnGris({ onClick, children, style = {} })   {
    return <button onClick={onClick} style={{ background: C.grisPastel, color: C.gris,   border: "none",                         borderRadius: 8, padding: "9px 18px", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, ...style }}>{children}</button>;
}
function BtnRojo({ onClick, children, style = {} })   {
    return <button onClick={onClick} style={{ background: C.rojoPastel, color: C.rojo,   border: `1px solid ${C.rojo}30`,        borderRadius: 8, padding: "9px 18px", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, ...style }}>{children}</button>;
}
function BtnEditar({ onClick, children, style = {} }) {
    return <button onClick={onClick} style={{ background: C.azulPastel, color: C.azul,   border: `1px solid ${C.azul}30`,        borderRadius: 8, padding: "9px 18px", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, ...style }}>{children}</button>;
}
function BtnOutline({ onClick, children }) {
    return <button onClick={onClick} style={{ background: "transparent", color: C.texto, border: `1px solid ${C.borde}`,        borderRadius: 7,  padding: "5px 13px",  fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{children}</button>;
}

// Fila de detalle: etiqueta arriba en gris pequeño + valor abajo
function FilaInfo({ label, valor }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <span style={{ fontSize: 11, color: C.textoMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</span>
            <span style={{ fontSize: 14, color: C.texto, fontWeight: 500 }}>{valor}</span>
        </div>
    );
}

// Línea separadora horizontal
function Divider() {
    return <div style={{ height: 1, background: C.borde, margin: "16px 0" }} />;
}

// Botón de pestaña (tabs) con fondo verde cuando está activa
function TabBtn({ activa, id, label, setActiva }) {
    return (
        <button
            onClick={() => setActiva(id)}
            style={{
                padding: "9px 20px", borderRadius: 8, fontSize: 14, fontWeight: 700,
                cursor: "pointer", border: "none",
                background: activa === id ? C.verde : C.blanco,
                color:      activa === id ? C.blanco : C.gris,
            }}
        >
            {label}
        </button>
    );
}

// Wrapper de campo de formulario: pone la etiqueta arriba y el error abajo
function CampoForm({ label, error, children }) {
    return (
        <div>
            <label style={{
                fontSize: 11, fontWeight: 700, color: C.textoMuted,
                display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5,
            }}>
                {label}
            </label>
            {children}
            {error && (
                <span style={{ fontSize: 12, color: C.rojo, marginTop: 3, display: "block" }}>
                    {error}
                </span>
            )}
        </div>
    );
}

// Estilo base para inputs y selects de formulario.
// Pinta el borde rojo si se le pasa un mensaje de error.
const inputStyle = (err) => ({
    width: "100%", border: `1px solid ${err ? C.rojo : C.borde}`, borderRadius: 8,
    padding: "9px 12px", fontSize: 14, color: C.texto, background: C.blanco,
    boxSizing: "border-box", outline: "none",
});

// ══════════════════════════════════════════════════════════════════════════════
// MODALES BASE
// Overlay: fondo oscuro semitransparente con cierre al hacer clic fuera.
// ModalShell: contenedor blanco con título, subtítulo y botón ×.
// ══════════════════════════════════════════════════════════════════════════════
function Overlay({ onClose, children }) {
    return (
        <div
            style={{
                position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200,
                display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
            }}
            onClick={onClose}
        >
            {/* stopPropagation evita que el clic dentro del modal cierre el overlay */}
            <div onClick={e => e.stopPropagation()}>{children}</div>
        </div>
    );
}

function ModalShell({ titulo, subtitulo, onClose, children, ancho = 480 }) {
    return (
        <div style={{
            background: C.blanco, borderRadius: 16, padding: 28,
            width: ancho, maxWidth: "95vw", maxHeight: "90vh", overflowY: "auto",
            boxShadow: "0 8px 40px rgba(0,0,0,0.2)",
        }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
                <div>
                    {subtitulo && (
                        <div style={{ fontSize: 11, fontWeight: 700, color: C.verdeClaro, textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>
                            {subtitulo}
                        </div>
                    )}
                    <h2 style={{ margin: 0, fontSize: 19, fontWeight: 700, color: C.texto }}>{titulo}</h2>
                </div>
                <button onClick={onClose} style={{ background: C.grisPastel, border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 18, color: C.gris }}>×</button>
            </div>
            {children}
        </div>
    );
}

// ══════════════════════════════════════════════════════════════════════════════
// HOOKS: Departamentos y Municipios desde la API del proyecto
// Reutilizan el mismo endpoint que el formulario de registro de usuario.
// ══════════════════════════════════════════════════════════════════════════════

// Devuelve la lista de departamentos. Se carga una sola vez al montar.
function useDepartamentos() {
    const [departamentos, setDepartamentos] = useState([]);
    useEffect(() => {
        fetch(`${BASE_URL}/geografico/departamentos`)
            .then(r => r.json())
            .then(data => setDepartamentos(Array.isArray(data) ? data : []))
            .catch(() => {});
    }, []);
    return departamentos;
}

// Devuelve los municipios del departamento seleccionado.
// Se recarga automáticamente cada vez que cambia departamentoId.
function useMunicipios(departamentoId) {
    const [municipios, setMunicipios] = useState([]);
    useEffect(() => {
        if (!departamentoId) { setMunicipios([]); return; }
        fetch(`${BASE_URL}/geografico/municipios/departamento/${departamentoId}`)
            .then(r => r.json())
            .then(data => setMunicipios(Array.isArray(data) ? data : []))
            .catch(() => {});
    }, [departamentoId]);
    return municipios;
}

// ══════════════════════════════════════════════════════════════════════════════
// SELECTOR DE CULTIVOS CON RANURAS DINÁMICAS
//
// Maneja dos modos:
//   - opcionesDisponibles = null → input de texto libre (solo en Lugar)
//   - opcionesDisponibles = array → select restringido a esas opciones (Predio/Lote)
//
// Reglas de UX:
//   · No permite agregar una ranura nueva si la última está vacía.
//   · Oculta en el select las opciones ya elegidas en otras ranuras (evita duplicados).
//   · Cuando se alcanza el límite, oculta el botón y muestra mensaje informativo.
// ══════════════════════════════════════════════════════════════════════════════
function SelectorCultivos({ cultivos, onChange, opcionesDisponibles = null, max = null }) {
    const limite = max !== null ? max : (opcionesDisponibles ? opcionesDisponibles.length : 10);

    const agregarRanura = () => {
        if (cultivos.length >= limite) return;
        if (cultivos.length > 0 && !cultivos[cultivos.length - 1]) return;
        onChange([...cultivos, null]);
    };

    const actualizarCultivo = (index, id) => {
        const opcion = opcionesDisponibles?.find(o => o.id === Number(id));
        const nuevo = [...cultivos];
        nuevo[index] = opcion || null;
        onChange(nuevo);
    };

    const eliminarRanura = (index) => {
        onChange(cultivos.filter((_, i) => i !== index));
    };

    // IDs ya seleccionados para ocultar duplicados
    const idsSeleccionados = cultivos.filter(Boolean).map(c => c.id);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {cultivos.map((cultivo, index) => (
                <div key={index} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <select
                        value={cultivo?.id || ""}
                        onChange={e => actualizarCultivo(index, e.target.value)}
                        style={{ ...inputStyle(false), flex: 1 }}
                    >
                        <option value="">Seleccione cultivo...</option>
                        {opcionesDisponibles
                            ?.filter(op => op.id === cultivo?.id || !idsSeleccionados.includes(op.id))
                            .map(op => <option key={op.id} value={op.id}>{op.nombre}</option>)
                        }
                    </select>
                    {cultivos.length > 1 && (
                        <button
                            onClick={() => eliminarRanura(index)}
                            style={{
                                background: C.rojoPastel, color: C.rojo, border: "none",
                                borderRadius: 7, width: 32, height: 36, cursor: "pointer",
                                fontWeight: 700, fontSize: 16, flexShrink: 0,
                            }}
                        >×</button>
                    )}
                </div>
            ))}

            {cultivos.length < limite && (
                <button
                    onClick={agregarRanura}
                    style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        background: "#dbeeff", color: "#1565C0",
                        border: "1px dashed #5b9bd5", borderRadius: 8,
                        padding: "7px 14px", fontSize: 13, fontWeight: 700,
                        cursor: "pointer", width: "fit-content", alignSelf: "flex-end",
                    }}
                >+ Agregar cultivo</button>
            )}

            {cultivos.length >= limite && limite > 0 && (
                <div style={{ fontSize: 12, color: C.textoMuted, fontStyle: "italic" }}>
                    Has seleccionado todos los cultivos disponibles.
                </div>
            )}
        </div>
    );
}

// ══════════════════════════════════════════════════════════════════════════════
// MODAL: Confirmación simple de eliminación
// Usado para lotes (sin cascada) y como paso 2 en la eliminación de lugares/predios.
// ══════════════════════════════════════════════════════════════════════════════
function ModalConfirmarEliminar({ titulo, mensaje, onConfirmar, onCancelar }) {
    return (
        <Overlay onClose={onCancelar}>
            <div style={{
                background: C.blanco, borderRadius: 16, padding: 28,
                width: 380, maxWidth: "95vw", boxShadow: "0 8px 40px rgba(0,0,0,0.2)",
            }}>
                <div style={{ textAlign: "center", marginBottom: 20 }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>🗑️</div>
                    <h3 style={{ margin: "0 0 8px", fontSize: 17, fontWeight: 700, color: C.texto }}>{titulo}</h3>
                    <p style={{ margin: 0, fontSize: 14, color: C.textoMuted, lineHeight: 1.5 }}>{mensaje}</p>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                    <BtnGris onClick={onCancelar} style={{ flex: 1, justifyContent: "center" }}>Cancelar</BtnGris>
                    <BtnRojo onClick={onConfirmar} style={{ flex: 1, justifyContent: "center" }}>Eliminar</BtnRojo>
                </div>
            </div>
        </Overlay>
    );
}

// ══════════════════════════════════════════════════════════════════════════════
// MODAL: Eliminar LUGAR con gestión de predios asociados
//
// Flujo en dos pasos:
//   Paso 1 — Muestra los predios afectados y ofrece dos acciones:
//            "Eliminar todo" o "Mover predios a otro lugar"
//   Paso 2 — Confirmación final antes de ejecutar la acción elegida
// ══════════════════════════════════════════════════════════════════════════════
function ModalEliminarLugar({ lugar, predios, lugares, onCancelar, onEliminarTodo, onMover }) {
    const prediosAfectados = predios.filter(p => p.lugarId === lugar.id);
    const otrosLugares     = lugares.filter(l => l.id !== lugar.id); // posibles destinos

    const [accion,    setAccion]    = useState("eliminar"); // "eliminar" | "mover"
    const [destinoId, setDestinoId] = useState("");
    const [paso,      setPaso]      = useState(1);

    const handleSiguiente = () => {
        if (accion === "mover" && !destinoId) return; // no avanza sin destino
        setPaso(2);
    };
    const handleConfirmar = () => {
        if (accion === "eliminar") onEliminarTodo(lugar);
        else onMover(lugar, Number(destinoId));
    };

    /* Paso 2: pantalla de confirmación final */
    if (paso === 2) {
        const destino = otrosLugares.find(l => l.id === Number(destinoId));
        return (
            <Overlay onClose={onCancelar}>
                <div style={{ background: C.blanco, borderRadius: 16, padding: 28, width: 420, maxWidth: "95vw", boxShadow: "0 8px 40px rgba(0,0,0,0.2)" }}>
                    <div style={{ textAlign: "center", marginBottom: 20 }}>
                        <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
                        <h3 style={{ margin: "0 0 8px", fontSize: 17, fontWeight: 700, color: C.texto }}>¿Confirmar acción?</h3>
                        {accion === "eliminar" ? (
                            <p style={{ margin: 0, fontSize: 14, color: C.textoMuted, lineHeight: 1.6 }}>
                                Se eliminarán <strong>{prediosAfectados.length} predios</strong> y todos sus lotes asociados de <strong>"{lugar.nombre}"</strong>. Esta acción no se puede deshacer.
                            </p>
                        ) : (
                            <p style={{ margin: 0, fontSize: 14, color: C.textoMuted, lineHeight: 1.6 }}>
                                Se moverán <strong>{prediosAfectados.length} predios</strong> (y sus lotes) de <strong>"{lugar.nombre}"</strong> a <strong>"{destino?.nombre}"</strong>, luego se eliminará el lugar.
                            </p>
                        )}
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                        <BtnGris onClick={() => setPaso(1)} style={{ flex: 1, justifyContent: "center" }}>← Atrás</BtnGris>
                        <BtnRojo onClick={handleConfirmar}  style={{ flex: 1, justifyContent: "center" }}>Confirmar</BtnRojo>
                    </div>
                </div>
            </Overlay>
        );
    }

    /* Paso 1: listado de predios afectados y elección de acción */
    return (
        <Overlay onClose={onCancelar}>
            <div style={{ background: C.blanco, borderRadius: 16, padding: 28, width: 460, maxWidth: "95vw", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 8px 40px rgba(0,0,0,0.2)" }}>
                <h3 style={{ margin: "0 0 6px", fontSize: 17, fontWeight: 700, color: C.texto }}>Eliminar lugar de producción</h3>
                <p style={{ margin: "0 0 16px", fontSize: 14, color: C.textoMuted }}>"{lugar.nombre}" tiene predios asociados.</p>

                {prediosAfectados.length > 0 ? (
                    <div style={{ background: C.rojoPastel, borderRadius: 10, padding: "12px 14px", marginBottom: 16 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: C.rojo, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Predios que se verán afectados</div>
                        {prediosAfectados.map(p => (
                            <div key={p.id} style={{ fontSize: 14, color: C.rojo, padding: "4px 0", borderBottom: `1px solid ${C.rojo}20` }}>
                                🏡 {p.nombre} <span style={{ fontSize: 12, opacity: 0.7 }}>({p.areaHa} ha)</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ background: C.verdePastel, borderRadius: 10, padding: "12px 14px", marginBottom: 16, fontSize: 14, color: C.verde }}>
                        ✅ Este lugar no tiene predios. Se puede eliminar sin consecuencias.
                    </div>
                )}

                {prediosAfectados.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                        {/* Opción A: eliminar en cascada */}
                        <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "10px 14px", borderRadius: 10, border: `2px solid ${accion === "eliminar" ? C.rojo : C.borde}`, background: accion === "eliminar" ? C.rojoPastel : C.blanco }}>
                            <input type="radio" name="accionLugar" value="eliminar" checked={accion === "eliminar"} onChange={() => setAccion("eliminar")} />
                            <div>
                                <div style={{ fontSize: 14, fontWeight: 700, color: accion === "eliminar" ? C.rojo : C.texto }}>Eliminar todo</div>
                                <div style={{ fontSize: 12, color: C.textoMuted }}>Se eliminan el lugar, sus predios y todos los lotes asociados.</div>
                            </div>
                        </label>

                        {/* Opción B: mover predios a otro lugar antes de eliminar */}
                        <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: otrosLugares.length === 0 ? "not-allowed" : "pointer", padding: "10px 14px", borderRadius: 10, border: `2px solid ${accion === "mover" ? C.azul : C.borde}`, background: accion === "mover" ? C.azulPastel : C.blanco, opacity: otrosLugares.length === 0 ? 0.5 : 1 }}>
                            <input type="radio" name="accionLugar" value="mover" checked={accion === "mover"} onChange={() => setAccion("mover")} disabled={otrosLugares.length === 0} style={{ marginTop: 3 }} />
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 14, fontWeight: 700, color: accion === "mover" ? C.azul : C.texto }}>Mover predios a otro lugar</div>
                                <div style={{ fontSize: 12, color: C.textoMuted, marginBottom: accion === "mover" ? 8 : 0 }}>Los predios y sus lotes se reasignan antes de eliminar este lugar.</div>
                                {accion === "mover" && (
                                    <select value={destinoId} onChange={e => setDestinoId(e.target.value)} style={{ ...inputStyle(!destinoId), marginTop: 6 }}>
                                        <option value="">Seleccione destino...</option>
                                        {otrosLugares.map(l => <option key={l.id} value={l.id}>{l.nombre}</option>)}
                                    </select>
                                )}
                                {otrosLugares.length === 0 && (
                                    <div style={{ fontSize: 12, color: C.textoMuted, fontStyle: "italic" }}>No hay otros lugares disponibles.</div>
                                )}
                            </div>
                        </label>
                    </div>
                )}

                <div style={{ display: "flex", gap: 10 }}>
                    <BtnGris onClick={onCancelar} style={{ flex: 1, justifyContent: "center" }}>Cancelar</BtnGris>
                    <BtnRojo
                        onClick={prediosAfectados.length === 0 ? () => onEliminarTodo(lugar) : handleSiguiente}
                        style={{ flex: 1, justifyContent: "center" }}
                    >
                        {prediosAfectados.length === 0 ? "Eliminar" : "Siguiente →"}
                    </BtnRojo>
                </div>
            </div>
        </Overlay>
    );
}

// ══════════════════════════════════════════════════════════════════════════════
// MODAL: Eliminar PREDIO con gestión de lotes asociados
//
// Mismo flujo de dos pasos que ModalEliminarLugar pero para predios:
//   Paso 1 — Lista los lotes afectados, ofrece "Eliminar todo" o "Mover lotes"
//   Paso 2 — Confirmación final
// ══════════════════════════════════════════════════════════════════════════════
function ModalEliminarPredio({ predio, lotes, predios, onCancelar, onEliminarTodo, onMover }) {
    const lotesAfectados = lotes.filter(l => l.predioId === predio.id);
    const otrosPredios   = predios.filter(p => p.id !== predio.id); // posibles destinos

    const [accion,    setAccion]    = useState("eliminar");
    const [destinoId, setDestinoId] = useState("");
    const [paso,      setPaso]      = useState(1);

    const handleSiguiente = () => {
        if (accion === "mover" && !destinoId) return;
        setPaso(2);
    };
    const handleConfirmar = () => {
        if (accion === "eliminar") onEliminarTodo(predio);
        else onMover(predio, Number(destinoId));
    };

    /* Paso 2: confirmación final */
    if (paso === 2) {
        const destino = otrosPredios.find(p => p.id === Number(destinoId));
        return (
            <Overlay onClose={onCancelar}>
                <div style={{ background: C.blanco, borderRadius: 16, padding: 28, width: 420, maxWidth: "95vw", boxShadow: "0 8px 40px rgba(0,0,0,0.2)" }}>
                    <div style={{ textAlign: "center", marginBottom: 20 }}>
                        <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
                        <h3 style={{ margin: "0 0 8px", fontSize: 17, fontWeight: 700, color: C.texto }}>¿Confirmar acción?</h3>
                        {accion === "eliminar" ? (
                            <p style={{ margin: 0, fontSize: 14, color: C.textoMuted, lineHeight: 1.6 }}>
                                Se eliminarán <strong>{lotesAfectados.length} lotes</strong> junto con el predio <strong>"{predio.nombre}"</strong>. Esta acción no se puede deshacer.
                            </p>
                        ) : (
                            <p style={{ margin: 0, fontSize: 14, color: C.textoMuted, lineHeight: 1.6 }}>
                                Se moverán <strong>{lotesAfectados.length} lotes</strong> de <strong>"{predio.nombre}"</strong> al predio <strong>"{destino?.nombre}"</strong>, luego se eliminará el predio.
                            </p>
                        )}
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                        <BtnGris onClick={() => setPaso(1)} style={{ flex: 1, justifyContent: "center" }}>← Atrás</BtnGris>
                        <BtnRojo onClick={handleConfirmar}  style={{ flex: 1, justifyContent: "center" }}>Confirmar</BtnRojo>
                    </div>
                </div>
            </Overlay>
        );
    }

    /* Paso 1: listado de lotes y elección de acción */
    return (
        <Overlay onClose={onCancelar}>
            <div style={{ background: C.blanco, borderRadius: 16, padding: 28, width: 460, maxWidth: "95vw", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 8px 40px rgba(0,0,0,0.2)" }}>
                <h3 style={{ margin: "0 0 6px", fontSize: 17, fontWeight: 700, color: C.texto }}>Eliminar predio</h3>
                <p style={{ margin: "0 0 16px", fontSize: 14, color: C.textoMuted }}>"{predio.nombre}" tiene lotes asociados.</p>

                {lotesAfectados.length > 0 ? (
                    <div style={{ background: C.rojoPastel, borderRadius: 10, padding: "12px 14px", marginBottom: 16 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: C.rojo, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Lotes que se verán afectados</div>
                        {lotesAfectados.map(l => (
                            <div key={l.id} style={{ fontSize: 14, color: C.rojo, padding: "4px 0", borderBottom: `1px solid ${C.rojo}20` }}>
                                🌿 {l.nombre} <span style={{ fontSize: 12, opacity: 0.7 }}>({l.areaHa} ha · {l.estadoLote})</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ background: C.verdePastel, borderRadius: 10, padding: "12px 14px", marginBottom: 16, fontSize: 14, color: C.verde }}>
                        ✅ Este predio no tiene lotes. Se puede eliminar sin consecuencias.
                    </div>
                )}

                {lotesAfectados.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                        {/* Opción A: eliminar predio + lotes */}
                        <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "10px 14px", borderRadius: 10, border: `2px solid ${accion === "eliminar" ? C.rojo : C.borde}`, background: accion === "eliminar" ? C.rojoPastel : C.blanco }}>
                            <input type="radio" name="accionPredio" value="eliminar" checked={accion === "eliminar"} onChange={() => setAccion("eliminar")} />
                            <div>
                                <div style={{ fontSize: 14, fontWeight: 700, color: accion === "eliminar" ? C.rojo : C.texto }}>Eliminar todo</div>
                                <div style={{ fontSize: 12, color: C.textoMuted }}>Se eliminan el predio y todos sus lotes asociados.</div>
                            </div>
                        </label>

                        {/* Opción B: reasignar lotes a otro predio */}
                        <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: otrosPredios.length === 0 ? "not-allowed" : "pointer", padding: "10px 14px", borderRadius: 10, border: `2px solid ${accion === "mover" ? C.azul : C.borde}`, background: accion === "mover" ? C.azulPastel : C.blanco, opacity: otrosPredios.length === 0 ? 0.5 : 1 }}>
                            <input type="radio" name="accionPredio" value="mover" checked={accion === "mover"} onChange={() => setAccion("mover")} disabled={otrosPredios.length === 0} style={{ marginTop: 3 }} />
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 14, fontWeight: 700, color: accion === "mover" ? C.azul : C.texto }}>Mover lotes a otro predio</div>
                                <div style={{ fontSize: 12, color: C.textoMuted, marginBottom: accion === "mover" ? 8 : 0 }}>Los lotes se reasignan a otro predio antes de eliminar este.</div>
                                {accion === "mover" && (
                                    <select value={destinoId} onChange={e => setDestinoId(e.target.value)} style={{ ...inputStyle(!destinoId), marginTop: 6 }}>
                                        <option value="">Seleccione predio destino...</option>
                                        {otrosPredios.map(p => <option key={p.id} value={p.id}>{p.nombre} ({p.lugarNombre})</option>)}
                                    </select>
                                )}
                                {otrosPredios.length === 0 && (
                                    <div style={{ fontSize: 12, color: C.textoMuted, fontStyle: "italic" }}>No hay otros predios disponibles.</div>
                                )}
                            </div>
                        </label>
                    </div>
                )}

                <div style={{ display: "flex", gap: 10 }}>
                    <BtnGris onClick={onCancelar} style={{ flex: 1, justifyContent: "center" }}>Cancelar</BtnGris>
                    <BtnRojo
                        onClick={lotesAfectados.length === 0 ? () => onEliminarTodo(predio) : handleSiguiente}
                        style={{ flex: 1, justifyContent: "center" }}
                    >
                        {lotesAfectados.length === 0 ? "Eliminar" : "Siguiente →"}
                    </BtnRojo>
                </div>
            </div>
        </Overlay>
    );
}

// ══════════════════════════════════════════════════════════════════════════════
// CRUD LUGARES — Modales de ver y de formulario
// ══════════════════════════════════════════════════════════════════════════════

// Modal de detalle (solo lectura) de un Lugar de producción.
// Muestra estado sanitario, datos geográficos, cultivos y predios que lo componen.
// Botones: Editar | Eliminar (en fila) + Cerrar (abajo)
function ModalVerLugar({ lugar, predios, onClose, onEditar, onEliminar }) {
    console.log("lugar.id:", lugar.id);
    console.log("predios lugarIds:", predios.map(p => ({ id: p.id, lugarId: p.lugarId })));
    console.log("predios lugarIds:", JSON.stringify(predios.map(p => ({ id: p.id, lugarId: p.lugarId }))));
    const prediosLugar = predios.filter(p => p.lugarId === lugar.id);
    const areaTotal = prediosLugar.reduce((s, p) => s + (p.areaHa || 0), 0).toFixed(2);

    return (
        <Overlay onClose={onClose}>
            <ModalShell titulo={lugar.nombre} subtitulo="Lugar de producción" onClose={onClose} ancho={500}>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
    <FilaInfo label="Registro ICA"      valor={lugar.ica || "—"} />  {/* ← agrega */}
    <FilaInfo label="Área total"        valor={`${areaTotal} ha`} />
    <FilaInfo label="Número de predios" valor={prediosLugar.length} />
    <FilaInfo label="Departamento"      valor={lugar.departamento || "—"} />
    <FilaInfo label="Municipio"         valor={lugar.municipio    || "—"} />
    <FilaInfo label="Vereda"            valor={lugar.vereda       || "—"} />
</div>
                <Divider />

                <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.textoMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Cultivos</div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {lugar.cultivos?.length > 0 ? lugar.cultivos.map((c, i) => {
                            const cols = [["#F3E5F5","#6A1B9A"],["#E3F2FD","#1565C0"],["#FFF3E0","#E65100"],["#E8F5E9","#2E7D32"]];
                            const [bg, col] = cols[i % 4];
                            return <span key={i} style={{ background: bg, color: col, fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>{c.nombre || c}</span>;
                        }) : <span style={{ fontSize: 14, color: C.textoMuted }}>Sin cultivos asignados</span>}
                    </div>
                </div>
                <Divider />

                <div style={{ fontSize: 11, fontWeight: 700, color: C.textoMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>Predios que lo componen</div>
                <div style={{ display: "grid", gap: 10, marginBottom: 22 }}>
                    {prediosLugar.map(p => (
                        <div key={p.id} style={{ borderRadius: 10, border: `1px solid ${C.borde}`, overflow: "hidden" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: C.grisPastel }}>
                                <div>
                                    <div style={{ fontSize: 14, fontWeight: 700, color: C.texto }}>{p.nombre}</div>
                                    <div style={{ fontSize: 12, color: C.textoMuted }}>{p.areaHa} ha</div>
                                </div>
                            </div>
                            <div style={{ padding: "10px 14px", display: "flex", gap: 6, flexWrap: "wrap" }}>
                                {p.cultivos?.map((c, i) => {
                                    const cols = [["#F3E5F5","#6A1B9A"],["#E3F2FD","#1565C0"],["#FFF3E0","#E65100"],["#E8F5E9","#2E7D32"]];
                                    const [bg, col] = cols[i % 4];
                                    return <span key={i} style={{ background: bg, color: col, fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>{c.nombre || c}</span>;
                                })}
                            </div>
                        </div>
                    ))}
                    {prediosLugar.length === 0 && (
                        <p style={{ margin: 0, fontSize: 14, color: C.textoMuted }}>Sin predios asociados.</p>
                    )}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ display: "flex", gap: 10 }}>
                        <BtnEditar onClick={() => onEditar(lugar)}   style={{ flex: 1, justifyContent: "center" }}>✏️ Editar</BtnEditar>
                        <BtnRojo   onClick={() => onEliminar(lugar)} style={{ flex: 1, justifyContent: "center" }}>🗑️ Eliminar</BtnRojo>
                    </div>
                    <BtnGris onClick={onClose} style={{ width: "100%", justifyContent: "center", padding: "11px 18px" }}>Cerrar</BtnGris>
                </div>
            </ModalShell>
        </Overlay>
    );
}

// Modal de formulario para Crear o Editar un Lugar de producción.
// Cultivos: input libre con límite de CULTIVOS_MAX_LUGAR.
// Departamento/Municipio: cargados en cascada desde la API geográfica.
// Validaciones: nombre, ICA, ubicación, área (con límites reales), al menos un cultivo.
function ModalFormLugar({ lugar, onClose, onGuardar, cultivosDisponibles = [] }) {
    const esEdicion     = !!lugar;
    const departamentos = useDepartamentos();

    const [form, setForm] = useState({
        nombre:         lugar?.nombre       || "",
        departamento:   lugar?.departamento || "",
        departamentoId: "",
        municipio:      lugar?.municipio    || "",
        municipioId:    "",
        vereda:         lugar?.vereda       || "",
        // cultivos es array de objetos {id, nombre}
        cultivos:       lugar?.cultivos?.length > 0 ? lugar.cultivos : [null],
    });
    const [errores, setErrores] = useState({});
    const municipios = useMunicipios(form.departamentoId);
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const handleDpto = (e) => {
        const id     = e.target.value;
        const nombre = departamentos.find(d => String(d.id) === id)?.nombre || "";
        setForm(f => ({ ...f, departamentoId: id, departamento: nombre, municipioId: "", municipio: "" }));
    };

    const handleMun = (e) => {
        const id     = e.target.value;
        const nombre = municipios.find(m => String(m.id) === id)?.nombre || "";
        setForm(f => ({ ...f, municipioId: id, municipio: nombre }));
    };

    const validar = () => {
        const e = {};
        if (!form.nombre.trim())  e.nombre      = "Nombre requerido";
        if (!form.departamento)   e.departamento = "Departamento requerido";
        if (!form.municipio)      e.municipio    = "Municipio requerido";
        const cultivosValidos = form.cultivos.filter(Boolean);
        if (cultivosValidos.length === 0) e.cultivos = "Seleccione al menos un cultivo";
        setErrores(e);
        return Object.keys(e).length === 0;
    };

    const handleGuardar = () => {
        if (!validar()) return;
        onGuardar({
            ...lugar,
            nombre:       form.nombre.trim(),
            departamento: form.departamento,
            municipio:    form.municipio,
            municipioId:  form.municipioId,
            vereda:       form.vereda.trim(),
            cultivos:     form.cultivos.filter(Boolean),
        });
    };

    return (
        <Overlay onClose={onClose}>
            <ModalShell
                titulo={esEdicion ? "Editar lugar" : "Crear lugar de producción"}
                subtitulo={esEdicion ? "Modificar datos" : "Nuevo registro"}
                onClose={onClose} ancho={490}
            >
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <CampoForm label="Nombre *" error={errores.nombre}>
                        <input value={form.nombre} onChange={e => { set("nombre", e.target.value); setErrores(er => ({ ...er, nombre: "" })); }} style={inputStyle(errores.nombre)} />
                    </CampoForm>

                    <CampoForm label="Vereda">
                        <input value={form.vereda} onChange={e => set("vereda", e.target.value)} placeholder="Ej. Vereda El Carmen" style={inputStyle(false)} />
                    </CampoForm>

                    <CampoForm label="Departamento *" error={errores.departamento}>
                        <select value={form.departamentoId} onChange={handleDpto} style={inputStyle(errores.departamento)}>
                            <option value="">Seleccione...</option>
                            {departamentos.map(d => <option key={d.id} value={d.id}>{d.nombre}</option>)}
                        </select>
                    </CampoForm>

                    <CampoForm label="Municipio *" error={errores.municipio}>
                        <select value={form.municipioId} onChange={handleMun} disabled={!form.departamentoId} style={inputStyle(errores.municipio)}>
                            <option value="">Seleccione...</option>
                            {municipios.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                        </select>
                    </CampoForm>

                    <div style={{ gridColumn: "1 / -1" }}>
                        <CampoForm label="Cultivos *" error={errores.cultivos}>
                            <SelectorCultivos
                                cultivos={form.cultivos}
                                onChange={nuevos => { set("cultivos", nuevos); setErrores(er => ({ ...er, cultivos: "" })); }}
                                opcionesDisponibles={cultivosDisponibles}
                                max={5}
                            />
                        </CampoForm>
                    </div>
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
                    <BtnGris  onClick={onClose}       style={{ flex: 1, justifyContent: "center" }}>Cancelar</BtnGris>
                    <BtnVerde onClick={handleGuardar} style={{ flex: 1, justifyContent: "center" }}>
                        {esEdicion ? "💾 Guardar cambios" : "✓ Crear lugar"}
                    </BtnVerde>
                </div>
            </ModalShell>
        </Overlay>
    );
}

// ══════════════════════════════════════════════════════════════════════════════
// CRUD PREDIOS — Modales de ver y de formulario
// ══════════════════════════════════════════════════════════════════════════════

// Modal de detalle (solo lectura) de un Predio.
// Muestra datos del predio, su estado sanitario e historial de inspecciones.
// Botones: Editar | Eliminar + Cerrar
function ModalVerPredio({ predio, onClose, onEditar, onEliminar }) {
    const [historial, setHistorial] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        fetch(`https://proyectointegrador5.onrender.com/api/inspecciones/solicitudes/productor/${predio.id}`)
            .then(r => r.json())
            .then(data => setHistorial(Array.isArray(data) ? data.filter(s => s.estado === 'completada') : []))
            .catch(() => {})
            .finally(() => setCargando(false));
    }, [predio.id]);

    return (
        <Overlay onClose={onClose}>
            <ModalShell titulo={predio.nombre} subtitulo="Predio asociado" onClose={onClose} ancho={520}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
                    <FilaInfo label="Matrícula"           valor={predio.matricula} />
                    <FilaInfo label="Área"                valor={`${predio.areaHa} ha`} />
                    <FilaInfo label="Lugar de producción" valor={predio.lugarNombre} />
                    <FilaInfo label="Municipio / Vereda"  valor={`${predio.municipio} / ${predio.vereda || "—"}`} />
                    <FilaInfo label="Cultivos"            valor={predio.cultivos.map(c => c.nombre).join(", ")} />
                </div>
                <div style={{ background: C.verdePastel, borderRadius: 10, padding: "12px 14px", marginBottom: 16 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.verde, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Estado sanitario</div>
                    <Badge estado={predio.estadoSanitario} />
                </div>
                <Divider />

                <div style={{ fontSize: 11, fontWeight: 700, color: C.textoMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>Historial de inspecciones</div>
                <div style={{ display: "grid", gap: 8, marginBottom: 22 }}>
                    {cargando && <p style={{ fontSize: 14, color: C.textoMuted, margin: 0 }}>Cargando...</p>}
                    {!cargando && historial.length === 0 && (
                        <p style={{ fontSize: 14, color: C.textoMuted, margin: 0 }}>Sin inspecciones registradas.</p>
                    )}
                    {historial.map(ins => (
                        <div key={ins.id} style={{ borderRadius: 10, border: `1px solid ${C.borde}`, padding: "13px 15px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                                <span style={{ fontSize: 14, fontWeight: 700, color: C.texto }}>
                                    {new Date(ins.fechaSolicitud).toLocaleDateString('es-CO')}
                                </span>
                                <Badge estado="Aprobado" />
                            </div>
                            <div style={{ fontSize: 13, color: C.textoMuted, lineHeight: 1.5 }}>
                                {ins.observaciones || 'Sin observaciones'}
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ display: "flex", gap: 10 }}>
                        <BtnEditar onClick={() => onEditar(predio)}   style={{ flex: 1, justifyContent: "center" }}>✏️ Editar</BtnEditar>
                        <BtnRojo   onClick={() => onEliminar(predio)} style={{ flex: 1, justifyContent: "center" }}>🗑️ Eliminar</BtnRojo>
                    </div>
                    <BtnGris onClick={onClose} style={{ width: "100%", justifyContent: "center", padding: "11px 18px" }}>Cerrar</BtnGris>
                </div>
            </ModalShell>
        </Overlay>
    );
}

// Modal de formulario para Crear o Editar un Predio.
// Cultivos: restringidos a los del lugar padre seleccionado, sin duplicados.
// Departamento/Municipio en cascada desde API.
// Al cambiar el lugar, cultivos se reinician para evitar valores inválidos.
function ModalFormPredio({ predio, lugares, onClose, onGuardar }) {
    const esEdicion = !!predio;

    const [form, setForm] = useState({
    nombre:    predio?.nombre    || "",
    lugarId:   predio?.lugarId   || "",
    matricula: predio?.matricula || "",
    areaHa:    predio?.areaHa    || "",
    vereda:    predio?.vereda    || "",  // ← ya está, no hay que cambiar nada
    cultivos:  predio?.cultivos?.length > 0 ? predio.cultivos : [null],
});
    const [errores, setErrores] = useState({});
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const lugarSeleccionado   = lugares.find(l => l.id === Number(form.lugarId));
    // cultivos disponibles para este predio = cultivos del lugar seleccionado
    const cultivosDisponibles = lugarSeleccionado?.cultivos || [];

const handleCambioLugar = (nuevoId) => {
    const lugarSel = lugares.find(l => l.id === Number(nuevoId));
    setForm(f => ({ 
        ...f, 
        lugarId: nuevoId, 
        cultivos: [null],
        vereda: lugarSel?.vereda || "",
    }));
    setErrores(er => ({ ...er, lugarId: "" }));
};

    const validar = () => {
        const e = {};
        if (!form.nombre.trim())    e.nombre    = "Nombre requerido";
        if (!form.lugarId)          e.lugarId   = "Seleccione un lugar";
        if (!form.areaHa) {
            e.areaHa = "Área requerida";
        } else {
            const ha = parseFloat(form.areaHa);
            if (isNaN(ha) || ha < 0.01) e.areaHa = "El área mínima es 0.01 ha";
            else if (ha > 5000)         e.areaHa = "El área máxima es 5000 ha";
        }
        setErrores(e);
        return Object.keys(e).length === 0;
    };

    const handleGuardar = () => {
        if (!validar()) return;
        const lugarSel = lugares.find(l => l.id === Number(form.lugarId));
        onGuardar({
            ...predio,
            nombre:       form.nombre.trim(),
            lugarId:      Number(form.lugarId),
            lugarNombre:  lugarSel?.nombre      || "",
            municipio:    lugarSel?.municipio   || "",
            departamento: lugarSel?.departamento || "",
            matricula:    form.matricula.trim(),
            areaHa:       parseFloat(form.areaHa),
            vereda:       form.vereda.trim(),
            cultivos:     form.cultivos.filter(Boolean),
            proximaInspeccion: predio?.proximaInspeccion || null,
        });
    };

    return (
        <Overlay onClose={onClose}>
            <ModalShell
                titulo={esEdicion ? "Editar predio" : "Crear nuevo predio"}
                subtitulo={esEdicion ? "Modificar datos" : "Nuevo registro"}
                onClose={onClose} ancho={500}
            >
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <CampoForm label="Nombre *" error={errores.nombre}>
                        <input value={form.nombre} onChange={e => { set("nombre", e.target.value); setErrores(er => ({ ...er, nombre: "" })); }} style={inputStyle(errores.nombre)} />
                    </CampoForm>

                    <CampoForm label="Lugar de producción *" error={errores.lugarId}>
                        <select value={form.lugarId} onChange={e => handleCambioLugar(e.target.value)} style={inputStyle(errores.lugarId)}>
                            <option value="">Seleccione...</option>
                            {lugares.map(l => <option key={l.id} value={l.id}>{l.nombre}</option>)}
                        </select>
                    </CampoForm>

                    <CampoForm label="Matrícula ICA">
    <input 
        value={form.matricula} 
        readOnly 
        style={{ ...inputStyle(false), background: "#f5f5f5", color: C.textoMuted }} 
    />
</CampoForm>

                    <CampoForm label="Área (ha) * (máx. 5000)" error={errores.areaHa}>
                        <input type="number" min="0.01" max="5000" step="0.01" value={form.areaHa} onChange={e => { set("areaHa", e.target.value); setErrores(er => ({ ...er, areaHa: "" })); }} style={inputStyle(errores.areaHa)} />
                    </CampoForm>

                    {/* Municipio y departamento readonly desde el lugar */}
                    <CampoForm label="Departamento">
                        <input value={lugarSeleccionado?.departamento || "—"} readOnly style={{ ...inputStyle(false), background: "#f5f5f5", color: C.textoMuted }} />
                    </CampoForm>

                    <CampoForm label="Municipio">
                        <input value={lugarSeleccionado?.municipio || "—"} readOnly style={{ ...inputStyle(false), background: "#f5f5f5", color: C.textoMuted }} />
                    </CampoForm>

                    <CampoForm label="Vereda">
    <input 
        value={form.vereda} 
        readOnly 
        style={{ ...inputStyle(false), background: "#f5f5f5", color: C.textoMuted }} 
    />
</CampoForm>

                    <div style={{ gridColumn: "1 / -1" }}>
                        <CampoForm label="Cultivos">
                            {form.lugarId ? (
                                <SelectorCultivos
                                    cultivos={form.cultivos}
                                    onChange={nuevos => set("cultivos", nuevos)}
                                    opcionesDisponibles={cultivosDisponibles}
                                />
                            ) : (
                                <div style={{ background: C.amarilloPastel, border: `1px solid ${C.amarillo}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#B7770D", fontWeight: 600 }}>
                                    ⚠️ Seleccione un lugar de producción para ver los cultivos disponibles.
                                </div>
                            )}
                        </CampoForm>
                    </div>
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
                    <BtnGris  onClick={onClose}       style={{ flex: 1, justifyContent: "center" }}>Cancelar</BtnGris>
                    <BtnVerde onClick={handleGuardar} style={{ flex: 1, justifyContent: "center" }}>
                        {esEdicion ? "💾 Guardar cambios" : "✓ Crear predio"}
                    </BtnVerde>
                </div>
            </ModalShell>
        </Overlay>
    );
}

// ══════════════════════════════════════════════════════════════════════════════
// CRUD LOTES — Modales de ver y de formulario
// ══════════════════════════════════════════════════════════════════════════════

// Modal de detalle (solo lectura) de un Lote.
// Muestra predio, lugar, área, cultivos y estado.
// Botones: Editar | Eliminar + Cerrar
function ModalVerLote({ lote, onClose, onEditar, onEliminar }) {
    return (
        <Overlay onClose={onClose}>
            <ModalShell titulo={lote.nombre} subtitulo="Detalle del lote" onClose={onClose} ancho={460}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
                    <FilaInfo label="Predio"              valor={lote.predioNombre} />
                    <FilaInfo label="Lugar de producción" valor={lote.lugarNombre} />
                    <FilaInfo label="Área"                valor={`${lote.areaHa} ha`} />
                    <FilaInfo label="Estado"              valor={lote.estadoLote} />
                </div>
                <Divider />
                <div style={{ fontSize: 11, fontWeight: 700, color: C.textoMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>Cultivos del lote</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 22 }}>
    {lote.cultivos.map((c, i) => {
        const cols = [["#F3E5F5","#6A1B9A"],["#E3F2FD","#1565C0"],["#FFF3E0","#E65100"],["#E8F5E9","#2E7D32"]];
        const [bg, col] = cols[i % 4];
        return <span key={i} style={{ background: bg, color: col, fontSize: 13, fontWeight: 700, padding: "4px 12px", borderRadius: 20 }}>{c.nombre || c}</span>;
    })}
</div>
                <div style={{ background: C.verdePastel, borderRadius: 10, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.verde, textTransform: "uppercase", letterSpacing: 0.5 }}>Estado del lote</span>
                    <Badge estado={lote.estadoLote} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ display: "flex", gap: 10 }}>
                        <BtnEditar onClick={() => onEditar(lote)}   style={{ flex: 1, justifyContent: "center" }}>✏️ Editar</BtnEditar>
                        <BtnRojo   onClick={() => onEliminar(lote)} style={{ flex: 1, justifyContent: "center" }}>🗑️ Eliminar</BtnRojo>
                    </div>
                    <BtnGris onClick={onClose} style={{ width: "100%", justifyContent: "center", padding: "11px 18px" }}>Cerrar</BtnGris>
                </div>
            </ModalShell>
        </Overlay>
    );
}

// Modal de formulario para Crear o Editar un Lote.
// Cultivos: restringidos a los del predio padre seleccionado, sin duplicados.
// Área máxima: no puede superar el área del predio al que pertenece.
// Al cambiar el predio, cultivos se reinician.
function ModalFormLote({ lote, predios, onClose, onGuardar }) {
    const esEdicion = !!lote;
    const [form, setForm] = useState({
        nombre:     lote?.nombre     || "",
        predioId:   lote?.predioId   || "",
        areaHa:     lote?.areaHa     || "",
        cultivos:   lote?.cultivos?.length > 0 ? lote.cultivos : [null],
        estadoLote: lote?.estadoLote || "Activo",
    });
    const [errores, setErrores] = useState({});
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const predioSeleccionado  = predios.find(p => p.id === Number(form.predioId));
    // cultivos disponibles para el lote = cultivos del predio seleccionado
    const cultivosDisponibles = predioSeleccionado?.cultivos || [];

    const handleCambioPredio = (nuevoId) => {
        setForm(f => ({ ...f, predioId: nuevoId, cultivos: [null] }));
        setErrores(er => ({ ...er, predioId: "" }));
    };

    const validar = () => {
        const e = {};
        if (!form.nombre.trim()) e.nombre   = "Nombre requerido";
        if (!form.predioId)      e.predioId = "Seleccione un predio";
        if (!form.areaHa) {
            e.areaHa = "Área requerida";
        } else {
            const ha      = parseFloat(form.areaHa);
            const maxLote = predioSeleccionado ? predioSeleccionado.areaHa : 5000;
            if (isNaN(ha) || ha < 0.01) e.areaHa = "El área mínima es 0.01 ha";
            else if (ha > maxLote)      e.areaHa = `El lote no puede superar el área del predio (${maxLote} ha)`;
        }
        setErrores(e);
        return Object.keys(e).length === 0;
    };

    const handleGuardar = () => {
        if (!validar()) return;
        const predioSel = predios.find(p => p.id === Number(form.predioId));
        onGuardar({
            ...lote,
            nombre:       form.nombre.trim(),
            predioId:     Number(form.predioId),
            predioNombre: predioSel?.nombre      || "",
            lugarNombre:  predioSel?.lugarNombre || "",
            areaHa:       parseFloat(form.areaHa),
            cultivos:     form.cultivos.filter(Boolean),
            estadoLote:   form.estadoLote,
        });
    };

    return (
        <Overlay onClose={onClose}>
            <ModalShell
                titulo={esEdicion ? "Editar lote" : "Crear nuevo lote"}
                subtitulo={esEdicion ? "Modificar datos" : "Nuevo registro"}
                onClose={onClose} ancho={460}
            >
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <CampoForm label="Nombre del lote *" error={errores.nombre}>
                        <input value={form.nombre} onChange={e => { set("nombre", e.target.value); setErrores(er => ({ ...er, nombre: "" })); }} placeholder="Ej: Lote A" style={inputStyle(errores.nombre)} />
                    </CampoForm>

                    <CampoForm label="Predio *" error={errores.predioId}>
                        <select value={form.predioId} onChange={e => handleCambioPredio(e.target.value)} style={inputStyle(errores.predioId)}>
                            <option value="">Seleccione...</option>
                            {predios.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                        </select>
                    </CampoForm>

                    <CampoForm label={`Área (ha) *${predioSeleccionado ? ` (máx. ${predioSeleccionado.areaHa} ha)` : ""}`} error={errores.areaHa}>
                        <input type="number" min="0.01" max={predioSeleccionado?.areaHa || 5000} step="0.01" value={form.areaHa} onChange={e => { set("areaHa", e.target.value); setErrores(er => ({ ...er, areaHa: "" })); }} style={inputStyle(errores.areaHa)} />
                    </CampoForm>

                    <CampoForm label="Estado del lote">
                        <select value={form.estadoLote} onChange={e => set("estadoLote", e.target.value)} style={inputStyle(false)}>
                            <option>Activo</option>
                            <option>En revisión</option>
                            <option>Inactivo</option>
                        </select>
                    </CampoForm>

                    <div style={{ gridColumn: "1 / -1" }}>
                        <CampoForm label="Cultivos">
                            {form.predioId ? (
                                <SelectorCultivos
                                    cultivos={form.cultivos}
                                    onChange={nuevos => set("cultivos", nuevos)}
                                    opcionesDisponibles={cultivosDisponibles}
                                    max={3}
                                />
                            ) : (
                                <div style={{ background: C.amarilloPastel, border: `1px solid ${C.amarillo}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#B7770D", fontWeight: 600 }}>
                                    ⚠️ Seleccione un predio para ver los cultivos disponibles.
                                </div>
                            )}
                        </CampoForm>
                    </div>
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
                    <BtnGris  onClick={onClose}       style={{ flex: 1, justifyContent: "center" }}>Cancelar</BtnGris>
                    <BtnVerde onClick={handleGuardar} style={{ flex: 1, justifyContent: "center" }}>
                        {esEdicion ? "💾 Guardar cambios" : "✓ Crear lote"}
                    </BtnVerde>
                </div>
            </ModalShell>
        </Overlay>
    );
}

// ══════════════════════════════════════════════════════════════════════════════
// MODAL: Solicitar inspección (flujo de 2 pasos)
//
// Paso 1 — Elige el predio y la fecha sugerida (con validación)
// Paso 2 — Resumen para confirmar antes de enviar al API
// Estado exito — Mensaje de éxito y cierre automático a los 2 s
// ══════════════════════════════════════════════════════════════════════════════
function ModalSolicitar({ onClose, onSolicitudEnviada, prediosApi }) {
    const [paso,       setPaso]       = useState(1);
    const [form,       setForm]       = useState({ predioId: "", fecha: "", obs: "" });
    const [errores,    setErrores]    = useState({});
    const [enviando,   setEnviando]   = useState(false);
    const [exito,      setExito]      = useState(false);
    const [errorEnvio, setErrorEnvio] = useState("");
    const set      = (k, v) => setForm(f => ({ ...f, [k]: v }));
    const usuario  = JSON.parse(localStorage.getItem("usuario") || "{}");
    const predioSel = prediosApi.find(p => p.id === Number(form.predioId));

    const validar = () => {
        const e = {};
        if (!form.predioId) e.predioId = "Seleccione un predio";
        if (!form.fecha)    e.fecha    = "Seleccione una fecha";
        setErrores(e);
        return Object.keys(e).length === 0;
    };

    /* Envía la solicitud al backend y muestra éxito o error */
    const handleEnviar = async () => {
        setEnviando(true);
        setErrorEnvio("");
        try {
            const res = await fetch(`${BASE_URL}/inspecciones/solicitudes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productor_id:  usuario.id,
                    predio_id:     Number(form.predioId),
                    fechaSolicitud: form.fecha,
                    observaciones:  form.obs,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.mensaje || "Error al enviar");
            setExito(true);
            if (onSolicitudEnviada) onSolicitudEnviada();
            setTimeout(() => onClose(), 2000); // cierre automático
        } catch (err) {
            setErrorEnvio(err.message);
        } finally {
            setEnviando(false);
        }
    };

    return (
        <Overlay onClose={onClose}>
            <ModalShell titulo="Solicitar inspección" subtitulo="Nueva solicitud" onClose={onClose} ancho={460}>
                {exito ? (
                    /* Pantalla de éxito */
                    <div style={{ textAlign: "center", padding: "32px 0" }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: C.verde, marginBottom: 8 }}>¡Solicitud enviada!</div>
                        <div style={{ fontSize: 14, color: C.textoMuted }}>Se asignará un técnico en los próximos días hábiles.</div>
                    </div>
                ) : (
                    <>
                        {/* Indicador de pasos */}
                        <div style={{ display: "flex", marginBottom: 26, position: "relative" }}>
                            {["Predio y fecha", "Confirmar"].map((label, i) => (
                                <div key={i} style={{ flex: 1, textAlign: "center", position: "relative" }}>
                                    {/* Línea conectora entre pasos */}
                                    {i < 1 && (
                                        <div style={{ position: "absolute", top: 14, left: "50%", right: "-50%", height: 2, background: paso > 1 ? C.verde : C.borde, zIndex: 0 }} />
                                    )}
                                    <div style={{ width: 30, height: 30, borderRadius: "50%", background: paso >= i + 1 ? C.verde : C.borde, color: C.blanco, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 7px", fontWeight: 700, fontSize: 14, position: "relative", zIndex: 1 }}>
                                        {paso > i ? "✓" : i + 1}
                                    </div>
                                    <div style={{ fontSize: 13, color: paso === i + 1 ? C.verde : C.textoMuted, fontWeight: paso === i + 1 ? 700 : 400 }}>{label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Paso 1: selección de predio y fecha */}
                        {paso === 1 && (
                            <div style={{ display: "grid", gap: 16 }}>
                                <CampoForm label="Predio *" error={errores.predioId}>
                                    <select value={form.predioId} onChange={e => { set("predioId", e.target.value); setErrores(er => ({ ...er, predioId: "" })); }} style={inputStyle(errores.predioId)}>
                                        <option value="">Seleccione un predio...</option>
                                        {prediosApi.map(p => <option key={p.id} value={p.id}>{p.nombre} — {p.lugarproduccion}</option>)}
                                    </select>
                                </CampoForm>
                                <CampoForm label="Fecha sugerida *" error={errores.fecha}>
                                    <input type="date" value={form.fecha} onChange={e => { set("fecha", e.target.value); setErrores(er => ({ ...er, fecha: "" })); }} style={inputStyle(errores.fecha)} />
                                </CampoForm>
                            </div>
                        )}

                        {/* Paso 2: resumen antes de confirmar */}
                        {paso === 2 && predioSel && (
                            <div style={{ display: "grid", gap: 12 }}>
                                <div style={{ background: C.verdePastel, borderRadius: 10, padding: "16px 18px", display: "grid", gap: 12 }}>
                                    <FilaInfo label="Predio"              valor={predioSel.nombre} />
                                    <FilaInfo label="Lugar de producción" valor={predioSel.lugarproduccion} />
                                    <FilaInfo label="Fecha sugerida"      valor={form.fecha ? fmt(form.fecha) : "No indicada"} />
                                </div>
                                <div style={{ background: C.azulPastel, borderRadius: 10, padding: "12px 14px", fontSize: 14, color: C.azul, lineHeight: 1.5 }}>
                                    ℹ️ Su solicitud será revisada y se asignará un técnico en los próximos días hábiles.
                                </div>
                                {errorEnvio && (
                                    <div style={{ background: C.rojoPastel, borderRadius: 10, padding: "12px 14px", fontSize: 14, color: C.rojo, fontWeight: 600 }}>
                                        ⚠️ {errorEnvio}
                                    </div>
                                )}
                            </div>
                        )}

                        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
                            <BtnGris onClick={paso === 1 ? onClose : () => setPaso(1)} style={{ flex: 1, justifyContent: "center" }}>
                                {paso === 1 ? "Cancelar" : "← Atrás"}
                            </BtnGris>
                            <BtnVerde
                                onClick={paso === 1 ? () => { if (validar()) setPaso(2); } : handleEnviar}
                                style={{ flex: 1, justifyContent: "center", opacity: enviando ? 0.7 : 1 }}
                            >
                                {paso === 1 ? "Siguiente →" : enviando ? "Enviando..." : "✓ Enviar solicitud"}
                            </BtnVerde>
                        </div>
                    </>
                )}
            </ModalShell>
        </Overlay>
    );
}

// Modal de detalle de una solicitud de inspección (solo lectura)
function ModalInspeccion({ ins, onClose }) {
    const [lotesDetalle, setLotesDetalle] = useState([]);
    const [cargandoLotes, setCargandoLotes] = useState(false);

    useEffect(() => {
        if (!ins?.inspeccion_id) return;
        setCargandoLotes(true);
        fetch(`https://proyectointegrador5.onrender.com/api/inspecciones/inspecciones/${ins.inspeccion_id}/lotes`)
            .then(r => r.json())
            .then(data => setLotesDetalle(Array.isArray(data) ? data : []))
            .catch(() => {})
            .finally(() => setCargandoLotes(false));
    }, [ins?.inspeccion_id]);

    if (!ins) return null;
    return (
        <Overlay onClose={onClose}>
            <ModalShell titulo={`Solicitud #${ins.id}`} subtitulo="Detalle de solicitud" onClose={onClose} ancho={520}>
                <div style={{ display: "grid", gap: 14 }}>
                    <FilaInfo label="Lugar de producción" valor={ins.lugarproduccion} />
                    <FilaInfo label="Predio"              valor={ins.nombrePredio} />
                    <FilaInfo label="Fecha de solicitud"  valor={new Date(ins.fechaSolicitud).toLocaleDateString("es-CO")} />
                    <FilaInfo label="Observaciones de solicitud" valor={ins.observaciones || "Sin observaciones"} />

                    {ins.inspeccion_id && <>
                        <Divider />
                        <div style={{ fontSize: 11, fontWeight: 700, color: C.verde, textTransform: "uppercase", letterSpacing: 0.5 }}>Resultado de la inspección</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                            <FilaInfo label="Fecha de inspección" valor={ins.fechaInspeccion ? new Date(ins.fechaInspeccion).toLocaleDateString("es-CO") : "—"} />
                            <FilaInfo label="Nivel de riesgo"     valor={ins.nivelRiesgo || "—"} />
                            <FilaInfo label="Estado fitosanitario" valor={ins.estadoFitosanitario || "—"} />
                            <FilaInfo label="Resultado"           valor={ins.resultado || "—"} />
                        </div>

                        <Divider />
                        <div style={{ fontSize: 11, fontWeight: 700, color: C.verde, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>
                            Detalle por lote
                        </div>
                        {cargandoLotes && (
                            <p style={{ fontSize: 14, color: C.textoMuted, margin: 0 }}>Cargando lotes...</p>
                        )}
                        {!cargandoLotes && lotesDetalle.length === 0 && (
                            <p style={{ fontSize: 14, color: C.textoMuted, margin: 0 }}>Sin detalle por lote registrado.</p>
                        )}
                        {lotesDetalle.map((lote, i) => (
                            <div key={lote.id} style={{
                                borderRadius: 10, border: `1px solid ${C.borde}`, overflow: "hidden", marginBottom: 8
                            }}>
                                <div style={{ background: "#A5D6A7", padding: "8px 14px", display: "flex", alignItems: "center", gap: 8 }}>
                                    <span style={{ fontSize: 16 }}>🌿</span>
                                    <span style={{ fontWeight: 700, fontSize: 14, color: "#1B5E20" }}>Lote #{lote.lote_id}</span>
                                </div>
                                <div style={{ padding: "12px 14px", display: "grid", gap: 10 }}>
                                    <div>
                                        <div style={{ fontSize: 11, fontWeight: 700, color: C.textoMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Observaciones</div>
                                        <div style={{ fontSize: 14, color: C.texto }}>
                                            {lote.observaciones || "Sin observaciones"}
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 11, fontWeight: 700, color: C.textoMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>🦗 Plagas detectadas</div>
                                        {lote.plagasDetectadas ? (
                                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                                                {lote.plagasDetectadas.split(",").map((p, pi) => (
                                                    <span key={pi} style={{
                                                        background: C.rojoPastel, color: C.rojo,
                                                        fontSize: 13, fontWeight: 600,
                                                        padding: "3px 10px", borderRadius: 20
                                                    }}>{p.trim()}</span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span style={{ fontSize: 14, color: C.verde, fontWeight: 600 }}>✅ Sin plagas</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>}

                    <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: C.textoMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Estado</div>
                        <Badge estado={
                            ins.estado === "pendiente"                               ? "Pendiente"  :
                            ins.estado === "asignada"                                ? "En revisión":
                            ins.estado === "aprobada" || ins.estado === "completada" ? "Aprobada"   :
                            ins.estado === "rechazada"                               ? "rechazada"  :
                            ins.estado
                        } />
                    </div>
                </div>
                <div style={{ marginTop: 20 }}>
                    <BtnGris onClick={onClose} style={{ width: "100%", justifyContent: "center" }}>Cerrar</BtnGris>
                </div>
            </ModalShell>
        </Overlay>
    );
}

// ══════════════════════════════════════════════════════════════════════════════
// PÁGINAS
// ══════════════════════════════════════════════════════════════════════════════

// ── Dashboard ─────────────────────────────────────────────────────────────────
// Muestra: banner de alerta si hay inspecciones próximas, 4 tarjetas de stats,
// tabla resumida de lugares y leyenda de estados sanitarios.
// ── Dashboard ─────────────────────────────────────────────────────────────────
function PaginaDashboard({ setActiva, lugares, setLugares, predios, setPredios, lotes, setLotes, mostrarToast }) {
    const [lugarVer,   setLugarVer]   = useState(null);
    const [modalForm,  setModalForm]  = useState(null);
    const [modalElim,  setModalElim]  = useState(null);
    const [todosLosCultivos, setTodosLosCultivos] = useState([]);
    const [totalInspecciones, setTotalInspecciones] = useState(0);
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    const alertas = predios.filter(p => p.proximaInspeccion && diasRestantes(p.proximaInspeccion) <= 30).length;

    useEffect(() => {
        apiFetch("/predial/cultivos")
            .then(data => setTodosLosCultivos(Array.isArray(data) ? data : []))
            .catch(() => {});
        fetch(`https://proyectointegrador5.onrender.com/api/inspecciones/solicitudes/productor/${usuario.id}`)
            .then(r => r.json())
            .then(data => {
                const completadas = Array.isArray(data)
                    ? data.filter(s => s.estado === 'completada' || s.resultado === 'Completada').length
                    : 0;
                setTotalInspecciones(completadas);
            })
            .catch(() => {});
    }, []);

    /* Guardar (editar) lugar desde el dashboard */
    const handleGuardar = async (datos) => {
        try {
            await apiFetch(`/predial/lugares/${datos.id}`, { method: "PUT", body: JSON.stringify(lugarToBack(datos, datos.municipioId)) });
            setLugares(prev => prev.map(l => l.id === datos.id ? datos : l));
            mostrarToast("✅ Lugar actualizado");
            setModalForm(null);
            setLugarVer(null);
        } catch (err) { mostrarToast(`❌ ${err.message}`); }
    };

    /* Eliminar lugar + cascada desde el dashboard */
    const handleEliminarTodo = async (lugar) => {
        try {
            await apiFetch(`/predial/lugares/${lugar.id}`, { method: "DELETE" });
            const prediosIds = predios.filter(p => p.lugarId === lugar.id).map(p => p.id);
            setLotes(prev   => prev.filter(l => !prediosIds.includes(l.predioId)));
            setPredios(prev => prev.filter(p => p.lugarId !== lugar.id));
            setLugares(prev => prev.filter(l => l.id !== lugar.id));
            mostrarToast("🗑️ Lugar, predios y lotes eliminados");
            setModalElim(null);
            setLugarVer(null);
        } catch (err) { mostrarToast(`❌ ${err.message}`); }
    };

    /* Mover predios a otro lugar y luego eliminar */
    const handleMoverPredios = async (lugar, destinoId) => {
        try {
            const destino = lugares.find(l => l.id === destinoId);
            await Promise.all(
                predios
                    .filter(p => p.lugarId === lugar.id)
                    .map(p => apiFetch(`/predial/predios/${p.id}`, { method: "PUT", body: JSON.stringify(predioToBack({ ...p, lugarId: destinoId })) }))
            );
            await apiFetch(`/predial/lugares/${lugar.id}`, { method: "DELETE" });
            setPredios(prev => prev.map(p => p.lugarId === lugar.id ? { ...p, lugarId: destinoId, lugarNombre: destino?.nombre || p.lugarNombre } : p));
            setLotes(prev => prev.map(l => {
                const predioDelLote = predios.find(p => p.id === l.predioId);
                return predioDelLote?.lugarId === lugar.id ? { ...l, lugarNombre: destino?.nombre || l.lugarNombre } : l;
            }));
            setLugares(prev => prev.filter(l => l.id !== lugar.id));
            mostrarToast("✅ Predios movidos y lugar eliminado");
            setModalElim(null);
            setLugarVer(null);
        } catch (err) { mostrarToast(`❌ ${err.message}`); }
    };

    return (
        <div style={{ padding: "24px 28px" }}>
            {alertas > 0 && (
                <div style={{ background: C.rojoPastel, border: `1px solid ${C.rojo}`, borderRadius: 10, padding: "12px 18px", marginBottom: 22, display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 18 }}>⚠️</span>
                    <span style={{ fontSize: 14, color: C.rojo, fontWeight: 600, flex: 1 }}>
                        Tienes {alertas} predio{alertas > 1 ? "s" : ""} con inspección próxima en menos de 30 días.
                    </span>
                    <button onClick={() => setActiva("inspecciones")} style={{ background: C.rojo, color: C.blanco, border: "none", borderRadius: 7, padding: "6px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
                        Ver inspecciones
                    </button>
                </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 26 }}>
                <StatCard icono="🗺️" label="Lugares registrados"     value={lugares.length}        colorTexto={C.azul}    colorFondo={C.azulPastel} />
                <StatCard icono="🏡" label="Predios asociados"       value={predios.length}        colorTexto={C.verde}   colorFondo={C.verdePastel} />
                <StatCard icono="✅" label="Inspecciones realizadas" value={totalInspecciones}     colorTexto={C.naranja} colorFondo={C.naranjaPastel} />
                <StatCard icono="⚠️" label="Alertas de plazo"        value={alertas}               colorTexto={alertas > 0 ? C.rojo : C.texto} colorFondo={alertas > 0 ? C.rojoPastel : C.grisPastel} />
            </div>

            <SectionTitle>Mis lugares de producción</SectionTitle>
            <div style={{ background: C.blanco, borderRadius: 12, border: `1px solid ${C.borde}`, overflow: "hidden" }}>
                <div style={{ padding: "14px 18px", borderBottom: `1px solid ${C.borde}`, display: "flex", justifyContent: "flex-end" }}>
                    <BtnVerde onClick={() => setActiva("lugares")} style={{ fontSize: 13, padding: "6px 14px" }}>Ver todos</BtnVerde>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 0.6fr 1.4fr auto", gap: 8, padding: "10px 18px", background: C.verdePastel, fontSize: 11, fontWeight: 700, color: C.verde, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    <span>Nombre</span><span>Registro ICA</span><span>Predios</span><span>Estado sanitario</span><span>Detalle</span>
                </div>
                {lugares.map((l, i) => (
                    <div key={l.id} style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 0.6fr 1.4fr auto", gap: 8, alignItems: "center", padding: "13px 18px", borderTop: i === 0 ? "none" : `1px solid ${C.borde}`, background: i % 2 === 0 ? C.blanco : "#FAFAFA" }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: C.texto }}>{l.nombre}</span>
                        <span style={{ fontSize: 13, color: C.textoMuted }}>{l.ica}</span>
                        <span style={{ fontSize: 14, fontWeight: 600, color: C.texto }}>{predios.filter(p => p.lugarId === l.id).length}</span>
                        <Badge estado={l.estado} />
                        <BtnOutline onClick={() => setLugarVer(l)}>Ver</BtnOutline>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.textoMuted, textTransform: "uppercase", letterSpacing: 0.7, marginBottom: 10 }}>¿Qué significa cada estado?</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
                    {[
                        { estado: "Sin alertas",  bg: C.verdePastel,    color: C.verde,   icono: "✅", desc: "Cultivos en buen estado. Sin novedades fitosanitarias." },
                        { estado: "Alerta media", bg: C.amarilloPastel, color: "#B7770D", icono: "⚠️", desc: "Observaciones detectadas. Se requiere seguimiento." },
                        { estado: "Alerta",       bg: C.rojoPastel,     color: C.rojo,    icono: "🚨", desc: "Problema fitosanitario activo. Requiere acción inmediata." },
                    ].map(({ estado, bg, color, icono, desc }) => (
                        <div key={estado} style={{ background: bg, border: `1px solid ${color}30`, borderRadius: 10, padding: "12px 14px", display: "flex", gap: 10, alignItems: "flex-start" }}>
                            <span style={{ fontSize: 18, flexShrink: 0 }}>{icono}</span>
                            <div>
                                <div style={{ fontSize: 14, fontWeight: 700, color, marginBottom: 3 }}>{estado}</div>
                                <div style={{ fontSize: 13, color, opacity: 0.85, lineHeight: 1.5 }}>{desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modales con datos y funciones reales */}
            {lugarVer && !modalForm && !modalElim && (
                <ModalVerLugar
                    lugar={lugarVer}
                    predios={predios}                          // ✅ predios reales
                    onClose={() => setLugarVer(null)}
                    onEditar={l => { setLugarVer(null); setModalForm(l); }}   // ✅ abre form
                    onEliminar={l => { setLugarVer(null); setModalElim(l); }} // ✅ abre elim
                />
            )}
            {modalForm && (
                <ModalFormLugar
                    lugar={modalForm}
                    onClose={() => setModalForm(null)}
                    onGuardar={handleGuardar}
                    cultivosDisponibles={todosLosCultivos}
                />
            )}
            {modalElim && (
                <ModalEliminarLugar
                    lugar={modalElim}
                    predios={predios}
                    lugares={lugares}
                    onCancelar={() => setModalElim(null)}
                    onEliminarTodo={handleEliminarTodo}
                    onMover={handleMoverPredios}
                />
            )}
        </div>
    );
}

// ── Página Lugares ────────────────────────────────────────────────────────────
// CRUD completo de lugares de producción.
// Llama a la API real (POST/PUT/DELETE) y actualiza el estado local en caso de éxito.
// Si la API falla, muestra un toast de error sin modificar el estado.
function PaginaLugares({ lugares, setLugares, predios, setPredios, lotes, setLotes, mostrarToast }) {
    const [filtro,     setFiltro]     = useState("Todos");
    const [busqueda,   setBusqueda]   = useState("");
    const [modalVer,   setModalVer]   = useState(null);
    const [modalForm,  setModalForm]  = useState(null);
    const [modalElim,  setModalElim]  = useState(null);
    const [todosLosCultivos, setTodosLosCultivos] = useState([]);

    // Al inicio del componente PaginaLugares, agrega:
console.log("lugares:", lugares);
console.log("cultivos del primer lugar:", lugares[0]?.cultivos);

        useEffect(() => {
        apiFetch("/predial/cultivos")
            .then(data => setTodosLosCultivos(Array.isArray(data) ? data : []))
            .catch(() => {});
    }, []);

    /* Filtra por tipo de alerta Y por texto de búsqueda */
    const filtrados = lugares.filter(l => {
        const pasa    = filtro === "Sin alerta" ? l.estadoType === "success" : filtro === "Con alerta" ? l.estadoType !== "success" : true;
        const buscado = l.nombre.toLowerCase().includes(busqueda.toLowerCase())
                     || l.ica.toLowerCase().includes(busqueda.toLowerCase())
                     || l.municipio.toLowerCase().includes(busqueda.toLowerCase());
        return pasa && buscado;
    });

    /* Crear (POST) o actualizar (PUT) un lugar */
    const handleGuardar = async (datos) => {
        try {
            if (datos.id) {
                await apiFetch(`/predial/lugares/${datos.id}`, { method: "PUT", body: JSON.stringify(lugarToBack(datos, datos.municipioId)) });
                setLugares(prev => prev.map(l => l.id === datos.id ? datos : l));
                mostrarToast("✅ Lugar actualizado");
            } else {
                const res = await apiFetch("/predial/lugares", { method: "POST", body: JSON.stringify(lugarToBack(datos, datos.municipioId)) });
                setLugares(prev => [...prev, { ...datos, id: res.id, prediosIds: [] }]);
                mostrarToast("✅ Lugar creado");
            }
            setModalForm(null);
            setModalVer(null);
        } catch (err) { mostrarToast(`❌ ${err.message}`); }
    };

    /* Eliminar lugar + predios + lotes en cascada (backend + estado local) */
    const handleEliminarTodo = async (lugar) => {
        try {
            await apiFetch(`/predial/lugares/${lugar.id}`, { method: "DELETE" });
            const prediosIds = predios.filter(p => p.lugarId === lugar.id).map(p => p.id);
            setLotes(prev   => prev.filter(l => !prediosIds.includes(l.predioId)));
            setPredios(prev => prev.filter(p => p.lugarId !== lugar.id));
            setLugares(prev => prev.filter(l => l.id !== lugar.id));
            mostrarToast("🗑️ Lugar, predios y lotes eliminados");
            setModalElim(null);
            setModalVer(null);
        } catch (err) { mostrarToast(`❌ ${err.message}`); }
    };

    /* Reasignar predios (y sus lotes) a otro lugar, luego eliminar el original */
    const handleMoverPredios = async (lugar, destinoId) => {
        try {
            const destino = lugares.find(l => l.id === destinoId);
            // Actualiza cada predio al nuevo lugar en el backend
            await Promise.all(
                predios
                    .filter(p => p.lugarId === lugar.id)
                    .map(p => apiFetch(`/predial/predios/${p.id}`, { method: "PUT", body: JSON.stringify(predioToBack({ ...p, lugarId: destinoId })) }))
            );
            await apiFetch(`/predial/lugares/${lugar.id}`, { method: "DELETE" });
            // Actualiza el estado local reflejando el nuevo lugarNombre en predios y lotes
            setPredios(prev => prev.map(p => p.lugarId === lugar.id ? { ...p, lugarId: destinoId, lugarNombre: destino?.nombre || p.lugarNombre } : p));
            setLotes(prev => prev.map(l => {
                const predioDelLote = predios.find(p => p.id === l.predioId);
                return predioDelLote?.lugarId === lugar.id ? { ...l, lugarNombre: destino?.nombre || l.lugarNombre } : l;
            }));
            setLugares(prev => prev.filter(l => l.id !== lugar.id));
            mostrarToast("✅ Predios movidos y lugar eliminado");
            setModalElim(null);
            setModalVer(null);
        } catch (err) { mostrarToast(`❌ ${err.message}`); }
    };

    return (
        <div style={{ padding: "24px 28px" }}>
            {/* Barra de acciones: filtros, búsqueda y botón crear */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, gap: 12, flexWrap: "wrap" }}>
                <SectionTitle>Lugares de producción</SectionTitle>
                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    <div style={{ display: "flex", gap: 8 }}>
                        {["Todos", "Sin alerta", "Con alerta"].map(f => (
                            <button key={f} onClick={() => setFiltro(f)} style={{ padding: "6px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: "pointer", border: `1px solid ${filtro === f ? C.verde : C.borde}`, background: filtro === f ? C.verdePastel : C.blanco, color: filtro === f ? C.verde : C.textoMuted, transition: "all 0.15s" }}>
                                {f}
                            </button>
                        ))}
                    </div>
                    <input placeholder="Buscar lugar..." value={busqueda} onChange={e => setBusqueda(e.target.value)} style={{ border: `1px solid ${C.borde}`, borderRadius: 8, padding: "7px 14px", fontSize: 14, outline: "none", width: 190, color: C.texto }} />
                    <BtnVerde onClick={() => setModalForm("crear")}>+ Crear lugar</BtnVerde>
                </div>
            </div>

            {/* Tabla de lugares */}
            <div style={{ background: C.blanco, borderRadius: 12, border: `1px solid ${C.borde}`, overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1fr 0.7fr 1.4fr auto", gap: 8, padding: "10px 18px", background: C.verdePastel, fontSize: 11, fontWeight: 700, color: C.verde, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    <span>Nombre</span><span>Registro ICA</span><span>Municipio</span><span>Predios</span><span>Estado sanitario</span><span>Ver</span>
                </div>
                {filtrados.map((l, i) => (
                    <div key={l.id} style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1fr 0.7fr 1.4fr auto", gap: 8, alignItems: "center", padding: "13px 18px", borderTop: i === 0 ? "none" : `1px solid ${C.borde}`, background: i % 2 === 0 ? C.blanco : "#FAFAFA" }}>
                        <div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: C.texto }}>{l.nombre}</div>
                            <div style={{ fontSize: 12, color: C.textoMuted }}>{l.cultivos.map(c => c.nombre).join(", ")}</div>
                        </div>
                        <span style={{ fontSize: 13, color: C.textoMuted }}>{l.ica}</span>
                        <span style={{ fontSize: 13, color: C.textoMuted }}>{l.municipio}</span>
                        <span style={{ fontSize: 14, fontWeight: 600, color: C.texto }}>{predios.filter(p => p.lugarId === l.id).length}</span>
                        <Badge estado={l.estado} />
                        <BtnOutline onClick={() => setModalVer(l)}>Ver</BtnOutline>
                    </div>
                ))}
                {filtrados.length === 0 && (
                    <div style={{ padding: 32, textAlign: "center", color: C.textoMuted, fontSize: 14 }}>No se encontraron lugares.</div>
                )}
            </div>

            {modalVer  && <ModalVerLugar lugar={modalVer} predios={predios} onClose={() => setModalVer(null)} onEditar={l => { setModalVer(null); setModalForm(l); }} onEliminar={l => { setModalVer(null); setModalElim(l); }} />}
            {modalForm && <ModalFormLugar lugar={modalForm === "crear" ? null : modalForm} onClose={() => setModalForm(null)} onGuardar={handleGuardar} cultivosDisponibles={todosLosCultivos}  />}
            {modalElim && <ModalEliminarLugar lugar={modalElim} predios={predios} lugares={lugares} onCancelar={() => setModalElim(null)} onEliminarTodo={handleEliminarTodo} onMover={handleMoverPredios} />}
        </div>
    );
}

// ── Página Predios ────────────────────────────────────────────────────────────
// CRUD completo de predios.
// Misma lógica de API real + fallback de estado local que PaginaLugares.
function PaginaPredios({ predios, setPredios, lugares, lotes, setLotes, mostrarToast }) {
    const [modalVer,   setModalVer]   = useState(null);
    const [modalForm,  setModalForm]  = useState(null);
    const [modalElim,  setModalElim]  = useState(null);
    const [busqueda,   setBusqueda]   = useState("");

    const filtrados = predios.filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase()));

    /* Crear (POST) o actualizar (PUT) un predio */
    const handleGuardar = async (datos) => {
        console.log("datos a guardar:", datos);          // ← agrega esto
    console.log("body enviado:", predioToBack(datos)); // ← y esto
        try {
            if (datos.id) {
                await apiFetch(`/predial/predios/${datos.id}`, { method: "PUT", body: JSON.stringify(predioToBack(datos)) });
                setPredios(prev => prev.map(p => p.id === datos.id ? datos : p));
                mostrarToast("✅ Predio actualizado");
            } else {
                const res = await apiFetch("/predial/predios", { method: "POST", body: JSON.stringify(predioToBack(datos)) });
                setPredios(prev => [...prev, { ...datos, id: res.id }]);
                mostrarToast("✅ Predio creado");
            }
            setModalForm(null);
            setModalVer(null);
        } catch (err) { mostrarToast(`❌ ${err.message}`); }
    };

    /* Eliminar predio + todos sus lotes */
    const handleEliminarTodo = async (predio) => {
        try {
            await apiFetch(`/predial/predios/${predio.id}`, { method: "DELETE" });
            setLotes(prev   => prev.filter(l => l.predioId !== predio.id));
            setPredios(prev => prev.filter(p => p.id !== predio.id));
            mostrarToast("🗑️ Predio y lotes eliminados");
            setModalElim(null);
            setModalVer(null);
        } catch (err) { mostrarToast(`❌ ${err.message}`); }
    };

    /* Reasignar lotes a otro predio antes de eliminar */
    const handleMoverLotes = async (predio, destinoId) => {
        try {
            const destino = predios.find(p => p.id === destinoId);
            await Promise.all(
                lotes
                    .filter(l => l.predioId === predio.id)
                    .map(l => apiFetch(`/predial/lotes/${l.id}`, { method: "PUT", body: JSON.stringify(loteToBack({ ...l, predioId: destinoId })) }))
            );
            await apiFetch(`/predial/predios/${predio.id}`, { method: "DELETE" });
            setLotes(prev   => prev.map(l => l.predioId === predio.id ? { ...l, predioId: destinoId, predioNombre: destino?.nombre || l.predioNombre, lugarNombre: destino?.lugarNombre || l.lugarNombre } : l));
            setPredios(prev => prev.filter(p => p.id !== predio.id));
            mostrarToast("✅ Lotes movidos y predio eliminado");
            setModalElim(null);
            setModalVer(null);
        } catch (err) { mostrarToast(`❌ ${err.message}`); }
    };

    return (
        <div style={{ padding: "24px 28px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, gap: 12, flexWrap: "wrap" }}>
                <SectionTitle>Predios asociados</SectionTitle>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <input placeholder="Buscar predio..." value={busqueda} onChange={e => setBusqueda(e.target.value)} style={{ border: `1px solid ${C.borde}`, borderRadius: 8, padding: "7px 14px", fontSize: 14, outline: "none", width: 200, color: C.texto }} />
                    <BtnVerde onClick={() => setModalForm("crear")}>+ Crear predio</BtnVerde>
                </div>
            </div>

            <div style={{ background: C.blanco, borderRadius: 12, border: `1px solid ${C.borde}`, overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1.4fr 0.8fr 1.3fr 1.3fr auto", gap: 8, padding: "10px 18px", background: C.verdePastel, fontSize: 11, fontWeight: 700, color: C.verde, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    <span>Predio</span><span>Lugar</span><span>Área</span><span>Estado</span><span>Próx. inspección</span><span>Ver</span>
                </div>
                {filtrados.map((p, i) => {
                    const dias = p.proximaInspeccion ? diasRestantes(p.proximaInspeccion) : null;
                    return (
                        <div key={p.id} style={{ display: "grid", gridTemplateColumns: "2fr 1.4fr 0.8fr 1.3fr 1.3fr auto", gap: 8, alignItems: "center", padding: "13px 18px", borderTop: i === 0 ? "none" : `1px solid ${C.borde}`, background: i % 2 === 0 ? C.blanco : "#FAFAFA" }}>
                            <div>
                                <div style={{ fontSize: 14, fontWeight: 700, color: C.texto }}>{p.nombre}</div>
                                <div style={{ fontSize: 12, color: C.textoMuted }}>{p.cultivos.map(c => c.nombre).join(", ")}</div>                            </div>
                            <span style={{ fontSize: 13, color: C.textoMuted }}>{p.lugarNombre}</span>
                            <span style={{ fontSize: 14, color: C.texto }}>{p.areaHa} ha</span>
                            <Badge estado={p.estadoSanitario} />
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                {dias !== null ? (
                                    <>
                                        <span style={{ fontSize: 13, color: dias <= 7 ? C.rojo : C.textoMuted, fontWeight: dias <= 7 ? 700 : 400 }}>{fmt(p.proximaInspeccion)}</span>
                                        {dias <= 30 && (
                                            <span style={{ fontSize: 10, background: dias <= 7 ? C.rojoPastel : C.amarilloPastel, color: dias <= 7 ? C.rojo : C.amarillo, padding: "1px 6px", borderRadius: 8, fontWeight: 700 }}>
                                                {dias}d
                                            </span>
                                        )}
                                    </>
                                ) : (
                                    <span style={{ fontSize: 13, color: C.textoMuted }}>—</span>
                                )}
                            </div>
                            <BtnOutline onClick={() => setModalVer(p)}>Ver</BtnOutline>
                        </div>
                    );
                })}
                {filtrados.length === 0 && (
                    <div style={{ padding: 32, textAlign: "center", color: C.textoMuted, fontSize: 14 }}>No se encontraron predios.</div>
                )}
            </div>

            {modalVer  && <ModalVerPredio predio={modalVer} onClose={() => setModalVer(null)} onEditar={p => { setModalVer(null); setModalForm(p); }} onEliminar={p => { setModalVer(null); setModalElim(p); }} />}
            {modalForm && <ModalFormPredio predio={modalForm === "crear" ? null : modalForm} lugares={lugares} onClose={() => setModalForm(null)} onGuardar={handleGuardar} />}
            {modalElim && <ModalEliminarPredio predio={modalElim} lotes={lotes} predios={predios} onCancelar={() => setModalElim(null)} onEliminarTodo={handleEliminarTodo} onMover={handleMoverLotes} />}
        </div>
    );
}

// ── Página Lotes ──────────────────────────────────────────────────────────────
// CRUD completo de lotes. La eliminación es simple (sin cascada).
function PaginaLotes({ lotes, setLotes, predios, mostrarToast }) {
    const [modalVer,   setModalVer]   = useState(null);
    const [modalForm,  setModalForm]  = useState(null);
    const [modalElim,  setModalElim]  = useState(null);
    const [busqueda,   setBusqueda]   = useState("");

    const filtrados = lotes.filter(l =>
        l.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        l.predioNombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    /* Crear (POST) o actualizar (PUT) un lote */
    const handleGuardar = async (datos) => {
        try {
            if (datos.id) {
                await apiFetch(`/predial/lotes/${datos.id}`, { method: "PUT", body: JSON.stringify(loteToBack(datos)) });
                setLotes(prev => prev.map(l => l.id === datos.id ? datos : l));
                mostrarToast("✅ Lote actualizado");
            } else {
                const res = await apiFetch("/predial/lotes", { method: "POST", body: JSON.stringify(loteToBack(datos)) });
                setLotes(prev => [...prev, { ...datos, id: res.id }]);
                mostrarToast("✅ Lote creado");
            }
            setModalForm(null);
            setModalVer(null);
        } catch (err) { mostrarToast(`❌ ${err.message}`); }
    };

    /* Eliminar un lote individual (sin cascada, no tiene hijos) */
    const handleEliminar = async () => {
        try {
            await apiFetch(`/predial/lotes/${modalElim.id}`, { method: "DELETE" });
            setLotes(prev => prev.filter(l => l.id !== modalElim.id));
            mostrarToast("🗑️ Lote eliminado");
            setModalElim(null);
            setModalVer(null);
        } catch (err) { mostrarToast(`❌ ${err.message}`); }
    };

    return (
        <div style={{ padding: "24px 28px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, gap: 12, flexWrap: "wrap" }}>
                <SectionTitle>Lotes</SectionTitle>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <input placeholder="Buscar lote o predio..." value={busqueda} onChange={e => setBusqueda(e.target.value)} style={{ border: `1px solid ${C.borde}`, borderRadius: 8, padding: "7px 14px", fontSize: 14, outline: "none", width: 210, color: C.texto }} />
                    <BtnVerde onClick={() => setModalForm("crear")}>+ Crear lote</BtnVerde>
                </div>
            </div>

            <div style={{ background: C.blanco, borderRadius: 12, border: `1px solid ${C.borde}`, overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1.5fr 1fr 1fr 1fr auto", gap: 8, padding: "10px 18px", background: C.verdePastel, fontSize: 11, fontWeight: 700, color: C.verde, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    <span>Lote</span><span>Predio</span><span>Lugar</span><span>Área</span><span>Estado</span><span>Ver</span>
                </div>
                {filtrados.map((l, i) => (
                    <div key={l.id} style={{ display: "grid", gridTemplateColumns: "1.5fr 1.5fr 1fr 1fr 1fr auto", gap: 8, alignItems: "center", padding: "13px 18px", borderTop: i === 0 ? "none" : `1px solid ${C.borde}`, background: i % 2 === 0 ? C.blanco : "#FAFAFA" }}>
                        <div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: C.texto }}>{l.nombre}</div>
                            <div style={{ fontSize: 12, color: C.textoMuted }}>{l.cultivos.map(c => c.nombre).join(", ")}</div>
                        </div>
                        <span style={{ fontSize: 13, color: C.textoMuted }}>{l.predioNombre}</span>
                        <span style={{ fontSize: 13, color: C.textoMuted }}>{l.lugarNombre}</span>
                        <span style={{ fontSize: 14, color: C.texto }}>{l.areaHa} ha</span>
                        <Badge estado={l.estadoLote} />
                        <BtnOutline onClick={() => setModalVer(l)}>Ver</BtnOutline>
                    </div>
                ))}
                {filtrados.length === 0 && (
                    <div style={{ padding: 32, textAlign: "center", color: C.textoMuted, fontSize: 14 }}>No se encontraron lotes.</div>
                )}
            </div>

            {modalVer  && <ModalVerLote lote={modalVer} onClose={() => setModalVer(null)} onEditar={l => { setModalVer(null); setModalForm(l); }} onEliminar={l => { setModalVer(null); setModalElim(l); }} />}
            {modalForm && <ModalFormLote lote={modalForm === "crear" ? null : modalForm} predios={predios} onClose={() => setModalForm(null)} onGuardar={handleGuardar} />}
            {modalElim && <ModalConfirmarEliminar titulo="¿Eliminar lote?" mensaje={`¿Estás seguro de eliminar "${modalElim.nombre}"? Esta acción no se puede deshacer.`} onConfirmar={handleEliminar} onCancelar={() => setModalElim(null)} />}
        </div>
    );
}

// ── Página Inspecciones ───────────────────────────────────────────────────────
// Muestra dos pestañas:
//   "Solicitudes" — lista de solicitudes del productor cargadas desde la API
//   "Por vencer"  — predios cuya próxima inspección está en los próximos 30 días
// Incluye botón para abrir el modal de nueva solicitud.
function PaginaInspecciones({ predios }) {
    const [tab,             setTab]             = useState("realizadas");
    const [modalSolicitar,  setModalSolicitar]  = useState(false);
    const [insVer,          setInsVer]          = useState(null);
    const [inspecciones,    setInspecciones]    = useState([]);
    const [prediosApi,      setPrediosApi]      = useState([]);
    const [cargando,        setCargando]        = useState(true);
    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

    /* Carga las solicitudes del productor autenticado */
    const cargarInspecciones = useCallback(() => {
        setCargando(true);
        fetch(`${BASE_URL}/inspecciones/solicitudes/productor/${usuario.id}`)
            .then(r => r.json())
            .then(data => setInspecciones(Array.isArray(data) ? data : []))
            .catch(() => {})
            .finally(() => setCargando(false));
    }, [usuario.id]);

    useEffect(() => {
        cargarInspecciones();
        // Carga también la lista de predios para el modal de nueva solicitud
        fetch(`${BASE_URL}/inspecciones/predios/productor/${usuario.id}`)
            .then(r => r.json())
            .then(data => setPrediosApi(Array.isArray(data) ? data : []))
            .catch(() => {});
    }, [cargarInspecciones]);

    /* Predios con inspección próxima (<= 30 días), ordenados por urgencia */
    const porVencer = predios
        .filter(p => p.proximaInspeccion && diasRestantes(p.proximaInspeccion) <= 30)
        .sort((a, b) => diasRestantes(a.proximaInspeccion) - diasRestantes(b.proximaInspeccion));

    return (
        <div style={{ padding: "24px 28px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <SectionTitle>Inspecciones</SectionTitle>
                <BtnVerde onClick={() => setModalSolicitar(true)}>+ Solicitar inspección</BtnVerde>
            </div>

            {/* Pestañas de navegación */}
            <div style={{ display: "flex", gap: 8, marginBottom: 20, background: C.grisPastel, padding: 6, borderRadius: 10, width: "fit-content" }}>
                <TabBtn activa={tab} id="realizadas" label={`Solicitudes (${inspecciones.length})`} setActiva={setTab} />
                <TabBtn activa={tab} id="porVencer"  label={`Por vencer (${porVencer.length})`}     setActiva={setTab} />
            </div>

            {/* Pestaña: lista de solicitudes */}
            {tab === "realizadas" && (
                <div style={{ background: C.blanco, borderRadius: 12, border: `1px solid ${C.borde}`, overflow: "hidden" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "2fr 0.8fr 0.8fr 80px", gap: 8, padding: "10px 18px", background: C.verdePastel, fontSize: 11, fontWeight: 700, color: C.verde, textTransform: "uppercase", letterSpacing: 0.5 }}>
                        <span>Predio</span><span>Fecha Solicitud</span><span>Estado</span><span>Detalle</span>
                    </div>
                    {cargando ? (
                        <div style={{ padding: 40, textAlign: "center", color: C.textoMuted }}>Cargando...</div>
                    ) : inspecciones.length === 0 ? (
                        <div style={{ padding: 40, textAlign: "center", color: C.textoMuted }}>
                            <div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>
                            <p style={{ margin: 0, fontWeight: 600 }}>No tienes solicitudes de inspección</p>
                        </div>
                    ) : inspecciones.map((ins, i) => (
                        <div key={ins.id} style={{ display: "grid", gridTemplateColumns: "2fr 0.8fr 0.8fr 80px", gap: 8, alignItems: "center", padding: "13px 18px", borderTop: i === 0 ? "none" : `1px solid ${C.borde}`, background: i % 2 === 0 ? C.blanco : "#FAFAFA" }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: C.texto }}>{ins.nombrePredio}</span>
                            <span style={{ fontSize: 13, color: C.textoMuted }}>{new Date(ins.fechaSolicitud).toLocaleDateString("es-CO")}</span>
                            <Badge estado={ins.estado === "pendiente" ? "Pendiente" : ins.estado === "asignada" ? "En revisión" : ins.estado} />
                            <BtnOutline onClick={() => setInsVer(ins)}>Ver</BtnOutline>
                        </div>
                    ))}
                </div>
            )}

            {/* Pestaña: predios con inspección por vencer */}
            {tab === "porVencer" && (
                porVencer.length === 0 ? (
                    <div style={{ textAlign: "center", padding: 48, color: C.textoMuted }}>
                        <div style={{ fontSize: 40, marginBottom: 10 }}>✅</div>
                        <p style={{ fontWeight: 600, margin: 0 }}>No hay inspecciones próximas a vencer</p>
                    </div>
                ) : (
                    <div style={{ display: "grid", gap: 12 }}>
                        {porVencer.map(p => {
                            const dias = diasRestantes(p.proximaInspeccion);
                            return (
                                <div key={p.id} style={{ background: C.blanco, borderRadius: 12, border: `1px solid ${dias <= 7 ? C.rojo : C.amarillo}`, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: C.texto, marginBottom: 3 }}>{p.nombre}</div>
                                        <div style={{ fontSize: 13, color: C.textoMuted }}>{p.lugarNombre} · {p.cultivos.map(c => c.nombre).join(", ")}</div>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        {/* Días restantes: rojo si queda ≤ 7 días, amarillo si ≤ 30 */}
                                        <div style={{ fontSize: 24, fontWeight: 800, color: dias <= 7 ? C.rojo : C.amarillo }}>{dias}d</div>
                                        <div style={{ fontSize: 12, color: C.textoMuted }}>para {fmt(p.proximaInspeccion)}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )
            )}

            {insVer        && <ModalInspeccion ins={insVer} onClose={() => setInsVer(null)} />}
            {modalSolicitar && (
                <ModalSolicitar
                    prediosApi={prediosApi}
                    onClose={() => setModalSolicitar(false)}
                    onSolicitudEnviada={() => { cargarInspecciones(); setModalSolicitar(false); }}
                />
            )}
        </div>
    );
}

// ══════════════════════════════════════════════════════════════════════════════
// APP ROOT — DashboardProductor
//
// Responsabilidades:
//   1. Carga inicial de datos desde la API (lugares → predios → lotes en paralelo).
//   2. Si la API falla o devuelve vacío, usa los datos de prueba como fallback.
//   3. Gestiona el estado global compartido por todas las páginas.
//   4. Provee el toast global y la función mostrarToast a las páginas hijas.
//   5. Sincroniza: elimina lotes huérfanos si se borra su predio desde otra vista.
// ══════════════════════════════════════════════════════════════════════════════
export default function DashboardProductor() {
    const [activa,      setActiva]      = useState("dashboard");
    const [menuAbierto, setMenuAbierto] = useState(true);
    const [cargando,    setCargando]    = useState(true);

    // Estado global: se inicia vacío y se rellena al montar (API o datos de prueba)
    const [lugares, setLugares] = useState([]);
    const [predios, setPredios] = useState([]);
    const [lotes,   setLotes]   = useState([]);

    // Toast global: visible desde cualquier página hija
    const [toast, setToast] = useState("");
    const mostrarToast = useCallback((msg) => {
        setToast(msg);
        setTimeout(() => setToast(""), 2800);
    }, []);

    // Carga inicial: intenta traer datos del backend.
    // Si falla (red caída, endpoint inexistente, respuesta vacía), usa INIT data.
   useEffect(() => {
    const cargar = async () => {
        const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
        try {
            const [lugaresRaw, prediosRaw, lotesRaw] = await Promise.all([
                apiFetch(`/predial/lugares?productor_id=${usuario.id}`),
                apiFetch(`/predial/predios?propietario_id=${usuario.id}`),
                apiFetch("/predial/lotes/lugar/0"),
            ]);

                // Mapeo backend → frontend
                const lugaresF = lugaresRaw.map(lugarToFront);
const prediosF = prediosRaw.map(p => predioToFront(p, lugaresF));

const predioIds = prediosF.map(p => p.id);
const lotesFiltrados = lotesRaw.filter(l => predioIds.includes(l.predio_id || l.predioId));
const lotesF = lotesFiltrados.map(l => loteToFront(l, prediosF));

setLugares(lugaresF);
setPredios(prediosF);
setLotes(lotesF);

            } 
             catch (err) {
    mostrarToast(`❌ ${err.message}`);  // ← muestra el error real
    setLugares([]);
    setPredios([]);
    setLotes([]);
}
            
            finally {
                setCargando(false);
            }
        };
        cargar();
    }, [mostrarToast]);

    // Limpieza reactiva: si se elimina un predio, sus lotes huérfanos desaparecen
    // automáticamente de la lista aunque el DELETE del backend no los borre en cascada.
    useEffect(() => {
        const ids = predios.map(p => p.id);
        setLotes(prev => prev.filter(l => ids.includes(l.predioId)));
    }, [predios]);

    // Pantalla de carga mientras se obtienen los datos iniciales
    if (cargando) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: C.grisPastel, flexDirection: "column", gap: 12 }}>
                <div style={{ fontSize: 32 }}>🌿</div>
                <div style={{ fontSize: 15, color: C.textoMuted, fontWeight: 600 }}>Cargando datos...</div>
            </div>
        );
    }

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: C.grisPastel, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

            {/* Toast global: flota en la esquina inferior derecha */}
            {toast && (
                <div style={{ position: "fixed", bottom: 24, right: 24, background: C.verde, color: C.blanco, borderRadius: 10, padding: "12px 20px", fontSize: 14, fontWeight: 700, zIndex: 999, boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}>
                    {toast}
                </div>
            )}

            {/* Sidebar: menú lateral con acordeón */}
            <Sidebar
                activa={activa} setActiva={setActiva}
                menuAbierto={menuAbierto} setMenuAbierto={setMenuAbierto}
            />

            <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
                {/* Header fijo con título y datos del usuario */}
                <Header titulo={TITULOS[activa] || "Panel del productor"} menuAbierto={menuAbierto} setMenuAbierto={setMenuAbierto} />

                {/* Contenido principal: renderiza la página activa */}
                <main style={{ flex: 1, overflowY: "auto" }}>
    {activa === "dashboard" && (
        <PaginaDashboard
            setActiva={setActiva}
            lugares={lugares}     setLugares={setLugares}
            predios={predios}     setPredios={setPredios}
            lotes={lotes}         setLotes={setLotes}
            mostrarToast={mostrarToast}
        />
    )}
    {activa === "lugares"      && <PaginaLugares      lugares={lugares} setLugares={setLugares} predios={predios} setPredios={setPredios} lotes={lotes} setLotes={setLotes} mostrarToast={mostrarToast} />}
    {activa === "predios"      && <PaginaPredios      predios={predios} setPredios={setPredios} lugares={lugares} lotes={lotes} setLotes={setLotes} mostrarToast={mostrarToast} />}
    {activa === "lotes"        && <PaginaLotes        lotes={lotes} setLotes={setLotes} predios={predios} mostrarToast={mostrarToast} />}
    {activa === "inspecciones" && <PaginaInspecciones predios={predios} />}
</main>
            </div>
        </div>
    );
}