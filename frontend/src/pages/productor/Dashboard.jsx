import { useState, useEffect } from "react";

// ── PALETA (misma que los otros dashboards) ────────────────────────────────────
const C = {
    verde: "#2E7D32",
    verdeClaro: "#4CAF50",
    verdePastel: "#E8F5E9",
    verdeMedio: "#A5D6A7",
    amarillo: "#F9A825",
    amarilloPastel: "#FFFDE7",
    naranja: "#E65100",
    naranjaPastel: "#FFF3E0",
    gris: "#546E7A",
    grisPastel: "#ECEFF1",
    blanco: "#FFFFFF",
    texto: "#1B2631",
    textoMuted: "#607D8B",
    borde: "#CFD8DC",
    azul: "#1565C0",
    azulPastel: "#E3F2FD",
    rojo: "#C62828",
    rojoPastel: "#FFEBEE",
};

// ── DATOS ─────────────────────────────────────────────────────────────────────
const LUGARES = [
    { id: 1, nombre: "Lugar Norte", ica: "ICA-LP-0021", municipio: "Piedecuesta", departamento: "Santander", vereda: "Vereda El Carmen", cultivos: ["Tomate", "Cebolla"], areaHa: 12.5, prediosIds: [1, 2, 3], estadoType: "success", estado: "Sin alertas" },
    { id: 2, nombre: "Lugar Sur",   ica: "ICA-LP-0022", municipio: "Floridablanca", departamento: "Santander", vereda: "Vereda Sur", cultivos: ["Maíz", "Papa"], areaHa: 8.3, prediosIds: [4, 5, 6], estadoType: "warning", estado: "Alerta media" },
];

const PREDIOS = [
    { id: 1, nombre: "Predio Agua Fría",  lugarId: 1, lugarNombre: "Lugar Norte", matricula: "MAT-001-2021", areaHa: 4.0, municipio: "Piedecuesta",  departamento: "Santander", vereda: "Vereda Alta",   cultivos: ["Tomate"],         tipoProduccion: "Convencional", ultimaInspeccion: "2025-01-15", proximaInspeccion: "2025-04-15", estadoSanitario: "Aprobado" },
    { id: 2, nombre: "Predio Las Palmas", lugarId: 1, lugarNombre: "Lugar Norte", matricula: "MAT-002-2021", areaHa: 5.2, municipio: "Piedecuesta",  departamento: "Santander", vereda: "Vereda Baja",   cultivos: ["Cebolla"],        tipoProduccion: "Orgánica",    ultimaInspeccion: "2025-01-15", proximaInspeccion: "2025-04-15", estadoSanitario: "Aprobado" },
    { id: 3, nombre: "Predio El Roble",   lugarId: 1, lugarNombre: "Lugar Norte", matricula: "MAT-003-2022", areaHa: 3.3, municipio: "Piedecuesta",  departamento: "Santander", vereda: "Vereda El Pino",cultivos: ["Tomate","Cebolla"], tipoProduccion: "Convencional", ultimaInspeccion: "2025-02-10", proximaInspeccion: "2025-05-10", estadoSanitario: "Con observaciones" },
    { id: 4, nombre: "Predio La Loma",    lugarId: 2, lugarNombre: "Lugar Sur",   matricula: "MAT-004-2022", areaHa: 2.8, municipio: "Floridablanca", departamento: "Santander", vereda: "Vereda Norte",  cultivos: ["Maíz"],           tipoProduccion: "Convencional", ultimaInspeccion: "2025-01-20", proximaInspeccion: "2025-04-20", estadoSanitario: "Alerta" },
    { id: 5, nombre: "Predio El Cedro",   lugarId: 2, lugarNombre: "Lugar Sur",   matricula: "MAT-005-2023", areaHa: 3.1, municipio: "Floridablanca", departamento: "Santander", vereda: "Vereda Sur",    cultivos: ["Papa"],           tipoProduccion: "Orgánica",    ultimaInspeccion: "2025-02-01", proximaInspeccion: "2025-05-01", estadoSanitario: "Aprobado" },
    { id: 6, nombre: "Predio El Mango",   lugarId: 2, lugarNombre: "Lugar Sur",   matricula: "MAT-006-2023", areaHa: 2.4, municipio: "Floridablanca", departamento: "Santander", vereda: "Vereda Centro", cultivos: ["Maíz","Papa"],    tipoProduccion: "Convencional", ultimaInspeccion: "2025-01-05", proximaInspeccion: "2025-04-05", estadoSanitario: "Aprobado" },
];

const INSPECCIONES = [
    { id: 1, predio: "Predio Agua Fría",  lugar: "Lugar Norte", fecha: "2025-01-15", tecnico: "Carlos Ramírez", resultado: "Aprobado",           observaciones: "Sin novedades. Cultivos en buen estado.", proximaFecha: "2025-04-15" },
    { id: 2, predio: "Predio Las Palmas", lugar: "Lugar Norte", fecha: "2025-01-15", tecnico: "Carlos Ramírez", resultado: "Aprobado",           observaciones: "Excelente manejo orgánico.", proximaFecha: "2025-04-15" },
    { id: 3, predio: "Predio El Roble",   lugar: "Lugar Norte", fecha: "2025-02-10", tecnico: "María Gómez",   resultado: "Con observaciones", observaciones: "Se detectó presencia leve de plagas. Aplicar tratamiento preventivo.", proximaFecha: "2025-05-10" },
    { id: 4, predio: "Predio La Loma",    lugar: "Lugar Sur",   fecha: "2025-01-20", tecnico: "Jorge Herrera", resultado: "Alerta",            observaciones: "Alerta fitosanitaria. Requiere acción inmediata.", proximaFecha: "2025-04-20" },
    { id: 5, predio: "Predio El Cedro",   lugar: "Lugar Sur",   fecha: "2025-02-01", tecnico: "María Gómez",   resultado: "Aprobado",           observaciones: "Buen estado general.", proximaFecha: "2025-05-01" },
    { id: 6, predio: "Predio El Mango",   lugar: "Lugar Sur",   fecha: "2025-01-05", tecnico: "Jorge Herrera", resultado: "Aprobado",           observaciones: "Sin novedades.", proximaFecha: "2025-04-05" },
];

