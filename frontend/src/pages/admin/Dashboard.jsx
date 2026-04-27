import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from "react";

const COLORES = {
  verde: "#2E7D32",
  verdeClaro: "#4CAF50",
  verdePastel: "#E8F5E9",
  gris: "#546E7A",
  grisPastel: "#ECEFF1",
  blanco: "#FFFFFF",
  texto: "#1B2631",
  textoMuted: "#607D8B",
  borde: "#CFD8DC",
  azul: "#1565C0",
  azulPastel: "#E3F2FD",
  naranja: "#E65100",
  naranjaPastel: "#FFF3E0",
  morado: "#6A1B9A",
  moradoPastel: "#F3E5F5",
  rojo: "#C62828",
  rojoPastel: "#FFEBEE",
  amarillo: "#F9A825",
  amarilloPastel: "#FFFDE7",
};

// ── DATOS ────────────────────────────────────────────────────────────────────
const predios = [
  { nombre: "Finca El Paraíso",    ubicacion: "Santander",    afectacion: 75 },
  { nombre: "Predio La Esperanza", ubicacion: "Boyacá",       afectacion: 60 },
  { nombre: "Hacienda Verde",      ubicacion: "Cundinamarca", afectacion: 45 },
  { nombre: "Finca Los Pinos",     ubicacion: "Antioquia",    afectacion: 30 },
  { nombre: "Predio El Roble",     ubicacion: "Santander",    afectacion: 20 },
  { nombre: "Finca La Ceiba",      ubicacion: "Tolima",       afectacion: 55 },
];

const tecnicosPendientes = [
  { id: 1, nombre: "Carlos",  apellido: "Ramírez",   identificacion: "1098765432", tarjetaProfesional: "ICA-2024-0341", correo: "c.ramirez@ica.gov.co",  telefono: "3201234567", fechaRegistro: "12/04/2025", enviadoPorIca: true  },
  { id: 2, nombre: "Luisa",   apellido: "Fernández", identificacion: "52987654",   tarjetaProfesional: "",               correo: "luisa.fdz@gmail.com",    telefono: "3109876543", fechaRegistro: "14/04/2025", enviadoPorIca: false },
  { id: 3, nombre: "Andrés",  apellido: "Moreno",    identificacion: "79123456",   tarjetaProfesional: "ICA-2023-0188", correo: "a.moreno@ica.gov.co",   telefono: "3154321098", fechaRegistro: "16/04/2025", enviadoPorIca: true  },
];

const usuariosRegistrados = [
  { id: 4, tipo: "Técnico",   nombre: "María",  apellido: "Gómez",   identificacion: "43876543", tarjetaProfesional: "ICA-2022-0075", correo: "m.gomez@ica.gov.co",   telefono: "3167890123", fechaRegistro: "05/01/2025", enviadoPorIca: true  },
  { id: 5, tipo: "Técnico",   nombre: "Jorge",  apellido: "Herrera", identificacion: "80234567", tarjetaProfesional: "",               correo: "j.herrera@agro.com",    telefono: "3012345678", fechaRegistro: "18/02/2025", enviadoPorIca: false },
  { id: 6, tipo: "Productor", nombre: "Pedro",  apellido: "Sánchez", identificacion: "72345678", tarjetaProfesional: "",               correo: "pedro.s@gmail.com",     telefono: "3187654321", fechaRegistro: "22/03/2025", enviadoPorIca: false },
  { id: 7, tipo: "Productor", nombre: "Ana",    apellido: "Torres",  identificacion: "52123456", tarjetaProfesional: "",               correo: "ana.torres@correo.com", telefono: "3145678901", fechaRegistro: "01/04/2025", enviadoPorIca: false },
  { id: 8, tipo: "Técnico",   nombre: "Hernán", apellido: "Vargas",  identificacion: "91234567", tarjetaProfesional: "ICA-2023-0299", correo: "h.vargas@ica.gov.co",   telefono: "3001122334", fechaRegistro: "10/04/2025", enviadoPorIca: true  },
];

const tecnicosDisponibles = [
  { id: 4, nombre: "María",  apellido: "Gómez"   },
  { id: 5, nombre: "Jorge",  apellido: "Herrera"  },
  { id: 8, nombre: "Hernán", apellido: "Vargas"   },
];