const HOY = new Date("2025-04-19");
const diasRestantes = f => Math.ceil((new Date(f) - HOY) / 86400000);
const fmt = s => { const [y,m,d] = s.split("-"); return `${d}/${m}/${y}`; };

const NAV = [
    { key: "dashboard",    label: "Dashboard",             icono: "📊" },
    { key: "lugares",      label: "Lugares de producción", icono: "🗺️" },
    { key: "predios",      label: "Predios asociados",     icono: "🏡" },
    { key: "inspecciones", label: "Inspecciones",          icono: "✅" },
    { key: "informes",     label: "Informes",              icono: "📄" },
];

const TITULOS = { dashboard: "Panel del productor", lugares: "Lugares de producción", predios: "Predios asociados", inspecciones: "Inspecciones", informes: "Informes" };

// ── HELPERS DE BADGE ──────────────────────────────────────────────────────────
function tipoBadge(estado) {
    if (estado === "Aprobado" || estado === "Sin alertas")    return { bg: C.verdePastel,    color: C.verde   };
    if (estado === "Con observaciones" || estado === "Alerta media") return { bg: C.amarilloPastel, color: "#B7770D" };
    if (estado === "Alerta")                                  return { bg: C.rojoPastel,     color: C.rojo    };
    return { bg: C.grisPastel, color: C.gris };
}

function Badge({ estado, children }) {
    const texto = children || estado;
    const s = tipoBadge(estado);
    return (
        <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 700, padding: "3px 11px", borderRadius: 20, whiteSpace: "nowrap", display: "inline-block" }}>
        {texto}
        </span>
    );
}