const solicitudesIniciales = [
  {
    id: 1, estado: "Sin asignar", fechaSolicitud: "14/04/2025",
    predio: "Finca El Paraíso",
    productor: { nombre: "Pedro Sánchez", id: "72345678", telefono: "3187654321", correo: "pedro.s@gmail.com" },
    ubicacion: { departamento: "Santander", municipio: "Piedecuesta", vereda: "Vereda El Carmen", coordenadas: "6°59'12\"N 73°02'44\"W" },
    area: 12.5,
    cultivos: [
      { nombre: "Tomate",        variedad: "Chonto", area: 5.0, tiempoSembrado: "3 meses", estadoFenologico: "Fructificación", cantidadPlantas: 8400  },
      { nombre: "Cebolla larga", variedad: "Junca",  area: 7.5, tiempoSembrado: "5 meses", estadoFenologico: "Maduración",     cantidadPlantas: 15000 },
    ],
    infraestructura: "Invernadero, sistema de riego por goteo",
    observaciones: "Se detectaron posibles síntomas de plaga en sector norte del predio.",
    tecnicoAsignado: null,
  },
  {
    id: 2, estado: "Sin asignar", fechaSolicitud: "12/04/2025",
    predio: "Hacienda Montecarlo",
    productor: { nombre: "Carlos Medina", id: "91234567", telefono: "3201234567", correo: "c.medina@gmail.com" },
    ubicacion: { departamento: "Antioquia", municipio: "Rionegro", vereda: "Vereda La Mosca", coordenadas: "6°09'00\"N 75°22'00\"W" },
    area: 6.8,
    cultivos: [
      { nombre: "Fresa", variedad: "Festival", area: 6.8, tiempoSembrado: "6 meses", estadoFenologico: "Cosecha", cantidadPlantas: 34000 },
    ],
    infraestructura: "Macrotúneles, fertiriego automatizado",
    observaciones: "Producción para exportación, requiere certificación urgente.",
    tecnicoAsignado: null,
  },
  {
    id: 3, estado: "Pendiente", fechaSolicitud: "10/04/2025",
    predio: "Predio La Esperanza",
    productor: { nombre: "Ana Torres", id: "52123456", telefono: "3145678901", correo: "ana.torres@correo.com" },
    ubicacion: { departamento: "Boyacá", municipio: "Tunja", vereda: "Vereda Higueras", coordenadas: "5°31'40\"N 73°21'38\"W" },
    area: 8.2,
    cultivos: [
      { nombre: "Papa", variedad: "Pastusa suprema", area: 8.2, tiempoSembrado: "4 meses", estadoFenologico: "Tuberización", cantidadPlantas: 20500 },
    ],
    infraestructura: "Sistema de drenaje, bodega de almacenamiento",
    observaciones: "Solicitud urgente por posible ataque de Phytophthora.",
    tecnicoAsignado: "María Gómez",
  },
  {
    id: 4, estado: "Pendiente", fechaSolicitud: "08/04/2025",
    predio: "Finca San Isidro",
    productor: { nombre: "Jorge Ríos", id: "80234567", telefono: "3012345678", correo: "j.rios@agro.com" },
    ubicacion: { departamento: "Huila", municipio: "Pitalito", vereda: "Vereda Palmar", coordenadas: "1°51'00\"N 76°03'00\"W" },
    area: 15.0,
    cultivos: [
      { nombre: "Café",    variedad: "Castillo", area: 10.0, tiempoSembrado: "3 años",   estadoFenologico: "Maduración",       cantidadPlantas: 18000 },
      { nombre: "Plátano", variedad: "Hartón",   area: 5.0,  tiempoSembrado: "14 meses", estadoFenologico: "Llenado de fruto", cantidadPlantas: 2500  },
    ],
    infraestructura: "Beneficiadero de café, secadero solar",
    observaciones: "Inspección de rutina anual requerida por exportador.",
    tecnicoAsignado: "Hernán Vargas",
  },
  {
    id: 5, estado: "Completada", fechaSolicitud: "02/04/2025",
    predio: "Hacienda Verde",
    productor: { nombre: "Luis Herrera", id: "43876543", telefono: "3167890123", correo: "l.herrera@agro.com" },
    ubicacion: { departamento: "Cundinamarca", municipio: "Fusagasugá", vereda: "Vereda Bochica", coordenadas: "4°20'35\"N 74°21'47\"W" },
    area: 20.0,
    cultivos: [
      { nombre: "Aguacate", variedad: "Hass",   area: 12.0, tiempoSembrado: "2 años",   estadoFenologico: "Floración",        cantidadPlantas: 3600 },
      { nombre: "Plátano",  variedad: "Hartón", area: 8.0,  tiempoSembrado: "10 meses", estadoFenologico: "Llenado de fruto", cantidadPlantas: 2400 },
    ],
    infraestructura: "Red de caminos internos, sistema de riego por aspersión",
    observaciones: "Sin novedades adicionales.",
    tecnicoAsignado: "Hernán Vargas",
  },
  {
    id: 6, estado: "Completada", fechaSolicitud: "28/03/2025",
    predio: "Predio El Roble",
    productor: { nombre: "Sandra Gómez", id: "52987654", telefono: "3109876543", correo: "s.gomez@gmail.com" },
    ubicacion: { departamento: "Santander", municipio: "Floridablanca", vereda: "Vereda Sur", coordenadas: "6°59'00\"N 73°03'00\"W" },
    area: 4.5,
    cultivos: [
      { nombre: "Pimentón", variedad: "Natalie", area: 4.5, tiempoSembrado: "2 meses", estadoFenologico: "Cuajado", cantidadPlantas: 9000 },
    ],
    infraestructura: "Invernadero plástico, riego por aspersión",
    observaciones: "Primer ciclo de producción, sin antecedentes.",
    tecnicoAsignado: "María Gómez",
  },
];

const navItems = [
  { id: "dashboard",   label: "Dashboard",                icono: "📊" },
  { id: "solicitudes", label: "Solicitudes de inspección", icono: "📄" },
  { id: "usuarios",    label: "Verificación de usuarios",  icono: "👤" },
];

// ── COMPONENTES REUTILIZABLES ─────────────────────────────────────────────────
function BarraAfectacion({ valor }) {
  const color = valor >= 70 ? COLORES.rojo : valor >= 50 ? COLORES.naranja : valor >= 30 ? COLORES.amarillo : COLORES.verdeClaro;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ flex: 1, height: 8, background: COLORES.grisPastel, borderRadius: 4, overflow: "hidden" }}>
        <div style={{ width: `${valor}%`, height: "100%", background: color, borderRadius: 4 }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, minWidth: 36, textAlign: "right", color: valor >= 70 ? COLORES.rojo : valor >= 50 ? COLORES.naranja : COLORES.textoMuted }}>{valor}%</span>
    </div>
  );
}

function Tarjeta({ icono, titulo, valor, colorTexto, colorFondo }) {
  return (
    <div style={{ background: COLORES.blanco, borderRadius: 14, border: `1px solid ${COLORES.borde}`, padding: "20px 22px", display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ width: 42, height: 42, borderRadius: 10, background: colorFondo, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{icono}</div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: COLORES.textoMuted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>{titulo}</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: colorTexto, lineHeight: 1 }}>{valor}</div>
      </div>
    </div>
  );
}

function FilaInfo({ label, valor }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <span style={{ fontSize: 11, color: COLORES.textoMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</span>
      <span style={{ fontSize: 14, color: COLORES.texto, fontWeight: 500 }}>{valor}</span>
    </div>
  );
}

function SeccionTitulo({ children }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, color: COLORES.verde, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ width: 3, height: 14, background: COLORES.verde, borderRadius: 2 }} />
      {children}
    </div>
  );
}

// ── MODAL SOLICITUD ───────────────────────────────────────────────────────────
function ModalSolicitud({ sol, tecnicos, onClose, onAprobar, onRechazar, onAsignarTecnico }) {function ModalSolicitud({ sol, tecnicos, onClose, onAprobar, onRechazar, onAsignarTecnico }) {
  const [tecnicoSel, setTecnicoSel] = useState("");

  if (!sol) return null;

  const esPendiente = sol.estado === "Sin asignar" || sol.estado === "pendiente";

  const coloresCultivo = [
    ["#F3E5F5", "#6A1B9A"],
    ["#E3F2FD", "#1565C0"],
    ["#FFF3E0", "#E65100"],
  ];

  const handleAsignar = () => {
    if (tecnicoSel) {
      const tecnico = tecnicos.find(t => t.id === parseInt(tecnicoSel));
      onAsignarTecnico(sol.id, tecnicoSel, tecnico?.nombre || '');
      setTecnicoSel("");
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onClose}>
      <div style={{ background: COLORES.blanco, borderRadius: 16, width: 520, maxWidth: "100%", maxHeight: "90vh", overflowY: "auto", padding: 28 }} onClick={e => e.stopPropagation()}>

        {/* Cabecera */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: COLORES.verdeClaro, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
              Solicitud #{sol.id} · {new Date(sol.fechaSolicitud).toLocaleDateString('es-CO')}
            </div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: COLORES.texto }}>{sol.predio}</h2>
            <div style={{ marginTop: 6 }}>
              {esPendiente && <span style={{ background: COLORES.rojoPastel, color: COLORES.rojo, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>⚠ Sin asignar</span>}
              {sol.estado === "asignada" && sol.resultado !== "Completada" && <span style={{ background: COLORES.amarilloPastel, color: "#B7770D", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>🕐 En proceso</span>}
              {sol.resultado === "Completada" && <span style={{ background: "#C8E6C9", color: "#1B5E20", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>✓ Completada</span>}
            </div>
          </div>
          <button onClick={onClose} style={{ background: COLORES.grisPastel, border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 18, color: COLORES.gris }}>×</button>
        </div>

        {/* Productor */}
        <SeccionTitulo>Productor responsable</SeccionTitulo>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }}>
          <FilaInfo label="Nombre"    valor={sol.productor?.nombre || ''} />
          <FilaInfo label="Teléfono"  valor={sol.productor?.telefono || ''} />
          <FilaInfo label="Correo"    valor={sol.productor?.correo || ''} />
        </div>
        <hr style={{ border: "none", borderTop: `1px solid ${COLORES.borde}`, margin: "18px 0" }} />

        {/* Ubicación */}
        <SeccionTitulo>Ubicación del predio</SeccionTitulo>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 10 }}>
          <FilaInfo label="Vereda" valor={sol.vereda || ''} />
        </div>
        <div style={{ background: "#EAF3DE", borderRadius: 8, padding: "9px 14px", fontSize: 12, color: "#3B6D11", marginBottom: 18 }}>
          📍 {sol.vereda || 'Sin ubicación'}
        </div>
        <hr style={{ border: "none", borderTop: `1px solid ${COLORES.borde}`, margin: "18px 0" }} />

        {/* Cultivos */}
        <SeccionTitulo>Cultivos registrados</SeccionTitulo>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
          {(sol.cultivos || '').split(',').map((c, i) => {
            const [bg, col] = coloresCultivo[i % 3];
            return (
              <div key={i} style={{ background: bg, borderRadius: 10, padding: "13px 16px" }}>
                <span style={{ fontWeight: 700, fontSize: 14, color: col }}>{c.trim()}</span>
              </div>
            );
          })}
        </div>
        <hr style={{ border: "none", borderTop: `1px solid ${COLORES.borde}`, margin: "18px 0" }} />

        {/* Técnico asignado */}
        <SeccionTitulo>Técnico asignado</SeccionTitulo>
        <div style={{ background: sol.tecnicoAsignado ? "#C8E6C9" : COLORES.rojoPastel, borderRadius: 8, padding: "11px 14px", fontSize: 13, fontWeight: 600, color: sol.tecnicoAsignado ? "#1B5E20" : COLORES.rojo, marginBottom: esPendiente ? 16 : 24 }}>
          {sol.tecnicoAsignado ? `✓ ${sol.tecnicoAsignado}` : "⚠ Sin técnico asignado"}
        </div>

        {/* Selector de técnico */}
        {esPendiente && (
          <div style={{ background: COLORES.azulPastel, borderRadius: 10, padding: "14px 16px", marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: COLORES.azul, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>
              Asignar técnico
            </div>
            <select
              value={tecnicoSel}
              onChange={e => setTecnicoSel(e.target.value)}
              style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: `1px solid ${COLORES.borde}`, fontSize: 13, color: COLORES.texto, background: COLORES.blanco, marginBottom: 10 }}
            >
              <option value="">Seleccionar técnico...</option>
              {(tecnicos || []).map(t => (
                <option key={t.id} value={t.id}>
                  {t.nombre}
                </option>
              ))}
            </select>
            <button
              disabled={!tecnicoSel}
              onClick={handleAsignar}
              style={{ width: "100%", background: tecnicoSel ? COLORES.azul : COLORES.grisPastel, color: tecnicoSel ? COLORES.blanco : COLORES.gris, border: "none", borderRadius: 8, padding: "10px 0", fontSize: 13, fontWeight: 700, cursor: tecnicoSel ? "pointer" : "not-allowed" }}
            >
              Confirmar asignación
            </button>
          </div>
        )}

        {/* Acciones */}
        {esPendiente ? (
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => onRechazar(sol.id)} style={{ flex: 1, background: COLORES.rojoPastel, color: COLORES.rojo, border: `1px solid ${COLORES.rojo}`, borderRadius: 8, padding: "10px 0", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              ✕ Rechazar
            </button>
            <button onClick={() => onAprobar(sol.id)} style={{ flex: 1, background: COLORES.verde, color: COLORES.blanco, border: "none", borderRadius: 8, padding: "10px 0", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              ✓ Aprobar
            </button>
          </div>
        ) : (
          <button onClick={onClose} style={{ width: "100%", background: COLORES.grisPastel, color: COLORES.gris, border: "none", borderRadius: 8, padding: "10px 0", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            Cerrar
          </button>
        )}
      </div>
    </div>
  );
}
  const [tecnicoSel, setTecnicoSel] = useState("");

  if (!sol) return null;

  const esPendiente = sol.estado === "Sin asignar" || sol.estado === "pendiente";

  const coloresCultivo = [
    ["#F3E5F5", "#6A1B9A"],
    ["#E3F2FD", "#1565C0"],
    ["#FFF3E0", "#E65100"],
  ];

  const handleAsignar = () => {
    if (tecnicoSel) {
      const tecnico = tecnicos.find(t => t.id === parseInt(tecnicoSel));
      onAsignarTecnico(sol.id, tecnicoSel, tecnico?.nombre || '');
      setTecnicoSel("");
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onClose}>
      <div style={{ background: COLORES.blanco, borderRadius: 16, width: 520, maxWidth: "100%", maxHeight: "90vh", overflowY: "auto", padding: 28 }} onClick={e => e.stopPropagation()}>

        {/* Cabecera */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: COLORES.verdeClaro, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
              Solicitud #{sol.id} · {new Date(sol.fechaSolicitud).toLocaleDateString('es-CO')}
            </div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: COLORES.texto }}>{sol.predio}</h2>
            <div style={{ marginTop: 6 }}>
              {esPendiente && <span style={{ background: COLORES.rojoPastel, color: COLORES.rojo, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>⚠ Sin asignar</span>}
              {sol.estado === "asignada" && sol.resultado !== "Completada" && <span style={{ background: COLORES.amarilloPastel, color: "#B7770D", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>🕐 En proceso</span>}
              {sol.resultado === "Completada" && <span style={{ background: "#C8E6C9", color: "#1B5E20", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>✓ Completada</span>}
            </div>
          </div>
          <button onClick={onClose} style={{ background: COLORES.grisPastel, border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 18, color: COLORES.gris }}>×</button>
        </div>

        {/* Productor */}
        <SeccionTitulo>Productor responsable</SeccionTitulo>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }}>
          <FilaInfo label="Nombre"    valor={sol.productor?.nombre || ''} />
          <FilaInfo label="Teléfono"  valor={sol.productor?.telefono || ''} />
          <FilaInfo label="Correo"    valor={sol.productor?.correo || ''} />
        </div>
        <hr style={{ border: "none", borderTop: `1px solid ${COLORES.borde}`, margin: "18px 0" }} />

        <SeccionTitulo>Ubicación del predio</SeccionTitulo>
        <div style={{ background: "#EAF3DE", borderRadius: 8, padding: "9px 14px", fontSize: 12, color: "#3B6D11", marginBottom: 18 }}>
          📍 {sol.vereda || 'Sin ubicación'}
        </div>
        <hr style={{ border: "none", borderTop: `1px solid ${COLORES.borde}`, margin: "18px 0" }} />

        <SeccionTitulo>Cultivos registrados</SeccionTitulo>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
          {(sol.cultivos || '').split(',').map((c, i) => {
            const coloresCultivo = [["#F3E5F5","#6A1B9A"],["#E3F2FD","#1565C0"],["#FFF3E0","#E65100"]];
            const [bg, col] = coloresCultivo[i % 3];
            return (
              <div key={i} style={{ background: bg, borderRadius: 10, padding: "13px 16px" }}>
                <span style={{ fontWeight: 700, fontSize: 14, color: col }}>{c.trim()}</span>
              </div>
            );
          })}
        </div>
        <hr style={{ border: "none", borderTop: `1px solid ${COLORES.borde}`, margin: "18px 0" }} />

        <SeccionTitulo>Técnico asignado</SeccionTitulo>
        <div style={{ background: sol.tecnicoAsignado ? "#C8E6C9" : COLORES.rojoPastel, borderRadius: 8, padding: "11px 14px", fontSize: 13, fontWeight: 600, color: sol.tecnicoAsignado ? "#1B5E20" : COLORES.rojo, marginBottom: esPendiente ? 16 : 24 }}>
          {sol.tecnicoAsignado ? `✓ ${sol.tecnicoAsignado}` : "⚠ Sin técnico asignado"}
        </div>

        {esPendiente && (
          <div style={{ background: COLORES.azulPastel, borderRadius: 10, padding: "14px 16px", marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: COLORES.azul, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Asignar técnico</div>
            <select value={tecnicoSel} onChange={e => setTecnicoSel(e.target.value)}
              style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: `1px solid ${COLORES.borde}`, fontSize: 13, color: COLORES.texto, background: COLORES.blanco, marginBottom: 10 }}>
              <option value="">Seleccionar técnico...</option>
              {(tecnicos || []).map(t => (
                <option key={t.id} value={t.id}>{t.nombre}</option>
              ))}
            </select>
            <button disabled={!tecnicoSel} onClick={handleAsignar}
              style={{ width: "100%", background: tecnicoSel ? COLORES.azul : COLORES.grisPastel, color: tecnicoSel ? COLORES.blanco : COLORES.gris, border: "none", borderRadius: 8, padding: "10px 0", fontSize: 13, fontWeight: 700, cursor: tecnicoSel ? "pointer" : "not-allowed" }}>
              Confirmar asignación
            </button>
          </div>
        )}

        {esPendiente ? (
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => onRechazar(sol.id)} style={{ flex: 1, background: COLORES.rojoPastel, color: COLORES.rojo, border: `1px solid ${COLORES.rojo}`, borderRadius: 8, padding: "10px 0", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>✕ Rechazar</button>
            <button onClick={() => onAprobar(sol.id)} style={{ flex: 1, background: COLORES.verde, color: COLORES.blanco, border: "none", borderRadius: 8, padding: "10px 0", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>✓ Aprobar</button>
          </div>
        ) : (
          <button onClick={onClose} style={{ width: "100%", background: COLORES.grisPastel, color: COLORES.gris, border: "none", borderRadius: 8, padding: "10px 0", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cerrar</button>
        )}
      </div>
    </div>
  );
}

// ── TABLA SECCIÓN COLAPSABLE ──────────────────────────────────────────────────
function TablaSeccion({ titulo, accentColor, accentBg, icono, items, columnas, headerCols, renderRow, emptyMsg }) {
  const [abierto, setAbierto] = useState(true);
  return (
    <div style={{ marginBottom: 24 }}>
      <button
        onClick={() => setAbierto(!abierto)}
        style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, background: accentBg, border: `1px solid ${accentColor}33`, borderRadius: abierto ? "12px 12px 0 0" : 12, padding: "13px 20px", cursor: "pointer" }}
      >
        <span style={{ fontSize: 16 }}>{icono}</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: accentColor }}>{titulo}</span>
        <span style={{ marginLeft: 8, background: accentColor, color: "#fff", fontSize: 11, fontWeight: 800, padding: "1px 8px", borderRadius: 10 }}>{items.length}</span>
        <span style={{ marginLeft: "auto", fontSize: 16, color: accentColor, fontWeight: 700 }}>{abierto ? "▲" : "▼"}</span>
      </button>
      {abierto && (
        <div style={{ background: COLORES.blanco, borderRadius: "0 0 12px 12px", border: `1px solid ${accentColor}33`, borderTop: "none", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: columnas, gap: 8, padding: "10px 20px", background: accentBg, fontSize: 11, fontWeight: 700, color: accentColor, textTransform: "uppercase", letterSpacing: 0.5 }}>
            {headerCols.map(h => <span key={h}>{h}</span>)}
          </div>
          {items.length === 0
            ? <div style={{ padding: "32px 20px", textAlign: "center", color: COLORES.textoMuted, fontSize: 13 }}>{emptyMsg}</div>
            : items.map((s, i) => renderRow(s, i))
          }
        </div>
      )}
    </div>
  );
}

// ── PÁGINA SOLICITUDES ────────────────────────────────────────────────────────
function PaginaSolicitudes() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [seleccionada, setSeleccionada] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/inspecciones/solicitudes/completas')
      .then(res => res.json())
      .then(data => setSolicitudes(data))
      .catch(err => console.error(err));

    fetch('http://localhost:3000/api/usuarios')
      .then(res => res.json())
      .then(data => setTecnicos(data.filter(u => u.rol === 'tecnico')))
      .catch(err => console.error(err));
  }, []);

  const sinAsignar = solicitudes.filter(s => s.estado === "pendiente" && !s.tecnico_id);
  const pendientes = solicitudes.filter(s => s.estado === "asignada" && s.resultado !== "Completada");
  const completadas = solicitudes.filter(s => s.resultado === "Completada");

  const handleAprobar = async (id) => {
    await fetch(`http://localhost:3000/api/inspecciones/solicitudes/${id}/estado`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: 'aprobada' })
    });
    setSolicitudes(prev => prev.map(s => s.id === id ? { ...s, estado: "aprobada" } : s));
    setSeleccionada(prev => prev ? { ...prev, estado: "aprobada" } : null);
  };

  const handleRechazar = async (id) => {
    await fetch(`http://localhost:3000/api/inspecciones/solicitudes/${id}/estado`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: 'rechazada' })
    });
    setSolicitudes(prev => prev.filter(s => s.id !== id));
    setSeleccionada(null);
  };

  const handleAsignarTecnico = async (solicitudId, tecnicoId, tecnicoNombre) => {
    try {
      const res = await fetch('http://localhost:3000/api/inspecciones/inspecciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fechaInspeccion: new Date().toISOString().split('T')[0],
          observaciones: '',
          resultado: 'Pendiente',
          tecnico_id: tecnicoId,
          solicitud_id: solicitudId
        })
      });
      if (!res.ok) throw new Error('Error al asignar');
      await fetch(`http://localhost:3000/api/inspecciones/solicitudes/${solicitudId}/estado`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: 'asignada' })
      });
      setSolicitudes(prev => prev.map(s => s.id === solicitudId ? { ...s, estado: "asignada", tecnico_id: tecnicoId, tecnicoAsignado: tecnicoNombre } : s));
      setSeleccionada(null);
    } catch (err) {
      console.error(err);
    }
  };

  const colsSin = "2fr 1.6fr 1fr auto";
  const colsConTecnico = "2fr 1.6fr 1.4fr 1fr auto";

  const rowSinAsignar = (s, i) => (
    <div key={s.id} style={{ display: "grid", gridTemplateColumns: colsSin, gap: 8, alignItems: "center", padding: "13px 20px", borderTop: `1px solid ${COLORES.borde}`, background: i % 2 === 0 ? COLORES.blanco : "#FAFAFA" }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: COLORES.texto }}>{s.predio}</div>
        <div style={{ fontSize: 11, color: COLORES.textoMuted, marginTop: 2 }}>#{s.id} · {new Date(s.fechaSolicitud).toLocaleDateString('es-CO')}</div>
      </div>
      <div style={{ fontSize: 12, color: COLORES.texto }}>{s.productor?.nombre}</div>
      <div style={{ fontSize: 12, color: COLORES.textoMuted }}>{s.vereda}</div>
      <button onClick={() => setSeleccionada(s)} style={{ background: COLORES.verde, color: COLORES.blanco, border: "none", borderRadius: 7, padding: "6px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Ver info</button>
    </div>
  );

  const rowConTecnico = (s, i) => (
    <div key={s.id} style={{ display: "grid", gridTemplateColumns: colsConTecnico, gap: 8, alignItems: "center", padding: "13px 20px", borderTop: `1px solid ${COLORES.borde}`, background: i % 2 === 0 ? COLORES.blanco : "#FAFAFA" }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: COLORES.texto }}>{s.predio}</div>
        <div style={{ fontSize: 11, color: COLORES.textoMuted, marginTop: 2 }}>#{s.id} · {new Date(s.fechaSolicitud).toLocaleDateString('es-CO')}</div>
      </div>
      <div style={{ fontSize: 12, color: COLORES.texto }}>{s.productor?.nombre}</div>
      <div style={{ fontSize: 12, color: COLORES.textoMuted }}>{s.tecnicoAsignado || "Sin asignar"}</div>
      <div style={{ fontSize: 12, color: COLORES.textoMuted }}>{s.vereda}</div>
      <button onClick={() => setSeleccionada(s)} style={{ background: COLORES.grisPastel, color: COLORES.gris, border: "none", borderRadius: 7, padding: "6px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Ver info</button>
    </div>
  );

  return (
    <div style={{ padding: "28px 32px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
        <div style={{ width: 4, height: 24, background: COLORES.verde, borderRadius: 2 }} />
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: COLORES.texto }}>Solicitudes de inspección</h1>
        <span style={{ marginLeft: 8, background: COLORES.grisPastel, color: COLORES.gris, fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 10 }}>
          {solicitudes.length} en total
        </span>
      </div>

      <TablaSeccion
        titulo="Sin asignar" icono="⚠" accentColor={COLORES.rojo} accentBg={COLORES.rojoPastel}
        items={sinAsignar} columnas={colsSin}
        headerCols={["Predio", "Productor", "Vereda", "Info"]}
        renderRow={rowSinAsignar}
        emptyMsg="No hay solicitudes sin asignar"
      />
      <TablaSeccion
        titulo="En proceso" icono="🕐" accentColor="#B7770D" accentBg={COLORES.amarilloPastel}
        items={pendientes} columnas={colsConTecnico}
        headerCols={["Predio", "Productor", "Técnico", "Vereda", "Info"]}
        renderRow={rowConTecnico}
        emptyMsg="No hay solicitudes en proceso"
      />
      <TablaSeccion
        titulo="Completadas" icono="✓" accentColor="#1B5E20" accentBg="#C8E6C9"
        items={completadas} columnas={colsConTecnico}
        headerCols={["Predio", "Productor", "Técnico", "Vereda", "Info"]}
        renderRow={rowConTecnico}
        emptyMsg="No hay solicitudes completadas"
      />

      {seleccionada && (
        <ModalSolicitud
          sol={seleccionada}
          tecnicos={tecnicos}
          onClose={() => setSeleccionada(null)}
          onAprobar={handleAprobar}
          onRechazar={handleRechazar}
          onAsignarTecnico={handleAsignarTecnico}
        />
      )}
    </div>
  );
}

// ── PÁGINA VERIFICACIÓN DE USUARIOS ──────────────────────────────────────────
function ModalUsuario({ usuario, onClose, onAceptar, onRechazar, esPendiente }) {
  if (!usuario) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div style={{ background: COLORES.blanco, borderRadius: 16, padding: 32, width: 440, maxWidth: "90vw" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ width: 50, height: 50, borderRadius: "50%", background: COLORES.verdePastel, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
              {usuario.tipo === "Productor" ? "🌾" : "⚙️"}
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: COLORES.verdeClaro, textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>
                {usuario.tipo || "Técnico"} {usuario.enviadoPorIca && <span style={{ background: COLORES.azulPastel, color: COLORES.azul, padding: "1px 8px", borderRadius: 10, fontSize: 10, marginLeft: 4 }}>ICA</span>}
              </div>
              <h2 style={{ margin: 0, fontSize: 19, fontWeight: 700, color: COLORES.texto }}>{usuario.nombre} {usuario.apellido}</h2>
            </div>
          </div>
          <button onClick={onClose} style={{ background: COLORES.grisPastel, border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 18, color: COLORES.gris }}>×</button>
        </div>
        <div style={{ display: "grid", gap: 12, marginBottom: 20 }}>
          <FilaInfo label="Nombre completo"          valor={`${usuario.nombre} ${usuario.apellido}`} />
          <FilaInfo label="Número de identificación" valor={usuario.identificacion} />
          <FilaInfo label="Correo electrónico"       valor={usuario.correo} />
          <FilaInfo label="Teléfono"                 valor={usuario.telefono} />
          <FilaInfo label="Fecha de registro"        valor={usuario.fechaRegistro} />
          {usuario.enviadoPorIca && usuario.tarjetaProfesional && (
            <div style={{ background: COLORES.azulPastel, borderRadius: 10, padding: "12px 14px" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: COLORES.azul, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4 }}>Tarjeta profesional ICA</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: COLORES.azul }}>{usuario.tarjetaProfesional}</span>
            </div>
          )}
          {!usuario.tarjetaProfesional && (
            <div style={{ background: COLORES.grisPastel, borderRadius: 10, padding: "10px 14px" }}>
              <span style={{ fontSize: 12, color: COLORES.textoMuted }}>Sin tarjeta profesional ICA registrada</span>
            </div>
          )}
        </div>
        {esPendiente ? (
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={onRechazar} style={{ flex: 1, background: COLORES.rojoPastel, color: COLORES.rojo, border: `1px solid ${COLORES.rojo}`, borderRadius: 8, padding: "10px 0", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>✕ Rechazar</button>
            <button onClick={onAceptar}  style={{ flex: 1, background: COLORES.verde, color: COLORES.blanco, border: "none", borderRadius: 8, padding: "10px 0", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>✓ Aceptar</button>
          </div>
        ) : (
          <button onClick={onClose} style={{ width: "100%", background: COLORES.grisPastel, color: COLORES.gris, border: "none", borderRadius: 8, padding: "10px 0", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cerrar</button>
        )}
      </div>
    </div>
  );
}

function PaginaUsuarios() {
  const [pendientes, setPendientes]                   = useState(tecnicosPendientes);
  const [registrados, setRegistrados]                 = useState(usuariosRegistrados);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [esPendiente, setEsPendiente]                 = useState(false);
  const [tabActiva, setTabActiva]                     = useState("pendientes");
  const [busqueda, setBusqueda]                       = useState("");

  const abrirModal  = (u, p) => { setUsuarioSeleccionado(u); setEsPendiente(p); };
  const cerrarModal = ()     => setUsuarioSeleccionado(null);

  const aceptar = () => {
    setRegistrados(prev => [...prev, { ...usuarioSeleccionado, tipo: "Técnico" }]);
    setPendientes(prev => prev.filter(p => p.id !== usuarioSeleccionado.id));
    cerrarModal();
  };

  const rechazar = () => {
    setPendientes(prev => prev.filter(p => p.id !== usuarioSeleccionado.id));
    cerrarModal();
  };

  const registradosFiltrados = registrados.filter(u =>
    `${u.nombre} ${u.apellido}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  const TabBtn = ({ id, label, count }) => (
    <button onClick={() => setTabActiva(id)} style={{ padding: "9px 20px", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", border: "none", background: tabActiva === id ? COLORES.verde : COLORES.blanco, color: tabActiva === id ? COLORES.blanco : COLORES.gris, display: "flex", alignItems: "center", gap: 8 }}>
      {label}
      {count > 0 && <span style={{ background: tabActiva === id ? "rgba(255,255,255,0.25)" : COLORES.verdePastel, color: tabActiva === id ? COLORES.blanco : COLORES.verde, fontSize: 11, fontWeight: 800, padding: "1px 7px", borderRadius: 10 }}>{count}</span>}
    </button>
  );

  return (
    <div style={{ padding: "28px 32px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
        <div style={{ width: 4, height: 24, background: COLORES.verde, borderRadius: 2 }} />
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: COLORES.texto }}>Verificación de usuarios</h1>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, background: COLORES.grisPastel, padding: 6, borderRadius: 10, width: "fit-content" }}>
        <TabBtn id="pendientes"  label="Por aceptar"               count={pendientes.length} />
        <TabBtn id="registrados" label="Registrados en el sistema"  count={0} />
      </div>

      {tabActiva === "pendientes" && (
        <div style={{ background: COLORES.blanco, borderRadius: 14, border: `1px solid ${COLORES.borde}`, overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", background: COLORES.amarilloPastel, borderBottom: `1px solid ${COLORES.borde}`, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 16 }}>⏳</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: COLORES.texto }}>Técnicos pendientes de aprobación</span>
            <span style={{ marginLeft: "auto", background: COLORES.amarillo, color: COLORES.blanco, fontSize: 12, fontWeight: 700, padding: "2px 10px", borderRadius: 10 }}>{pendientes.length}</span>
          </div>
          {pendientes.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: COLORES.textoMuted }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>✅</div>
              <p style={{ fontWeight: 600, margin: 0 }}>No hay técnicos pendientes de aprobación</p>
            </div>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr auto", gap: 8, padding: "10px 20px", background: "#A5D6A7", fontSize: 11, fontWeight: 700, color: "#1B5E20", textTransform: "uppercase", letterSpacing: 0.5 }}>
                <span>Nombre</span><span>Correo</span><span>Identificación</span><span>Fecha registro</span><span>Acción</span>
              </div>
              {pendientes.map((u, i) => (
                <div key={u.id} style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr auto", gap: 8, alignItems: "center", padding: "13px 20px", borderTop: i === 0 ? "none" : `1px solid ${COLORES.borde}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: "50%", background: COLORES.verdePastel, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>⚙️</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: COLORES.texto }}>{u.nombre} {u.apellido}</div>
                      {u.enviadoPorIca && <span style={{ fontSize: 10, background: COLORES.azulPastel, color: COLORES.azul, padding: "1px 6px", borderRadius: 8, fontWeight: 700 }}>ICA</span>}
                    </div>
                  </div>
                  <span style={{ fontSize: 12, color: COLORES.textoMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.correo}</span>
                  <span style={{ fontSize: 13, color: COLORES.texto, fontWeight: 500 }}>{u.identificacion}</span>
                  <span style={{ fontSize: 12, color: COLORES.textoMuted }}>{u.fechaRegistro}</span>
                  <button onClick={() => abrirModal(u, true)} style={{ background: COLORES.verde, color: COLORES.blanco, border: "none", borderRadius: 7, padding: "6px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>Ver info</button>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {tabActiva === "registrados" && (
        <div style={{ background: COLORES.blanco, borderRadius: 14, border: `1px solid ${COLORES.borde}`, overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: `1px solid ${COLORES.borde}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 16 }}>✅</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: COLORES.texto }}>Técnicos y productores registrados</span>
              <span style={{ background: COLORES.verdePastel, color: COLORES.verde, fontSize: 12, fontWeight: 700, padding: "2px 10px", borderRadius: 10 }}>{registradosFiltrados.length}</span>
            </div>
            <input placeholder="Buscar usuario..." value={busqueda} onChange={e => setBusqueda(e.target.value)}
              style={{ border: `1px solid ${COLORES.borde}`, borderRadius: 8, padding: "7px 14px", fontSize: 13, outline: "none", width: 200, color: COLORES.texto }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1.5fr 1fr 1fr auto", gap: 8, padding: "10px 20px", background: "#A5D6A7", fontSize: 11, fontWeight: 700, color: "#1B5E20", textTransform: "uppercase", letterSpacing: 0.5 }}>
            <span>Nombre</span><span>Tipo</span><span>Correo</span><span>Identificación</span><span>Fecha registro</span><span>Info</span>
          </div>
          {registradosFiltrados.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: COLORES.textoMuted }}><p style={{ fontWeight: 600, margin: 0 }}>No se encontraron usuarios</p></div>
          ) : registradosFiltrados.map((u, i) => (
            <div key={u.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1.5fr 1fr 1fr auto", gap: 8, alignItems: "center", padding: "13px 20px", borderTop: i === 0 ? "none" : `1px solid ${COLORES.borde}`, background: i % 2 === 0 ? COLORES.blanco : "#FAFAFA" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: u.tipo === "Técnico" ? COLORES.verdePastel : COLORES.azulPastel, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>
                  {u.tipo === "Técnico" ? "⚙️" : "🌾"}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: COLORES.texto }}>{u.nombre} {u.apellido}</div>
                  {u.enviadoPorIca && <span style={{ fontSize: 10, background: COLORES.azulPastel, color: COLORES.azul, padding: "1px 6px", borderRadius: 8, fontWeight: 700 }}>ICA</span>}
                </div>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 12, whiteSpace: "nowrap", background: u.tipo === "Técnico" ? COLORES.verdePastel : COLORES.azulPastel, color: u.tipo === "Técnico" ? COLORES.verde : COLORES.azul }}>{u.tipo}</span>
              <span style={{ fontSize: 12, color: COLORES.textoMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.correo}</span>
              <span style={{ fontSize: 13, color: COLORES.texto }}>{u.identificacion}</span>
              <span style={{ fontSize: 12, color: COLORES.textoMuted }}>{u.fechaRegistro}</span>
              <button onClick={() => abrirModal(u, false)} style={{ background: COLORES.grisPastel, color: COLORES.gris, border: "none", borderRadius: 7, padding: "6px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>Ver info</button>
            </div>
          ))}
        </div>
      )}

      <ModalUsuario usuario={usuarioSeleccionado} esPendiente={esPendiente} onClose={cerrarModal} onAceptar={aceptar} onRechazar={rechazar} />
    </div>
  );
}

// ── APP PRINCIPAL ─────────────────────────────────────────────────────────────
export default function DashboardAdmin() {
  const [paginaActual, setPaginaActual] = useState("dashboard");
  const [menuAbierto, setMenuAbierto]   = useState(true);
  const [busqueda, setBusqueda]         = useState("");
  const [filtro, setFiltro]             = useState("Predios");
  const navigate = useNavigate()

  const prediosFiltrados = predios
    .filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    .filter(p => {
      if (filtro === "Más afectados")   return p.afectacion >= 50;
      if (filtro === "Menos afectados") return p.afectacion <  50;
      return true;
    })
    .sort((a, b) => {
      if (filtro === "Más afectados")   return b.afectacion - a.afectacion;
      if (filtro === "Menos afectados") return a.afectacion - b.afectacion;
      return 0;
    });

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", minHeight: "100vh", background: COLORES.grisPastel, display: "flex", flexDirection: "column" }}>

      {/* HEADER */}
      <header style={{ background: COLORES.verde, color: COLORES.blanco, padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 2px 12px rgba(0,0,0,0.18)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button onClick={() => setMenuAbierto(!menuAbierto)} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 8, width: 36, height: 36, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, flexShrink: 0 }}>
            {[0, 1, 2].map(i => <span key={i} style={{ display: "block", width: 18, height: 2, background: COLORES.blanco, borderRadius: 2 }} />)}
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 30, height: 30, background: "rgba(255,255,255,0.2)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🌱</div>
            <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: -0.5 }}>Proyecto ICA</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 13, opacity: 0.85 }}>Juan Pérez</span>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>👤</div>
        </div>
      </header>

      <div style={{ display: "flex", flex: 1 }}>

   {/* SIDEBAR */}
<aside style={{ width: menuAbierto ? 230 : 62, minWidth: menuAbierto ? 230 : 62, background: COLORES.blanco, borderRight: `1px solid ${COLORES.borde}`, flexShrink: 0, transition: "width 0.25s ease, min-width 0.25s ease", overflow: "hidden", display: "flex", flexDirection: "column", height: "calc(100vh - 56px)", position: "sticky", top: 56 }}>
  <div style={{ flex: 1, overflow: "hidden" }}>
    <div style={{ padding: "14px 20px", background: "#A5D6A7", borderBottom: `1px solid ${COLORES.borde}`, whiteSpace: "nowrap", minWidth: 230 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#1B5E20", textTransform: "uppercase", letterSpacing: 1 }}>
        {menuAbierto ? "ADMINISTRADOR" : "ADM"}
      </div>
    </div>
    <nav style={{ padding: "12px 0" }}>
      {navItems.map(item => (
        <button key={item.id} onClick={() => setPaginaActual(item.id)} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: menuAbierto ? "13px 16px" : "13px 0", justifyContent: menuAbierto ? "flex-start" : "center", border: "none", background: paginaActual === item.id ? "#C8E6C9" : "transparent", color: paginaActual === item.id ? COLORES.verde : COLORES.gris, cursor: "pointer", fontWeight: paginaActual === item.id ? 700 : 500, fontSize: 12, textAlign: "left", whiteSpace: "nowrap", borderLeft: menuAbierto ? (paginaActual === item.id ? `3px solid ${COLORES.verde}` : "3px solid transparent") : "none", transition: "all 0.15s" }}>
          <span style={{ fontSize: 17, flexShrink: 0 }}>{item.icono}</span>
          {menuAbierto && <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{item.label}</span>}
        </button>
      ))}
    </nav>
  </div>
  <div style={{ borderTop: `1px solid ${COLORES.borde}`, flexShrink: 0 }}>
    <button
      onClick={() => {
    localStorage.removeItem('token')
     localStorage.removeItem('usuario')
    navigate('/', { replace: true })
}}
      style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "14px 20px", border: "none", background: "transparent", color: COLORES.rojo, cursor: "pointer", fontWeight: 600, fontSize: 13, whiteSpace: "nowrap" }}>
      <span style={{ fontSize: 17, flexShrink: 0 }}>🚪</span>
      {menuAbierto && <span>Cerrar sesión</span>}
    </button>
  </div>
</aside>

        {/* CONTENIDO */}
        <main style={{ flex: 1, overflow: "auto" }}>
          {paginaActual === "dashboard" && (
            <div style={{ padding: "28px 32px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
                <div style={{ width: 4, height: 24, background: COLORES.verde, borderRadius: 2 }} />
                <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: COLORES.texto }}>Dashboard</h1>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 32 }}>
                <Tarjeta icono="🗺️" titulo="Lugares de producción" valor={120} colorTexto={COLORES.azul}    colorFondo={COLORES.azulPastel}    />
                <Tarjeta icono="🌾" titulo="Cultivos exportados"   valor={85}  colorTexto={COLORES.verde}   colorFondo={COLORES.verdePastel}   />
                <Tarjeta icono="⚙️" titulo="Técnicos"             valor={25}  colorTexto={COLORES.naranja} colorFondo={COLORES.naranjaPastel} />
                <Tarjeta icono="🌿" titulo="Cultivos totales"      valor={200} colorTexto={COLORES.morado}  colorFondo={COLORES.moradoPastel}  />
                <Tarjeta icono="🐛" titulo="Cultivos afectados"    valor={40}  colorTexto={COLORES.rojo}    colorFondo={COLORES.rojoPastel}    />
              </div>
              <div style={{ background: COLORES.blanco, borderRadius: 14, border: `1px solid ${COLORES.borde}`, overflow: "hidden" }}>
                <div style={{ padding: "16px 20px", borderBottom: `1px solid ${COLORES.borde}`, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 4, height: 20, background: COLORES.verde, borderRadius: 2 }} />
                    <span style={{ fontSize: 14, fontWeight: 700, color: COLORES.texto }}>Predios</span>
                  </div>
                  <input type="text" placeholder="Buscar predio..." value={busqueda} onChange={e => setBusqueda(e.target.value)}
                    style={{ border: `1px solid ${COLORES.borde}`, borderRadius: 8, padding: "7px 14px", fontSize: 13, outline: "none", width: 200, color: COLORES.texto }} />
                </div>
                <div style={{ padding: "12px 20px", borderBottom: `1px solid ${COLORES.borde}`, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {["Predios", "Lugares de producción", "Más afectados", "Menos afectados"].map(f => (
                    <button key={f} onClick={() => setFiltro(f)} style={{ padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", border: `1px solid ${filtro === f ? COLORES.verde : COLORES.borde}`, background: filtro === f ? COLORES.verdePastel : COLORES.blanco, color: filtro === f ? COLORES.verde : COLORES.textoMuted }}>{f}</button>
                  ))}
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "#A5D6A7" }}>
                        {["Nombre", "Ubicación", "Afectación"].map(h => (
                          <th key={h} style={{ padding: "11px 20px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#1B5E20", textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {prediosFiltrados.map((p, i) => (
                        <tr key={i} style={{ borderTop: `1px solid ${COLORES.borde}`, background: i % 2 === 0 ? COLORES.blanco : "#FAFAFA" }}>
                          <td style={{ padding: "13px 20px", fontSize: 13, fontWeight: 600, color: COLORES.texto }}>{p.nombre}</td>
                          <td style={{ padding: "13px 20px" }}>
                            <span style={{ background: COLORES.grisPastel, color: COLORES.gris, padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: 500 }}>{p.ubicacion}</span>
                          </td>
                          <td style={{ padding: "13px 20px", minWidth: 200 }}><BarraAfectacion valor={p.afectacion} /></td>
                        </tr>
                      ))}
                      {prediosFiltrados.length === 0 && (
                        <tr><td colSpan={3} style={{ padding: "24px 20px", textAlign: "center", color: COLORES.textoMuted, fontSize: 13 }}>No se encontraron predios</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div style={{ padding: "10px 20px", borderTop: `1px solid ${COLORES.borde}`, fontSize: 12, color: COLORES.textoMuted, textAlign: "right" }}>
                  {prediosFiltrados.length} predios encontrados
                </div>
              </div>
            </div>
          )}

          {paginaActual === "solicitudes" && <PaginaSolicitudes />}
          {paginaActual === "usuarios"    && <PaginaUsuarios />}
        </main>
      </div>
    </div>
  );
}