// ── SIDEBAR (igual al Admin y Técnico) ───────────────────────────────────────
function Sidebar({ activa, setActiva, menuAbierto, setMenuAbierto }) {
    return (
        <aside style={{
        width: menuAbierto ? 230 : 62, background: C.verde, flexShrink: 0,
        transition: "width 0.25s ease", overflow: "hidden",
        display: "flex", flexDirection: "column",
        height: "100vh", position: "sticky", top: 0,
        }}>
        {/* Logo */}
        <div style={{ padding: "0 16px", height: 56, display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid rgba(255,255,255,0.15)`, flexShrink: 0 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: C.verdeClaro, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>🌱</div>
            <span style={{ color: C.blanco, fontSize: 15, fontWeight: 700, whiteSpace: "nowrap", opacity: menuAbierto ? 1 : 0, transition: "opacity 0.2s" }}>Productor</span>
        </div>

        {/* Tag rol */}
        <div style={{ padding: "10px 20px", background: "rgba(0,0,0,0.12)", borderBottom: `1px solid rgba(255,255,255,0.1)`, whiteSpace: "nowrap" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.verdeMedio, textTransform: "uppercase", letterSpacing: 1.2 }}>
            {menuAbierto ? "PRODUCTOR" : "PRD"}
            </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "10px 0", overflowY: "auto" }}>
            {NAV.map(({ key, label, icono }) => (
            <button key={key} onClick={() => setActiva(key)} style={{
                display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "12px 20px",
                border: "none", textAlign: "left", whiteSpace: "nowrap", cursor: "pointer",
                background: activa === key ? "rgba(255,255,255,0.18)" : "transparent",
                color: activa === key ? C.blanco : C.verdeMedio,
                fontWeight: activa === key ? 700 : 400, fontSize: 13,
                borderLeft: activa === key ? `3px solid ${C.blanco}` : "3px solid transparent",
                transition: "all 0.15s",
            }}>
                <span style={{ fontSize: 17, flexShrink: 0 }}>{icono}</span>
                <span style={{ opacity: menuAbierto ? 1 : 0, transition: "opacity 0.2s" }}>{label}</span>
            </button>
            ))}
        </nav>

        {/* Cerrar sesión */}
<div style={{ borderTop: `1px solid rgba(255,255,255,0.12)`, flexShrink: 0 }}>
    <button 
        onClick={() => {
            localStorage.removeItem('token')
            localStorage.removeItem('usuario')
            window.location.href = '/login'
        }}
        style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "14px 20px", border: "none", background: "transparent", color: "#FFCDD2", cursor: "pointer", fontWeight: 600, fontSize: 13, whiteSpace: "nowrap" }}>
        <span style={{ fontSize: 17, flexShrink: 0 }}>🚪</span>
        <span style={{ opacity: menuAbierto ? 1 : 0, transition: "opacity 0.2s" }}>Cerrar sesión</span>
    </button>
</div>
</aside>
    );
}

// ── HEADER (igual al Admin y Técnico) ────────────────────────────────────────
function Header({ titulo, menuAbierto, setMenuAbierto }) {
    return (
        <header style={{
        background: C.verde, color: C.blanco, padding: "0 24px", height: 56,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 10, boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
        flexShrink: 0,
        }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button onClick={() => setMenuAbierto(!menuAbierto)} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 8, width: 36, height: 36, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, flexShrink: 0 }}>
            {[0,1,2].map(i => <span key={i} style={{ display: "block", width: 18, height: 2, background: C.blanco, borderRadius: 2 }} />)}
            </button>
            <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: -0.3 }}>{titulo}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Laura Gómez</div>
            <div style={{ fontSize: 11, opacity: 0.75 }}>Productor registrado</div>
            </div>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>LG</div>
        </div>
        </header>
    );
}

// ── COMPONENTES REUTILIZABLES ─────────────────────────────────────────────────
function SectionTitle({ children }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
        <div style={{ width: 4, height: 22, background: C.verde, borderRadius: 2 }} />
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: C.texto }}>{children}</h2>
        </div>
    );
}

function StatCard({ icono, label, value, colorTexto, colorFondo }) {
    return (
        <div style={{ background: C.blanco, borderRadius: 12, border: `1px solid ${C.borde}`, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: colorFondo, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{icono}</div>
        <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.textoMuted, textTransform: "uppercase", letterSpacing: 0.7, marginBottom: 3 }}>{label}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: colorTexto, lineHeight: 1 }}>{value}</div>
        </div>
        </div>
    );
}

function BtnVerde({ onClick, children, style = {} }) {
    return (
        <button onClick={onClick} style={{ background: C.verde, color: C.blanco, border: "none", borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, ...style }}>{children}</button>
    );
}

function BtnGris({ onClick, children, style = {} }) {
    return (
        <button onClick={onClick} style={{ background: C.grisPastel, color: C.gris, border: "none", borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", ...style }}>{children}</button>
    );
}

function BtnOutline({ onClick, children }) {
    return (
        <button onClick={onClick} style={{ background: "transparent", color: C.texto, border: `1px solid ${C.borde}`, borderRadius: 7, padding: "5px 13px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{children}</button>
    );
}

function FilaInfo({ label, valor }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <span style={{ fontSize: 11, color: C.textoMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</span>
        <span style={{ fontSize: 14, color: C.texto, fontWeight: 500 }}>{valor}</span>
        </div>
    );
}

function Divider() { return <div style={{ height: 1, background: C.borde, margin: "16px 0" }} />; }

function TableHead({ cols }) {
    return (
        <div style={{ display: "grid", gridTemplateColumns: cols, gap: 8, padding: "10px 18px", background: C.verdePastel, fontSize: 11, fontWeight: 700, color: C.verde, textTransform: "uppercase", letterSpacing: 0.5 }}>
        {Object.values(cols.labels || {}).map((h, i) => <span key={i}>{h}</span>)}
        </div>
    );
}

function TabBtn({ activa, id, label, setActiva }) {
    return (
        <button onClick={() => setActiva(id)} style={{ padding: "9px 20px", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", border: "none", background: activa === id ? C.verde : C.blanco, color: activa === id ? C.blanco : C.gris }}>
        {label}
        </button>
    );
}

// ── MODALES BASE ──────────────────────────────────────────────────────────────
function Overlay({ onClose, children }) {
    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onClose}>
        <div onClick={e => e.stopPropagation()}>{children}</div>
        </div>
    );
}

function ModalShell({ titulo, subtitulo, onClose, children, ancho = 480 }) {
    return (
        <div style={{ background: C.blanco, borderRadius: 16, padding: 28, width: ancho, maxWidth: "95vw", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 8px 40px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
            <div>
            {subtitulo && <div style={{ fontSize: 11, fontWeight: 700, color: C.verdeClaro, textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>{subtitulo}</div>}
            <h2 style={{ margin: 0, fontSize: 19, fontWeight: 700, color: C.texto }}>{titulo}</h2>
            </div>
            <button onClick={onClose} style={{ background: C.grisPastel, border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 18, color: C.gris }}>×</button>
        </div>
        {children}
        </div>
    );
}

// ── MODAL LUGAR ───────────────────────────────────────────────────────────────
function ModalLugar({ lugar, onClose }) {
    if (!lugar) return null;
    const predios = PREDIOS.filter(p => p.lugarId === lugar.id);
    const s = tipoBadge(lugar.estado);
    return (
        <Overlay onClose={onClose}>
        <ModalShell titulo={lugar.nombre} subtitulo="Lugar de producción" onClose={onClose} ancho={500}>
            {/* Banner estado */}
            <div style={{ background: s.bg, borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: s.color }}>Estado sanitario</span>
            <Badge estado={lugar.estado} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <FilaInfo label="Registro ICA" valor={lugar.ica} />
            <FilaInfo label="Área total" valor={`${lugar.areaHa} ha`} />
            <FilaInfo label="Departamento" valor={lugar.departamento} />
            <FilaInfo label="Municipio" valor={lugar.municipio} />
            <FilaInfo label="Vereda" valor={lugar.vereda} />
            <FilaInfo label="Número de predios" valor={predios.length} />
            </div>
            <Divider />
            <FilaInfo label="Cultivos" valor={lugar.cultivos.join(", ")} />
            <Divider />
            <div style={{ fontSize: 12, fontWeight: 700, color: C.textoMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>Predios que lo componen</div>
            <div style={{ display: "grid", gap: 7 }}>
            {predios.map(p => (
                <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderRadius: 9, border: `1px solid ${C.borde}`, background: C.grisPastel }}>
                <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.texto }}>{p.nombre}</div>
                    <div style={{ fontSize: 11, color: C.textoMuted }}>{p.areaHa} ha · {p.cultivos.join(", ")}</div>
                </div>
                <Badge estado={p.estadoSanitario} />
                </div>
            ))}
            </div>
            <div style={{ marginTop: 22 }}><BtnGris onClick={onClose} style={{ width: "100%", textAlign: "center" }}>Cerrar</BtnGris></div>
        </ModalShell>
        </Overlay>
    );
}

// ── MODAL PREDIO ──────────────────────────────────────────────────────────────
function ModalPredio({ predio, onClose }) {
    if (!predio) return null;
    const historial = INSPECCIONES.filter(i => i.predio === predio.nombre);
    const dias = diasRestantes(predio.proximaInspeccion);
    const urgente = dias <= 7;
    return (
        <Overlay onClose={onClose}>
        <ModalShell titulo={predio.nombre} subtitulo="Predio asociado" onClose={onClose} ancho={520}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
            <FilaInfo label="Matrícula" valor={predio.matricula} />
            <FilaInfo label="Área" valor={`${predio.areaHa} ha`} />
            <FilaInfo label="Lugar de producción" valor={predio.lugarNombre} />
            <FilaInfo label="Tipo de producción" valor={predio.tipoProduccion} />
            <FilaInfo label="Municipio / Vereda" valor={`${predio.municipio} / ${predio.vereda}`} />
            <FilaInfo label="Cultivos" valor={predio.cultivos.join(", ")} />
            </div>
            {/* Estado y próxima inspección */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 6 }}>
            <div style={{ background: C.verdePastel, borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.verde, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Estado sanitario</div>
                <Badge estado={predio.estadoSanitario} />
            </div>
            <div style={{ background: urgente ? C.rojoPastel : C.amarilloPastel, borderRadius: 10, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: urgente ? C.rojo : "#B7770D", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>Próxima inspección</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: urgente ? C.rojo : C.texto }}>{fmt(predio.proximaInspeccion)}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: urgente ? C.rojo : "#B7770D" }}>{dias}</div>
                <div style={{ fontSize: 10, color: urgente ? C.rojo : "#B7770D" }}>días</div>
                </div>
            </div>
            </div>
            <Divider />
            <div style={{ fontSize: 12, fontWeight: 700, color: C.textoMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>Historial de inspecciones</div>
            <div style={{ display: "grid", gap: 8 }}>
            {historial.length === 0 && <p style={{ fontSize: 13, color: C.textoMuted, margin: 0 }}>Sin inspecciones registradas.</p>}
            {historial.map(ins => (
                <div key={ins.id} style={{ borderRadius: 10, border: `1px solid ${C.borde}`, padding: "13px 15px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.texto }}>{fmt(ins.fecha)}</span>
                    <Badge estado={ins.resultado} />
                </div>
                <div style={{ fontSize: 12, color: C.textoMuted, marginBottom: 4 }}>Técnico: <strong style={{ color: C.texto }}>{ins.tecnico}</strong></div>
                <div style={{ fontSize: 12, color: C.textoMuted, lineHeight: 1.5 }}>{ins.observaciones}</div>
                </div>
            ))}
            </div>
            <div style={{ marginTop: 20 }}><BtnGris onClick={onClose} style={{ width: "100%", textAlign: "center" }}>Cerrar</BtnGris></div>
        </ModalShell>
        </Overlay>
    );
}

// ── MODAL RESULTADO INSPECCIÓN ────────────────────────────────────────────────
function ModalInspeccion({ ins, onClose }) {
    if (!ins) return null;
    return (
        <Overlay onClose={onClose}>
        <ModalShell titulo={`Solicitud #${ins.id}`} subtitulo="Detalle de solicitud" onClose={onClose} ancho={440}>
            <div style={{ display: "grid", gap: 14 }}>
            <FilaInfo label="Predio ID" valor={`Predio #${ins.predio_id}`} />
            <FilaInfo label="Fecha de solicitud" valor={new Date(ins.fechaSolicitud).toLocaleDateString('es-CO')} />
            <FilaInfo label="Fecha sugerida" valor={ins.fechaSugerida ? new Date(ins.fechaSugerida).toLocaleDateString('es-CO') : 'No indicada'} />
            <FilaInfo label="Observaciones" valor={ins.observaciones || 'Sin observaciones'} />
            <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.textoMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Estado</div>
                <Badge estado={ins.estado === 'pendiente' ? 'Pendiente' : ins.estado === 'asignada' ? 'En revisión' : ins.estado} />
            </div>
            </div>
            <div style={{ marginTop: 20 }}><BtnGris onClick={onClose} style={{ width: "100%", textAlign: "center" }}>Cerrar</BtnGris></div>
        </ModalShell>
        </Overlay>
    );
}

// ── MODAL SOLICITAR INSPECCIÓN ────────────────────────────────────────────────
function ModalSolicitar({ onClose, onSolicitudEnviada }) {
  const [paso, setPaso] = useState(1);
  const [predios, setPredios] = useState([]);
  const [form, setForm] = useState({ predioId: "", fecha: "", obs: "" });
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState("");
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  const productorId = usuario.id;

  useEffect(() => {
    fetch(`http://localhost:3000/api/inspecciones/predios/productor/${productorId}`)
      .then(r => r.json())
      .then(data => setPredios(Array.isArray(data) ? data : []))
      .catch(() => setPredios([]));
  }, []);

  const predioSel = predios.find(p => p.id === Number(form.predioId));

  const validar = () => {
    const e = {};
    if (!form.predioId) e.predioId = "Seleccione un predio";
    if (!form.fecha) e.fecha = "Seleccione una fecha";
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const handleSiguiente = () => {
    if (validar()) setPaso(2);
  };

  const handleEnviar = async () => {
    setEnviando(true);
    setErrorEnvio("");
    try {
      const res = await fetch('http://localhost:3000/api/inspecciones/solicitudes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productor_id: productorId,
          predio_id: Number(form.predioId),
          fechaSolicitud: form.fecha,
          observaciones: form.obs
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.mensaje || 'Error al enviar');
      setExito(true);
      if (onSolicitudEnviada) onSolicitudEnviada();
      setTimeout(() => { onClose(); }, 2000);
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
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.verde, marginBottom: 8 }}>¡Solicitud enviada!</div>
            <div style={{ fontSize: 13, color: C.textoMuted }}>Se asignará un técnico en los próximos días hábiles.</div>
          </div>
        ) : (
          <>
            {/* Steps */}
            <div style={{ display: "flex", marginBottom: 26, position: "relative" }}>
              {["Predio y fecha", "Confirmar"].map((label, i) => (
                <div key={i} style={{ flex: 1, textAlign: "center", position: "relative" }}>
                  {i < 1 && <div style={{ position: "absolute", top: 14, left: "50%", right: "-50%", height: 2, background: paso > 1 ? C.verde : C.borde, zIndex: 0 }} />}
                  <div style={{ width: 30, height: 30, borderRadius: "50%", background: paso >= i + 1 ? C.verde : C.borde, color: C.blanco, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 7px", fontWeight: 700, fontSize: 13, position: "relative", zIndex: 1 }}>
                    {paso > i ? "✓" : i + 1}
                  </div>
                  <div style={{ fontSize: 11, color: paso === i + 1 ? C.verde : C.textoMuted, fontWeight: paso === i + 1 ? 700 : 400 }}>{label}</div>
                </div>
              ))}
            </div>

            {paso === 1 && (
              <div style={{ display: "grid", gap: 16 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: C.textoMuted, display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>Predio *</label>
                  <select value={form.predioId} onChange={e => { set("predioId", e.target.value); setErrores(er => ({ ...er, predioId: "" })); }}
                    style={{ width: "100%", border: `1px solid ${errores.predioId ? C.rojo : C.borde}`, borderRadius: 8, padding: "9px 12px", fontSize: 13, color: C.texto, background: C.blanco, boxSizing: "border-box" }}>
                    <option value="">Seleccione un predio...</option>
                    {predios.map(p => <option key={p.id} value={p.id}>{p.nombre} — {p.lugarProduccion}</option>)}
                  </select>
                  {errores.predioId && <span style={{ fontSize: 11, color: C.rojo, marginTop: 4, display: "block" }}>{errores.predioId}</span>}
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: C.textoMuted, display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>Fecha sugerida *</label>
                  <input type="date" value={form.fecha} onChange={e => { set("fecha", e.target.value); setErrores(er => ({ ...er, fecha: "" })); }}
                    style={{ width: "100%", border: `1px solid ${errores.fecha ? C.rojo : C.borde}`, borderRadius: 8, padding: "9px 12px", fontSize: 13, color: C.texto, boxSizing: "border-box" }} />
                  {errores.fecha && <span style={{ fontSize: 11, color: C.rojo, marginTop: 4, display: "block" }}>{errores.fecha}</span>}
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: C.textoMuted, display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>Observaciones (opcional)</label>
                  <textarea value={form.obs} onChange={e => set("obs", e.target.value)} placeholder="Detalles relevantes..."
                    style={{ width: "100%", border: `1px solid ${C.borde}`, borderRadius: 8, padding: "9px 12px", fontSize: 13, color: C.texto, minHeight: 80, resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }} />
                </div>
              </div>
            )}

            {paso === 2 && predioSel && (
              <div style={{ display: "grid", gap: 12 }}>
                <div style={{ background: C.verdePastel, borderRadius: 10, padding: "16px 18px", display: "grid", gap: 12 }}>
                  <FilaInfo label="Predio" valor={predioSel.nombre} />
                  <FilaInfo label="Lugar de producción" valor={predioSel.lugarProduccion} />
                  <FilaInfo label="Fecha sugerida" valor={form.fecha ? fmt(form.fecha) : "No indicada"} />
                  {form.obs && <FilaInfo label="Observaciones" valor={form.obs} />}
                </div>
                <div style={{ background: C.azulPastel, borderRadius: 10, padding: "12px 14px", fontSize: 13, color: C.azul, lineHeight: 1.5 }}>
                  ℹ️ Su solicitud será revisada y se asignará un técnico en los próximos días hábiles.
                </div>
                {errorEnvio && (
                  <div style={{ background: C.rojoPastel, borderRadius: 10, padding: "12px 14px", fontSize: 13, color: C.rojo, fontWeight: 600 }}>
                    ⚠️ {errorEnvio}
                  </div>
                )}
              </div>
            )}

            <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
              <BtnGris onClick={paso === 1 ? onClose : () => setPaso(1)} style={{ flex: 1, textAlign: "center" }}>
                {paso === 1 ? "Cancelar" : "← Atrás"}
              </BtnGris>
              <BtnVerde
                onClick={paso === 1 ? handleSiguiente : handleEnviar}
                style={{ flex: 1, justifyContent: "center", opacity: enviando ? 0.7 : 1 }}>
                {paso === 1 ? "Siguiente →" : enviando ? "Enviando..." : "✓ Enviar solicitud"}
              </BtnVerde>
            </div>
          </>
        )}
      </ModalShell>
    </Overlay>
  );
}

// ── PÁGINAS ───────────────────────────────────────────────────────────────────
function PaginaDashboard({ setActiva }) {
    const [lugarVer, setLugarVer] = useState(null);
    const alertas = PREDIOS.filter(p => diasRestantes(p.proximaInspeccion) <= 30).length;

    return (
        <div style={{ padding: "24px 28px" }}>
        {/* Banner alerta */}
        {alertas > 0 && (
            <div style={{ background: C.rojoPastel, border: `1px solid ${C.rojo}`, borderRadius: 10, padding: "12px 18px", marginBottom: 22, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 18 }}>⚠️</span>
            <span style={{ fontSize: 13, color: C.rojo, fontWeight: 600, flex: 1 }}>
                Tienes {alertas} predio{alertas > 1 ? "s" : ""} con inspección próxima en menos de 30 días.
            </span>
            <button onClick={() => setActiva("inspecciones")} style={{ background: C.rojo, color: C.blanco, border: "none", borderRadius: 7, padding: "6px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>Ver inspecciones</button>
            </div>
        )}

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 26 }}>
            <StatCard icono="🗺️" label="Lugares registrados"     value={LUGARES.length}      colorTexto={C.azul}    colorFondo={C.azulPastel} />
            <StatCard icono="🏡" label="Predios asociados"       value={PREDIOS.length}      colorTexto={C.verde}   colorFondo={C.verdePastel} />
            <StatCard icono="✅" label="Inspecciones realizadas" value={INSPECCIONES.length} colorTexto={C.naranja} colorFondo={C.naranjaPastel} />
            <StatCard icono="⚠️" label="Alertas de plazo"        value={alertas}             colorTexto={alertas > 0 ? C.rojo : C.texto} colorFondo={alertas > 0 ? C.rojoPastel : C.grisPastel} />
        </div>

        {/* Tabla mis lugares */}
        <SectionTitle>Mis lugares de producción</SectionTitle>
        <div style={{ background: C.blanco, borderRadius: 12, border: `1px solid ${C.borde}`, overflow: "hidden" }}>
            <div style={{ padding: "14px 18px", borderBottom: `1px solid ${C.borde}`, display: "flex", justifyContent: "flex-end" }}>
            <BtnVerde onClick={() => setActiva("lugares")} style={{ fontSize: 12, padding: "6px 14px" }}>Ver todos</BtnVerde>
            </div>
            {/* Cabecera */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 0.6fr 1.4fr auto", gap: 8, padding: "10px 18px", background: C.verdePastel, fontSize: 11, fontWeight: 700, color: C.verde, textTransform: "uppercase", letterSpacing: 0.5 }}>
            <span>Nombre</span><span>Registro ICA</span><span>Predios</span><span>Estado sanitario</span><span>Detalle</span>
            </div>
            {LUGARES.map((l, i) => (
            <div key={l.id} style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 0.6fr 1.4fr auto", gap: 8, alignItems: "center", padding: "13px 18px", borderTop: i === 0 ? "none" : `1px solid ${C.borde}`, background: i % 2 === 0 ? C.blanco : "#FAFAFA" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.texto }}>{l.nombre}</span>
                <span style={{ fontSize: 12, color: C.textoMuted }}>{l.ica}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.texto }}>{l.prediosIds.length}</span>
                <Badge estado={l.estado} />
                <BtnOutline onClick={() => setLugarVer(l)}>Ver</BtnOutline>
            </div>
            ))}
        </div>
        {lugarVer && <ModalLugar lugar={lugarVer} onClose={() => setLugarVer(null)} />}
        </div>
    );
}

function PaginaLugares() {
    const [filtro, setFiltro] = useState("Todos");
    const [lugarVer, setLugarVer] = useState(null);
    const filtrados = LUGARES.filter(l => filtro === "Sin alerta" ? l.estadoType === "success" : filtro === "Con alerta" ? l.estadoType !== "success" : true);

    return (
        <div style={{ padding: "24px 28px" }}>
        <SectionTitle>Lugares de producción</SectionTitle>
        {/* Filtros pill */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            {["Todos", "Sin alerta", "Con alerta"].map(f => (
            <button key={f} onClick={() => setFiltro(f)} style={{ padding: "6px 16px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", border: `1px solid ${filtro === f ? C.verde : C.borde}`, background: filtro === f ? C.verdePastel : C.blanco, color: filtro === f ? C.verde : C.textoMuted, transition: "all 0.15s" }}>
                {f}
            </button>
            ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 16 }}>
            {filtrados.map(l => (
            <div key={l.id} style={{ background: C.blanco, borderRadius: 12, border: `1px solid ${C.borde}`, overflow: "hidden" }}>
                <div style={{ height: 5, background: l.estadoType === "success" ? C.verde : C.amarillo }} />
                <div style={{ padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: C.texto }}>{l.nombre}</div>
                    <div style={{ fontSize: 12, color: C.textoMuted, marginTop: 2 }}>{l.ica}</div>
                    </div>
                    <Badge estado={l.estado} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                    {[["Área", `${l.areaHa} ha`], ["Predios", l.prediosIds.length], ["Municipio", l.municipio], ["Cultivos", l.cultivos.join(", ")]].map(([k, v]) => (
                    <div key={k}><div style={{ fontSize: 10, color: C.textoMuted, fontWeight: 700, textTransform: "uppercase", marginBottom: 2 }}>{k}</div><div style={{ fontSize: 13, fontWeight: 600, color: C.texto }}>{v}</div></div>
                    ))}
                </div>
                <button onClick={() => setLugarVer(l)} style={{ width: "100%", background: C.verdePastel, color: C.verde, border: "none", borderRadius: 8, padding: "9px 0", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Ver detalle</button>
                </div>
            </div>
            ))}
        </div>
        {lugarVer && <ModalLugar lugar={lugarVer} onClose={() => setLugarVer(null)} />}
        </div>
    );
}

function PaginaPredios() {
    const [predioVer, setPredioVer] = useState(null);
    const [busqueda, setBusqueda] = useState("");
    const filtrados = PREDIOS.filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase()));

    return (
        <div style={{ padding: "24px 28px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <SectionTitle>Predios asociados</SectionTitle>
            <input placeholder="Buscar predio..." value={busqueda} onChange={e => setBusqueda(e.target.value)}
            style={{ border: `1px solid ${C.borde}`, borderRadius: 8, padding: "7px 14px", fontSize: 13, outline: "none", width: 200, color: C.texto }} />
        </div>
        <div style={{ background: C.blanco, borderRadius: 12, border: `1px solid ${C.borde}`, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1.4fr 0.8fr 1.3fr 1.3fr auto", gap: 8, padding: "10px 18px", background: C.verdePastel, fontSize: 11, fontWeight: 700, color: C.verde, textTransform: "uppercase", letterSpacing: 0.5 }}>
            <span>Predio</span><span>Lugar</span><span>Área</span><span>Estado</span><span>Próx. inspección</span><span>Ver</span>
            </div>
            {filtrados.map((p, i) => {
            const dias = diasRestantes(p.proximaInspeccion);
            return (
                <div key={p.id} style={{ display: "grid", gridTemplateColumns: "2fr 1.4fr 0.8fr 1.3fr 1.3fr auto", gap: 8, alignItems: "center", padding: "13px 18px", borderTop: i === 0 ? "none" : `1px solid ${C.borde}`, background: i % 2 === 0 ? C.blanco : "#FAFAFA" }}>
                <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.texto }}>{p.nombre}</div>
                    <div style={{ fontSize: 11, color: C.textoMuted }}>{p.cultivos.join(", ")}</div>
                </div>
                <span style={{ fontSize: 12, color: C.textoMuted }}>{p.lugarNombre}</span>
                <span style={{ fontSize: 13, color: C.texto }}>{p.areaHa} ha</span>
                <Badge estado={p.estadoSanitario} />
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 12, color: dias <= 7 ? C.rojo : C.textoMuted, fontWeight: dias <= 7 ? 700 : 400 }}>{fmt(p.proximaInspeccion)}</span>
                    {dias <= 30 && <span style={{ fontSize: 10, background: dias <= 7 ? C.rojoPastel : C.amarilloPastel, color: dias <= 7 ? C.rojo : C.amarillo, padding: "1px 6px", borderRadius: 8, fontWeight: 700 }}>{dias}d</span>}
                </div>
                <BtnOutline onClick={() => setPredioVer(p)}>Ver</BtnOutline>
                </div>
            );
            })}
        </div>
        {predioVer && <ModalPredio predio={predioVer} onClose={() => setPredioVer(null)} />}
        </div>
    );
}

function PaginaInspecciones() {
    const [tab, setTab] = useState("realizadas");
    const [modalSolicitar, setModalSolicitar] = useState(false);
    const [insVer, setInsVer] = useState(null);
    const [inspecciones, setInspecciones] = useState([]);
    const [cargando, setCargando] = useState(true);

    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

    const cargarInspecciones = () => {
        setCargando(true);
        fetch(`http://localhost:3000/api/inspecciones/solicitudes/productor/${usuario.id}`)
            .then(r => r.json())
            .then(data => setInspecciones(Array.isArray(data) ? data : []))
            .catch(err => console.error(err))
            .finally(() => setCargando(false));
    };

    useEffect(() => {
        cargarInspecciones();
    }, []);

    const porVencer = PREDIOS.filter(p => diasRestantes(p.proximaInspeccion) <= 30)
        .sort((a, b) => diasRestantes(a.proximaInspeccion) - diasRestantes(b.proximaInspeccion));

    return (
        <div style={{ padding: "24px 28px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <SectionTitle>Inspecciones</SectionTitle>
            <BtnVerde onClick={() => setModalSolicitar(true)}>+ Solicitar inspección</BtnVerde>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 20, background: C.grisPastel, padding: 6, borderRadius: 10, width: "fit-content" }}>
            <TabBtn activa={tab} id="realizadas" label={`Solicitudes (${inspecciones.length})`} setActiva={setTab} />
            <TabBtn activa={tab} id="porVencer" label={`Por vencer (${porVencer.length})`} setActiva={setTab} />
        </div>

        {tab === "realizadas" && (
            <div style={{ background: C.blanco, borderRadius: 12, border: `1px solid ${C.borde}`, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1.2fr auto", gap: 8, padding: "10px 18px", background: C.verdePastel, fontSize: 11, fontWeight: 700, color: C.verde, textTransform: "uppercase", letterSpacing: 0.5 }}>
                <span>Predio</span><span>Fecha Solicitud</span><span>Fecha Sugerida</span><span>Estado</span><span>Detalle</span>
            </div>
            {cargando ? (
                <div style={{ padding: 40, textAlign: "center", color: C.textoMuted }}>Cargando...</div>
            ) : inspecciones.length === 0 ? (
                <div style={{ padding: 40, textAlign: "center", color: C.textoMuted }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>
                    <p style={{ margin: 0, fontWeight: 600 }}>No tienes solicitudes de inspección</p>
                </div>
            ) : inspecciones.map((ins, i) => (
                <div key={ins.id} style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1.2fr auto", gap: 8, alignItems: "center", padding: "13px 18px", borderTop: i === 0 ? "none" : `1px solid ${C.borde}`, background: i % 2 === 0 ? C.blanco : "#FAFAFA" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.texto }}>Predio #{ins.predio_id}</span>
                <span style={{ fontSize: 12, color: C.textoMuted }}>{new Date(ins.fechaSolicitud).toLocaleDateString('es-CO')}</span>
                <span style={{ fontSize: 12, color: C.textoMuted }}>{ins.fechaSugerida ? new Date(ins.fechaSugerida).toLocaleDateString('es-CO') : 'No indicada'}</span>
                <Badge estado={ins.estado === 'pendiente' ? 'Pendiente' : ins.estado === 'asignada' ? 'En revisión' : ins.estado} />
                <BtnOutline onClick={() => setInsVer(ins)}>Ver</BtnOutline>
                </div>
            ))}
            </div>
        )}

        {tab === "porVencer" && (
            porVencer.length === 0
            ? <div style={{ textAlign: "center", padding: 48, color: C.textoMuted }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>✅</div>
                <p style={{ fontWeight: 600, margin: 0 }}>No hay inspecciones próximas a vencer</p>
                </div>
            : <div style={{ display: "grid", gap: 12 }}>
                {porVencer.map(p => {
                    const dias = diasRestantes(p.proximaInspeccion);
                    return (
                    <div key={p.id} style={{ background: C.blanco, borderRadius: 12, border: `1px solid ${dias <= 7 ? C.rojo : C.amarillo}`, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: C.texto, marginBottom: 3 }}>{p.nombre}</div>
                        <div style={{ fontSize: 12, color: C.textoMuted }}>{p.lugarNombre} · {p.cultivos.join(", ")}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 24, fontWeight: 800, color: dias <= 7 ? C.rojo : C.amarillo }}>{dias}d</div>
                        <div style={{ fontSize: 11, color: C.textoMuted }}>para {fmt(p.proximaInspeccion)}</div>
                        </div>
                    </div>
                    );
                })}
                </div>
        )}

        {insVer && <ModalInspeccion ins={insVer} onClose={() => setInsVer(null)} />}
        {modalSolicitar && (
            <ModalSolicitar 
                onClose={() => setModalSolicitar(false)} 
                onSolicitudEnviada={() => {
                    cargarInspecciones();
                    setModalSolicitar(false);
                }}
            />
        )}
        </div>
    );
}

function PaginaInformes() {
    const reportes = [
        { titulo: "Reporte por lugar de producción", desc: "Estado sanitario, inspecciones y cultivos por lugar.", icono: "🗺️" },
        { titulo: "Reporte por predio",              desc: "Historial completo de inspecciones y resultados.",      icono: "🏡" },
        { titulo: "Historial de inspecciones",       desc: "Listado cronológico de todas las inspecciones.",        icono: "📋" },
        { titulo: "Alertas y observaciones",         desc: "Alertas activas y observaciones pendientes.",           icono: "⚠️" },
    ];
    return (
        <div style={{ padding: "24px 28px" }}>
        <SectionTitle>Informes</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
            {reportes.map((r, i) => (
            <div key={i} style={{ background: C.blanco, borderRadius: 12, border: `1px solid ${C.borde}`, padding: 22, display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ width: 48, height: 48, background: C.verdePastel, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{r.icono}</div>
                <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.texto, marginBottom: 5 }}>{r.titulo}</div>
                <div style={{ fontSize: 12, color: C.textoMuted, lineHeight: 1.6 }}>{r.desc}</div>
                </div>
                <button style={{ marginTop: "auto", background: C.verdePastel, color: C.verde, border: "none", borderRadius: 8, padding: "10px 0", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                ⬇ Descargar PDF
                </button>
            </div>
            ))}
        </div>
        </div>
    );
}

// ── APP ───────────────────────────────────────────────────────────────────────
export default function DashboardProductor() {
    const [activa, setActiva] = useState("dashboard");
    const [menuAbierto, setMenuAbierto] = useState(true);

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: C.grisPastel, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
        <Sidebar activa={activa} setActiva={setActiva} menuAbierto={menuAbierto} setMenuAbierto={setMenuAbierto} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
            <Header titulo={TITULOS[activa]} menuAbierto={menuAbierto} setMenuAbierto={setMenuAbierto} />
            <main style={{ flex: 1, overflowY: "auto" }}>
            {activa === "dashboard"    && <PaginaDashboard setActiva={setActiva} />}
            {activa === "lugares"      && <PaginaLugares />}
            {activa === "predios"      && <PaginaPredios />}
            {activa === "inspecciones" && <PaginaInspecciones />}
            {activa === "informes"     && <PaginaInformes />}
            </main>
        </div>
        </div>
    );
}