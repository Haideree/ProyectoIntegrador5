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





const navItems = [
  { id: "dashboard",   label: "Inicio",                icono: "📊" },
  { id: "solicitudes", label: "Solicitudes de inspección", icono: "📄" },
{ id: "usuarios", label: "Registro de usuarios", icono: "👤" },
];

// ── COMPONENTES REUTILIZABLES ─────────────────────────────────────────────────
function BarraAfectacion({ valor }) {
  const color = valor >= 70 ? COLORES.rojo : valor >= 50 ? COLORES.naranja : valor >= 30 ? COLORES.amarillo : COLORES.verdeClaro;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ flex: 1, height: 8, background: COLORES.grisPastel, borderRadius: 4, overflow: "hidden" }}>
        <div style={{ width: `${valor}%`, height: "100%", background: color, borderRadius: 4 }} />
      </div>
      <span style={{ fontSize: 14, fontWeight: 700, minWidth: 36, textAlign: "right", color: valor >= 70 ? COLORES.rojo : valor >= 50 ? COLORES.naranja : COLORES.textoMuted }}>{valor}%</span>
    </div>
  );
}

function Tarjeta({ icono, titulo, valor, colorTexto, colorFondo }) {
  return (
    <div style={{ background: COLORES.blanco, borderRadius: 14, border: `1px solid ${COLORES.borde}`, padding: "20px 22px", display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ width: 42, height: 42, borderRadius: 10, background: colorFondo, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{icono}</div>
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, color: COLORES.textoMuted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>{titulo}</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: colorTexto, lineHeight: 1 }}>{valor}</div>
      </div>
    </div>
  );
}

function FilaInfo({ label, valor }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <span style={{ fontSize: 15, color: COLORES.textoMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</span>
      <span style={{ fontSize: 14, color: COLORES.texto, fontWeight: 500 }}>{valor}</span>
    </div>
  );
}

function SeccionTitulo({ children }) {
  return (
    <div style={{ fontSize: 15, fontWeight: 700, color: COLORES.verde, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ width: 3, height: 14, background: COLORES.verde, borderRadius: 2 }} />
      {children}
    </div>
  );
}

// ── MODAL EDITAR USUARIO ──────────────────────────────────────────────────────
function ModalEditarUsuario({ usuario, onClose, onGuardar }) {
  const [form, setForm] = useState({
    nombre: usuario.nombre || "",
    correo: usuario.correo || "",
    telefono: usuario.telefono || "",
    numeroDocumento: usuario.numeroDocumento || "",
    tarjetaProfesional: usuario.tarjetaProfesional || "",
  });
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);

  const inputStyle = { width: "100%", border: `1px solid ${COLORES.borde}`, borderRadius: 8, padding: "8px 12px", fontSize: 14, color: COLORES.texto, boxSizing: "border-box" };
  const labelStyle = { fontSize: 13, fontWeight: 700, color: COLORES.textoMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4 };

  const validar = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "Requerido";
    else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(form.nombre.trim())) e.nombre = "Solo letras y espacios";
    if (!form.correo.trim()) e.correo = "Requerido";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) e.correo = "Correo inválido";
    if (!form.telefono.trim()) e.telefono = "Requerido";
    else if (!/^\d{10}$/.test(form.telefono.trim())) e.telefono = "Exactamente 10 dígitos";
    if (!form.numeroDocumento.trim()) e.numeroDocumento = "Requerido";
    return e;
  };

  const handleGuardar = async () => {
    const e = validar();
    setErrores(e);
    if (Object.keys(e).length > 0) return;
    setEnviando(true);
    try {
      const res = await fetch(`https://proyectointegrador5.onrender.com/api/usuarios/${usuario.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Error al actualizar');
      setExito(true);
      setTimeout(() => { onGuardar(); onClose(); }, 1200);
    } catch (err) {
      setErrores({ general: err.message });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onClose}>
      <div style={{ background: COLORES.blanco, borderRadius: 16, padding: 28, width: 460, maxWidth: "95vw", boxShadow: "0 8px 40px rgba(0,0,0,0.2)" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: COLORES.naranja, textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>Editar usuario</div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: COLORES.texto }}>{usuario.nombre}</h2>
          </div>
          <button onClick={onClose} style={{ background: COLORES.grisPastel, border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 18, color: COLORES.gris }}>×</button>
        </div>

        {exito ? (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: COLORES.verde }}>Guardado exitosamente</div>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 14 }}>
            {[
              { key: "nombre",            label: "Nombre completo"      },
              { key: "numeroDocumento",   label: "Número de documento"  },
              { key: "correo",            label: "Correo electrónico"   },
              { key: "telefono",          label: "Teléfono"             },
            ].map(({ key, label }) => (
              <div key={key}>
                <label style={labelStyle}>{label}</label>
                <input value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  style={{ ...inputStyle, borderColor: errores[key] ? COLORES.rojo : COLORES.borde }} />
                {errores[key] && <span style={{ fontSize: 12, color: COLORES.rojo }}>{errores[key]}</span>}
              </div>
            ))}

            {usuario.rol === 'tecnico' && (
              <div>
                <label style={labelStyle}>Tarjeta profesional</label>
                <input value={form.tarjetaProfesional} onChange={e => setForm(f => ({ ...f, tarjetaProfesional: e.target.value }))}
                  placeholder="Ej. ICA-2024-0341"
                  style={{ ...inputStyle, borderColor: errores.tarjetaProfesional ? COLORES.rojo : COLORES.borde }} />
              </div>
            )}

            {errores.general && (
              <div style={{ background: COLORES.rojoPastel, color: COLORES.rojo, borderRadius: 8, padding: "10px 14px", fontSize: 14, fontWeight: 600 }}>
                ⚠️ {errores.general}
              </div>
            )}

            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <button onClick={onClose} style={{ flex: 1, background: COLORES.grisPastel, color: COLORES.gris, border: "none", borderRadius: 8, padding: "10px 0", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Cancelar</button>
              <button onClick={handleGuardar} style={{ flex: 1, background: enviando ? COLORES.gris : COLORES.naranja, color: COLORES.blanco, border: "none", borderRadius: 8, padding: "10px 0", fontSize: 14, fontWeight: 700, cursor: "pointer", opacity: enviando ? 0.7 : 1 }}>
                {enviando ? "Guardando..." : "✓ Guardar cambios"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── MODAL CONFIRMAR ELIMINAR ──────────────────────────────────────────────────
function ModalConfirmarEliminar({ usuario, onClose, onConfirmar }) {
  const [eliminando, setEliminando] = useState(false);

  const handleEliminar = async () => {
    setEliminando(true);
    try {
      const res = await fetch(`https://proyectointegrador5.onrender.com/api/usuarios/${usuario.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar');
      onConfirmar();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setEliminando(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onClose}>
      <div style={{ background: COLORES.blanco, borderRadius: 16, padding: 28, width: 400, maxWidth: "95vw", textAlign: "center" }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🗑️</div>
        <h2 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: COLORES.texto }}>¿Eliminar usuario?</h2>
        <p style={{ margin: "0 0 24px", color: COLORES.textoMuted, fontSize: 15 }}>
          Se eliminará permanentemente a <strong>{usuario.nombre}</strong>. Esta acción no se puede deshacer.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, background: COLORES.grisPastel, color: COLORES.gris, border: "none", borderRadius: 8, padding: "10px 0", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Cancelar</button>
          <button onClick={handleEliminar} style={{ flex: 1, background: COLORES.rojo, color: COLORES.blanco, border: "none", borderRadius: 8, padding: "10px 0", fontSize: 14, fontWeight: 700, cursor: "pointer", opacity: eliminando ? 0.7 : 1 }}>
            {eliminando ? "Eliminando..." : "✕ Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── MODAL SOLICITUD ───────────────────────────────────────────────────────────
function ModalSolicitud({ sol, tecnicos, onClose, onRechazar, onAsignarTecnico }) {
  const [tecnicoSel, setTecnicoSel] = useState("");

  if (!sol) return null;

  const esPendiente = sol.estado === "Sin asignar" || sol.estado === "pendiente";

  const handleAsignar = () => {
    if (tecnicoSel) {
      const tecnico = tecnicos.find(t => t.id === parseInt(tecnicoSel));
      onAsignarTecnico(sol.id, tecnicoSel, tecnico?.nombre || '');
      setTecnicoSel("");
    }
  };

  const ubicacionQuery = encodeURIComponent(
    `${sol.ubicacion?.departamento || ''} ${sol.ubicacion?.municipio || ''} ${sol.vereda || ''} Colombia`
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onClose}>
      <div style={{ background: COLORES.blanco, borderRadius: 16, width: 520, maxWidth: "100%", maxHeight: "90vh", overflowY: "auto", padding: 28 }} onClick={e => e.stopPropagation()}>

        {/* Cabecera */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: COLORES.verdeClaro, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
              Solicitud #{sol.id} · {new Date(sol.fechaSolicitud).toLocaleDateString('es-CO')}
            </div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: COLORES.texto }}>{sol.predio}</h2>
            <div style={{ marginTop: 6 }}>
              {esPendiente && <span style={{ background: COLORES.rojoPastel, color: COLORES.rojo, fontSize: 13, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>⚠ Sin asignar</span>}
              {sol.estado === "asignada" && sol.resultado !== "Completada" && <span style={{ background: COLORES.amarilloPastel, color: "#B7770D", fontSize: 13, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>🕐 En proceso</span>}
              {sol.resultado === "Completada" && <span style={{ background: "#C8E6C9", color: "#1B5E20", fontSize: 13, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>✓ Completada</span>}
            </div>
          </div>
          <button onClick={onClose} style={{ background: COLORES.grisPastel, border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 18, color: COLORES.gris }}>×</button>
        </div>

        {/* Productor */}
        <SeccionTitulo>Productor responsable</SeccionTitulo>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }}>
          <FilaInfo label="Nombre"   valor={sol.productor?.nombre || ''} />
          <FilaInfo label="Teléfono" valor={sol.productor?.telefono || ''} />
          <FilaInfo label="Correo"   valor={sol.productor?.correo || ''} />
        </div>
        <hr style={{ border: "none", borderTop: `1px solid ${COLORES.borde}`, margin: "18px 0" }} />

        {/* Ubicación + Mapa */}
        <SeccionTitulo>Ubicación del predio</SeccionTitulo>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
          <FilaInfo label="Vereda"       valor={sol.vereda || 'Sin información'} />
          <FilaInfo label="Municipio"    valor={sol.municipio || 'Sin información'} />
          <FilaInfo label="Departamento" valor={sol.departamento || 'Sin información'} />
        </div>
        <div style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${COLORES.borde}`, marginBottom: 8 }}>
          <iframe
            title="mapa-ubicacion"
            width="100%"
            height="180"
            style={{ border: 0, display: "block" }}
            loading="lazy"
            allowFullScreen
            src={`https://maps.google.com/maps?q=${ubicacionQuery}&output=embed`}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: COLORES.textoMuted, marginBottom: 18 }}>
          <span>📍</span>
          <span>{sol.departamento} · {sol.municipio} · {sol.vereda}</span>
        </div>
        <hr style={{ border: "none", borderTop: `1px solid ${COLORES.borde}`, margin: "18px 0" }} />

        {/* Cultivos */}
        <SeccionTitulo>Cultivos registrados</SeccionTitulo>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
          {(sol.cultivos || 'Sin cultivos').split(',').map((c, i) => {
            const coloresCultivo = [["#F3E5F5","#6A1B9A"],["#E3F2FD","#1565C0"],["#FFF3E0","#E65100"]];
            const [bg, col] = coloresCultivo[i % 3];
            return (
              <div key={i} style={{ background: bg, borderRadius: 10, padding: "13px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 18 }}>🌱</span>
                <span style={{ fontWeight: 700, fontSize: 14, color: col }}>{c.trim()}</span>
              </div>
            );
          })}
        </div>
        <hr style={{ border: "none", borderTop: `1px solid ${COLORES.borde}`, margin: "18px 0" }} />

        {/* Técnico asignado */}
        <SeccionTitulo>Técnico asignado</SeccionTitulo>
        <div style={{ background: sol.tecnicoAsignado ? "#C8E6C9" : COLORES.rojoPastel, borderRadius: 8, padding: "11px 14px", fontSize: 14, fontWeight: 600, color: sol.tecnicoAsignado ? "#1B5E20" : COLORES.rojo, marginBottom: esPendiente ? 16 : 24 }}>
          {sol.tecnicoAsignado ? `✓ ${sol.tecnicoAsignado}` : "⚠ Sin técnico asignado"}
        </div>

        {/* Selector técnico + Rechazar */}
        {esPendiente && (
          <div style={{ background: COLORES.azulPastel, borderRadius: 10, padding: "14px 16px", marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: COLORES.azul, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Asignar técnico</div>
            <select value={tecnicoSel} onChange={e => setTecnicoSel(e.target.value)}
              style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: `1px solid ${COLORES.borde}`, fontSize: 14, color: COLORES.texto, background: COLORES.blanco, marginBottom: 10 }}>
              <option value="">Seleccionar técnico...</option>
              {(tecnicos || []).map(t => (
                <option key={t.id} value={t.id}>{t.nombre}</option>
              ))}
            </select>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => onRechazar(sol.id)}
                style={{ flex: 1, background: COLORES.rojoPastel, color: COLORES.rojo, border: `1px solid ${COLORES.rojo}`, borderRadius: 8, padding: "10px 0", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                ✕ Rechazar
              </button>
              <button disabled={!tecnicoSel} onClick={handleAsignar}
                style={{ flex: 2, background: tecnicoSel ? COLORES.azul : COLORES.grisPastel, color: tecnicoSel ? COLORES.blanco : COLORES.gris, border: "none", borderRadius: 8, padding: "10px 0", fontSize: 14, fontWeight: 700, cursor: tecnicoSel ? "pointer" : "not-allowed" }}>
                ✓ Confirmar asignación
              </button>
            </div>
          </div>
        )}

        {!esPendiente && (
          <button onClick={onClose} style={{ width: "100%", background: COLORES.grisPastel, color: COLORES.gris, border: "none", borderRadius: 8, padding: "10px 0", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            Cerrar
          </button>
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
        <span style={{ marginLeft: 8, background: accentColor, color: "#fff", fontSize: 15, fontWeight: 800, padding: "1px 8px", borderRadius: 10 }}>{items.length}</span>
        <span style={{ marginLeft: "auto", fontSize: 16, color: accentColor, fontWeight: 700 }}>{abierto ? "▲" : "▼"}</span>
      </button>
      {abierto && (
        <div style={{ background: COLORES.blanco, borderRadius: "0 0 12px 12px", border: `1px solid ${accentColor}33`, borderTop: "none", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: columnas, gap: 8, padding: "10px 20px", background: accentBg, fontSize: 15, fontWeight: 700, color: accentColor, textTransform: "uppercase", letterSpacing: 0.5 }}>
            {headerCols.map(h => <span key={h}>{h}</span>)}
          </div>
          {items.length === 0
            ? <div style={{ padding: "32px 20px", textAlign: "center", color: COLORES.textoMuted, fontSize: 15 }}>{emptyMsg}</div>
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
  const [esMobil, setEsMobil] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setEsMobil(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetch('https://proyectointegrador5.onrender.com/api/inspecciones/solicitudes/completas')
      .then(res => res.json())
      .then(data => setSolicitudes(data))
      .catch(err => console.error(err));

    fetch('https://proyectointegrador5.onrender.com/api/usuarios')
      .then(res => res.json())
      .then(data => setTecnicos(data.filter(u => u.rol === 'tecnico')))
      .catch(err => console.error(err));
  }, []);

  const sinAsignar = solicitudes.filter(s => s.estado === "pendiente" && !s.tecnico_id);
  const pendientes = solicitudes.filter(s => s.estado === "asignada" && s.resultado !== "Completada");
  const completadas = solicitudes.filter(s => s.resultado === "Completada");

  const handleRechazar = async (id) => {
    await fetch(`https://proyectointegrador5.onrender.com/api/inspecciones/solicitudes/${id}/estado`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: 'rechazada' })
    });
    setSolicitudes(prev => prev.filter(s => s.id !== id));
    setSeleccionada(null);
  };

  const handleAsignarTecnico = async (solicitudId, tecnicoId, tecnicoNombre) => {
    try {
      const res = await fetch('https://proyectointegrador5.onrender.com/api/inspecciones/inspecciones', {
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
      await fetch(`https://proyectointegrador5.onrender.com/api/inspecciones/solicitudes/${solicitudId}/estado`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: 'asignada' })
      });
      setSolicitudes(prev => prev.map(s => s.id === solicitudId
        ? { ...s, estado: "asignada", tecnico_id: tecnicoId, tecnicoAsignado: tecnicoNombre }
        : s));
      setSeleccionada(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Tarjeta móvil para una solicitud
  const TarjetaSolicitudMobil = ({ s }) => {
    const esPendiente = s.estado === "pendiente" && !s.tecnico_id;
    const enProceso   = s.estado === "asignada" && s.resultado !== "Completada";
    const completada  = s.resultado === "Completada";
    return (
      <div style={{ background: COLORES.blanco, border: `1px solid ${COLORES.borde}`, borderRadius: 12, padding: "13px 14px", marginBottom: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: COLORES.texto }}>{s.predio}</div>
            <div style={{ fontSize: 12, color: COLORES.textoMuted, marginTop: 2 }}>#{s.id} · {new Date(s.fechaSolicitud).toLocaleDateString('es-CO')}</div>
          </div>
          {esPendiente && <span style={{ background: COLORES.rojoPastel, color: COLORES.rojo, fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 20 }}>Sin asignar</span>}
          {enProceso   && <span style={{ background: COLORES.amarilloPastel, color: "#B7770D", fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 20 }}>En proceso</span>}
          {completada  && <span style={{ background: "#C8E6C9", color: "#1B5E20", fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 20 }}>Completada</span>}
        </div>
        <div style={{ display: "flex", gap: 16, marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 11, color: COLORES.textoMuted, fontWeight: 600, textTransform: "uppercase", marginBottom: 2 }}>Productor</div>
            <div style={{ fontSize: 13, color: COLORES.texto, fontWeight: 500 }}>{s.productor?.nombre || '—'}</div>
          </div>
          {(enProceso || completada) && (
            <div>
              <div style={{ fontSize: 11, color: COLORES.textoMuted, fontWeight: 600, textTransform: "uppercase", marginBottom: 2 }}>Técnico</div>
              <div style={{ fontSize: 13, color: COLORES.texto, fontWeight: 500 }}>{s.tecnicoAsignado || '—'}</div>
            </div>
          )}
          <div>
            <div style={{ fontSize: 11, color: COLORES.textoMuted, fontWeight: 600, textTransform: "uppercase", marginBottom: 2 }}>Vereda</div>
            <div style={{ fontSize: 13, color: COLORES.texto, fontWeight: 500 }}>{s.vereda || '—'}</div>
          </div>
        </div>
        <button onClick={() => setSeleccionada(s)}
          style={{ width: "100%", background: esPendiente ? COLORES.verde : COLORES.grisPastel, color: esPendiente ? COLORES.blanco : COLORES.gris, border: "none", borderRadius: 8, padding: "9px 0", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          Ver información
        </button>
      </div>
    );
  };

  // Sección colapsable adaptada
  const SeccionMobil = ({ titulo, icono, accentColor, accentBg, items, emptyMsg }) => {
    const [abierto, setAbierto] = useState(true);
    return (
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setAbierto(!abierto)}
          style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, background: accentBg, border: `1px solid ${accentColor}33`, borderRadius: abierto ? "12px 12px 0 0" : 12, padding: "12px 16px", cursor: "pointer" }}>
          <span style={{ fontSize: 15 }}>{icono}</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: accentColor }}>{titulo}</span>
          <span style={{ marginLeft: 6, background: accentColor, color: "#fff", fontSize: 13, fontWeight: 800, padding: "1px 8px", borderRadius: 10 }}>{items.length}</span>
          <span style={{ marginLeft: "auto", fontSize: 14, color: accentColor, fontWeight: 700 }}>{abierto ? "▲" : "▼"}</span>
        </button>
        {abierto && (
          <div style={{ background: COLORES.grisPastel, borderRadius: "0 0 12px 12px", border: `1px solid ${accentColor}33`, borderTop: "none", padding: "10px 10px 2px" }}>
            {items.length === 0
              ? <div style={{ padding: "20px 0", textAlign: "center", color: COLORES.textoMuted, fontSize: 14 }}>{emptyMsg}</div>
              : items.map(s => <TarjetaSolicitudMobil key={s.id} s={s} />)
            }
          </div>
        )}
      </div>
    );
  };

  const colsSin      = "2fr 1.6fr 1fr auto";
  const colsTecnico  = "2fr 1.6fr 1.4fr 1fr auto";

  const rowSinAsignar = (s, i) => (
    <div key={s.id} style={{ display: "grid", gridTemplateColumns: colsSin, gap: 8, alignItems: "center", padding: "13px 20px", borderTop: `1px solid ${COLORES.borde}`, background: i % 2 === 0 ? COLORES.blanco : "#FAFAFA" }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: COLORES.texto }}>{s.predio}</div>
        <div style={{ fontSize: 13, color: COLORES.textoMuted, marginTop: 2 }}>#{s.id} · {new Date(s.fechaSolicitud).toLocaleDateString('es-CO')}</div>
      </div>
      <div style={{ fontSize: 14, color: COLORES.texto }}>{s.productor?.nombre}</div>
      <div style={{ fontSize: 14, color: COLORES.textoMuted }}>{s.vereda}</div>
      <button onClick={() => setSeleccionada(s)} style={{ background: COLORES.verde, color: COLORES.blanco, border: "none", borderRadius: 7, padding: "6px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Ver info</button>
    </div>
  );

  const rowConTecnico = (s, i) => (
    <div key={s.id} style={{ display: "grid", gridTemplateColumns: colsTecnico, gap: 8, alignItems: "center", padding: "13px 20px", borderTop: `1px solid ${COLORES.borde}`, background: i % 2 === 0 ? COLORES.blanco : "#FAFAFA" }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: COLORES.texto }}>{s.predio}</div>
        <div style={{ fontSize: 13, color: COLORES.textoMuted, marginTop: 2 }}>#{s.id} · {new Date(s.fechaSolicitud).toLocaleDateString('es-CO')}</div>
      </div>
      <div style={{ fontSize: 14, color: COLORES.texto }}>{s.productor?.nombre}</div>
      <div style={{ fontSize: 14, color: COLORES.textoMuted }}>{s.tecnicoAsignado || "Sin asignar"}</div>
      <div style={{ fontSize: 14, color: COLORES.textoMuted }}>{s.vereda}</div>
      <button onClick={() => setSeleccionada(s)} style={{ background: COLORES.grisPastel, color: COLORES.gris, border: "none", borderRadius: 7, padding: "6px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Ver info</button>
    </div>
  );

  return (
    <div style={{ padding: esMobil ? "16px" : "28px 32px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
        <div style={{ width: 4, height: 24, background: COLORES.verde, borderRadius: 2 }} />
        <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: COLORES.texto }}>Solicitudes de inspección</h1>
        <span style={{ marginLeft: 6, background: COLORES.grisPastel, color: COLORES.gris, fontSize: 13, fontWeight: 700, padding: "3px 10px", borderRadius: 10 }}>
          {solicitudes.length}
        </span>
      </div>

      {esMobil ? (
        <>
          <SeccionMobil titulo="Sin asignar" icono="⚠" accentColor={COLORES.rojo} accentBg={COLORES.rojoPastel}    items={sinAsignar} emptyMsg="No hay solicitudes sin asignar" />
          <SeccionMobil titulo="En proceso"  icono="🕐" accentColor="#B7770D"      accentBg={COLORES.amarilloPastel} items={pendientes} emptyMsg="No hay solicitudes en proceso" />
          <SeccionMobil titulo="Completadas" icono="✓"  accentColor="#1B5E20"      accentBg="#C8E6C9"                items={completadas} emptyMsg="No hay solicitudes completadas" />
        </>
      ) : (
        <>
          <TablaSeccion titulo="Sin asignar" icono="⚠" accentColor={COLORES.rojo} accentBg={COLORES.rojoPastel}
            items={sinAsignar} columnas={colsSin} headerCols={["Predio","Productor","Vereda","Info"]}
            renderRow={rowSinAsignar} emptyMsg="No hay solicitudes sin asignar" />
          <TablaSeccion titulo="En proceso" icono="🕐" accentColor="#B7770D" accentBg={COLORES.amarilloPastel}
            items={pendientes} columnas={colsTecnico} headerCols={["Predio","Productor","Técnico","Vereda","Info"]}
            renderRow={rowConTecnico} emptyMsg="No hay solicitudes en proceso" />
          <TablaSeccion titulo="Completadas" icono="✓" accentColor="#1B5E20" accentBg="#C8E6C9"
            items={completadas} columnas={colsTecnico} headerCols={["Predio","Productor","Técnico","Vereda","Info"]}
            renderRow={rowConTecnico} emptyMsg="No hay solicitudes completadas" />
        </>
      )}

      {seleccionada && (
        <ModalSolicitud
          sol={seleccionada}
          tecnicos={tecnicos}
          onClose={() => setSeleccionada(null)}
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
              <div style={{ fontSize: 15, fontWeight: 700, color: COLORES.verdeClaro, textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>
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
              <span style={{ fontSize: 15, fontWeight: 700, color: COLORES.azul, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4 }}>Tarjeta profesional ICA</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: COLORES.azul }}>{usuario.tarjetaProfesional}</span>
            </div>
          )}
          {!usuario.tarjetaProfesional && (
            <div style={{ background: COLORES.grisPastel, borderRadius: 10, padding: "10px 14px" }}>
              <span style={{ fontSize: 14, color: COLORES.textoMuted }}>Sin tarjeta profesional ICA registrada</span>
            </div>
          )}
        </div>
        {esPendiente ? (
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={onRechazar} style={{ flex: 1, background: COLORES.rojoPastel, color: COLORES.rojo, border: `1px solid ${COLORES.rojo}`, borderRadius: 8, padding: "10px 0", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>✕ Rechazar</button>
            <button onClick={onAceptar}  style={{ flex: 1, background: COLORES.verde, color: COLORES.blanco, border: "none", borderRadius: 8, padding: "10px 0", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>✓ Aceptar</button>
          </div>
        ) : (
          <button onClick={onClose} style={{ width: "100%", background: COLORES.grisPastel, color: COLORES.gris, border: "none", borderRadius: 8, padding: "10px 0", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>Cerrar</button>
        )}
      </div>
    </div>
  );
}

function PaginaUsuarios() {
  const [tab, setTab] = useState("tecnicos");
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalCrear, setModalCrear] = useState(false);
  const [rolModal, setRolModal] = useState(1);
  const [usuarioEditar, setUsuarioEditar] = useState(null);
  const [usuarioEliminar, setUsuarioEliminar] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [esMobil, setEsMobil] = useState(window.innerWidth < 768);
  const [form, setForm] = useState({
    numeroDocumento: "", nombre: "", correo: "",
    contrasena: "", telefono: "", confirmContrasena: "",
    tipoTecnico: "", tarjetaProfesional: ""
  });
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState("");

  useEffect(() => {
    const handleResize = () => setEsMobil(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const cargarUsuarios = () => {
    setCargando(true);
    fetch('https://proyectointegrador5.onrender.com/api/usuarios')
      .then(r => r.json())
      .then(data => setUsuarios(Array.isArray(data) ? data : []))
      .catch(err => console.error(err))
      .finally(() => setCargando(false));
  };

  useEffect(() => { cargarUsuarios(); }, []);

  const tecnicos    = usuarios.filter(u => u.rol === 'tecnico');
  const admins      = usuarios.filter(u => u.rol === 'admin');
  const productores = usuarios.filter(u => u.rol === 'productor');

  const abrirModalCrear = (rol_id) => {
    setRolModal(rol_id);
    setForm({ numeroDocumento: "", nombre: "", correo: "", contrasena: "", telefono: "", confirmContrasena: "", tipoTecnico: "", tarjetaProfesional: "" });
    setErrores({});
    setExito("");
    setModalCrear(true);
  };

  const validar = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "Requerido";
    else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(form.nombre.trim())) e.nombre = "Solo letras y espacios";
    if (!form.numeroDocumento.trim()) e.numeroDocumento = "Requerido";
    else if (!/^[A-Za-z0-9]{6,20}$/.test(form.numeroDocumento.trim())) e.numeroDocumento = "Entre 6 y 20 caracteres";
    if (!form.correo.trim()) e.correo = "Requerido";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) e.correo = "Correo inválido";
    if (!form.telefono.trim()) e.telefono = "Requerido";
    else if (!/^\d{10}$/.test(form.telefono.trim())) e.telefono = "Exactamente 10 dígitos";
    if (!form.contrasena) e.contrasena = "Requerido";
    else {
      const errs = [];
      if (form.contrasena.length < 8)             errs.push("mínimo 8 caracteres");
      if (!/[A-Z]/.test(form.contrasena))         errs.push("una mayúscula");
      if (!/[a-z]/.test(form.contrasena))         errs.push("una minúscula");
      if (!/[0-9]/.test(form.contrasena))         errs.push("un número");
      if (!/[^A-Za-z0-9]/.test(form.contrasena)) errs.push("un símbolo");
      if (errs.length > 0) e.contrasena = "Debe tener: " + errs.join(" · ");
    }
    if (!form.confirmContrasena) e.confirmContrasena = "Requerido";
    else if (form.contrasena !== form.confirmContrasena) e.confirmContrasena = "Las contraseñas no coinciden";
    if (rolModal === 3 && !form.tipoTecnico) e.tipoTecnico = "Selecciona el tipo";
    if (rolModal === 3 && form.tipoTecnico === "oficial" && !form.tarjetaProfesional.trim()) e.tarjetaProfesional = "Requerida";
    return e;
  };

  const handleEnviar = async () => {
    const e = validar();
    setErrores(e);
    if (Object.keys(e).length > 0) return;
    setEnviando(true);
    const tarjeta = rolModal === 3
      ? (form.tipoTecnico === "particular" ? `ICA-PART-${Date.now().toString().slice(-6)}` : form.tarjetaProfesional)
      : "";
    try {
      const res = await fetch('https://proyectointegrador5.onrender.com/api/usuarios/crear-con-rol', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, rol_id: rolModal, tarjetaProfesional: tarjeta, tipoTecnico: rolModal === 3 ? form.tipoTecnico : undefined })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al crear');
      setExito(`${rolModal === 3 ? 'Técnico' : 'Administrador'} creado exitosamente`);
      cargarUsuarios();
      setTimeout(() => setModalCrear(false), 1500);
    } catch (err) {
      setErrores({ general: err.message });
    } finally {
      setEnviando(false);
    }
  };

  const inputStyle = { width: "100%", border: `1px solid ${COLORES.borde}`, borderRadius: 8, padding: "8px 12px", fontSize: 14, color: COLORES.texto, boxSizing: "border-box" };
  const labelStyle = { fontSize: 13, fontWeight: 700, color: COLORES.textoMuted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4 };

  const TabBtn = ({ id, label, count }) => (
    <button onClick={() => { setTab(id); setBusqueda(""); }}
      style={{ padding: esMobil ? "8px 12px" : "9px 20px", borderRadius: 8, fontSize: esMobil ? 13 : 15,
        fontWeight: 700, cursor: "pointer", border: "none",
        background: tab === id ? COLORES.verde : COLORES.blanco,
        color: tab === id ? COLORES.blanco : COLORES.gris,
        display: "flex", alignItems: "center", gap: 6 }}>
      {esMobil ? label.split(" ")[0] : label}
      <span style={{ background: tab === id ? "rgba(255,255,255,0.25)" : COLORES.verdePastel, color: tab === id ? COLORES.blanco : COLORES.verde, fontSize: 12, fontWeight: 800, padding: "1px 6px", borderRadius: 10 }}>{count}</span>
    </button>
  );

  // Tarjeta móvil de usuario
  const TarjetaUsuarioMobil = ({ u, tipo, conTarjeta, soloEliminar }) => (
    <div style={{ background: COLORES.blanco, border: `1px solid ${COLORES.borde}`, borderRadius: 12, padding: "13px 14px", marginBottom: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <div style={{ width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
          background: tipo === 'Técnico' ? COLORES.verdePastel : tipo === 'Administrador' ? COLORES.azulPastel : COLORES.naranjaPastel,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
          {tipo === 'Técnico' ? "⚙️" : tipo === 'Administrador' ? "🛡️" : "🌾"}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: COLORES.texto, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{u.nombre}</div>
          <div style={{ fontSize: 12, color: COLORES.textoMuted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{u.correo}</div>
        </div>
        {conTarjeta && u.tarjetaProfesional && (
          <span style={{ background: COLORES.azulPastel, color: COLORES.azul, padding: "2px 8px", borderRadius: 10, fontSize: 11, fontWeight: 600, flexShrink: 0 }}>
            {u.tarjetaProfesional}
          </span>
        )}
      </div>
      <div style={{ display: "flex", gap: 16, marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 11, color: COLORES.textoMuted, fontWeight: 600, textTransform: "uppercase", marginBottom: 2 }}>Teléfono</div>
          <div style={{ fontSize: 13, color: COLORES.texto, fontWeight: 500 }}>{u.telefono}</div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: COLORES.textoMuted, fontWeight: 600, textTransform: "uppercase", marginBottom: 2 }}>Documento</div>
          <div style={{ fontSize: 13, color: COLORES.texto, fontWeight: 500 }}>{u.numeroDocumento}</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {!soloEliminar && (
          <button onClick={() => setUsuarioEditar(u)}
            style={{ flex: 1, background: COLORES.naranjaPastel, color: COLORES.naranja, border: "none", borderRadius: 8, padding: "8px 0", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            ✏️ Editar
          </button>
        )}
        <button onClick={() => setUsuarioEliminar(u)}
          style={{ flex: 1, background: COLORES.rojoPastel, color: COLORES.rojo, border: "none", borderRadius: 8, padding: "8px 0", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          🗑️ Eliminar
        </button>
      </div>
    </div>
  );

  const TablaUsuarios = ({ lista, tipo, conTarjeta = false, soloEliminar = false }) => {
    const cols = conTarjeta ? "2fr 1.5fr 1fr 1fr 1.2fr auto" : "2fr 1.5fr 1fr 1fr auto";
    const listaFiltrada = lista.filter(u =>
      u.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.correo?.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.numeroDocumento?.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
      <div style={{ background: COLORES.blanco, borderRadius: 14, border: `1px solid ${COLORES.borde}`, overflow: "hidden" }}>
        {/* Toolbar */}
        <div style={{ padding: "12px 16px", borderBottom: `1px solid ${COLORES.borde}`, display: "flex",
          flexDirection: esMobil ? "column" : "row",
          justifyContent: "space-between", alignItems: esMobil ? "stretch" : "center", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: COLORES.texto }}>{tipo}s registrados</span>
            <span style={{ background: COLORES.grisPastel, color: COLORES.gris, fontSize: 12, fontWeight: 700, padding: "2px 8px", borderRadius: 10 }}>{listaFiltrada.length}</span>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input type="text" placeholder="Buscar..." value={busqueda} onChange={e => setBusqueda(e.target.value)}
              style={{ border: `1px solid ${COLORES.borde}`, borderRadius: 8, padding: "7px 12px", fontSize: 14, outline: "none", flex: 1, minWidth: 0 }} />
            {!soloEliminar && (
              <button onClick={() => abrirModalCrear(tipo === 'Técnico' ? 3 : 1)}
                style={{ background: COLORES.verde, color: COLORES.blanco, border: "none", borderRadius: 8,
                  padding: "7px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>
                + {esMobil ? "Nuevo" : `Registrar ${tipo}`}
              </button>
            )}
          </div>
        </div>

        {/* Contenido: tarjetas en móvil, tabla en escritorio */}
        {esMobil ? (
          <div style={{ padding: "10px 12px" }}>
            {cargando ? (
              <div style={{ padding: 32, textAlign: "center", color: COLORES.textoMuted }}>Cargando...</div>
            ) : listaFiltrada.length === 0 ? (
              <div style={{ padding: 32, textAlign: "center", color: COLORES.textoMuted }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>👤</div>
                <p style={{ margin: 0, fontWeight: 600 }}>{busqueda ? "Sin resultados" : `No hay ${tipo.toLowerCase()}s`}</p>
              </div>
            ) : listaFiltrada.map(u => (
              <TarjetaUsuarioMobil key={u.id} u={u} tipo={tipo} conTarjeta={conTarjeta} soloEliminar={soloEliminar} />
            ))}
          </div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: cols, gap: 8, padding: "10px 20px", background: "#A5D6A7", fontSize: 13, fontWeight: 700, color: "#1B5E20", textTransform: "uppercase", letterSpacing: 0.5 }}>
              <span>Nombre</span><span>Correo</span><span>Teléfono</span><span>Documento</span>
              {conTarjeta && <span>Tarjeta prof.</span>}
              <span>Acciones</span>
            </div>
            {cargando ? (
              <div style={{ padding: 40, textAlign: "center", color: COLORES.textoMuted }}>Cargando...</div>
            ) : listaFiltrada.length === 0 ? (
              <div style={{ padding: 40, textAlign: "center", color: COLORES.textoMuted }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>👤</div>
                <p style={{ margin: 0, fontWeight: 600 }}>{busqueda ? "Sin resultados" : `No hay ${tipo.toLowerCase()}s registrados`}</p>
              </div>
            ) : listaFiltrada.map((u, i) => (
              <div key={u.id} style={{ display: "grid", gridTemplateColumns: cols, gap: 8, alignItems: "center", padding: "13px 20px", borderTop: `1px solid ${COLORES.borde}`, background: i % 2 === 0 ? COLORES.blanco : "#FAFAFA" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                    background: tipo === 'Técnico' ? COLORES.verdePastel : tipo === 'Administrador' ? COLORES.azulPastel : COLORES.naranjaPastel,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>
                    {tipo === 'Técnico' ? "⚙️" : tipo === 'Administrador' ? "🛡️" : "🌾"}
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: COLORES.texto }}>{u.nombre}</span>
                </div>
                <span style={{ fontSize: 13, color: COLORES.textoMuted }}>{u.correo}</span>
                <span style={{ fontSize: 13, color: COLORES.texto }}>{u.telefono}</span>
                <span style={{ fontSize: 13, color: COLORES.texto }}>{u.numeroDocumento}</span>
                {conTarjeta && (
                  <span>
                    {u.tarjetaProfesional
                      ? <span style={{ background: COLORES.azulPastel, color: COLORES.azul, padding: "3px 9px", borderRadius: 10, fontSize: 12, fontWeight: 600 }}>{u.tarjetaProfesional}</span>
                      : <span style={{ color: COLORES.textoMuted, fontSize: 13 }}>—</span>}
                  </span>
                )}
                <div style={{ display: "flex", gap: 6 }}>
                  {!soloEliminar && (
                    <button onClick={() => setUsuarioEditar(u)}
                      style={{ background: COLORES.naranjaPastel, color: COLORES.naranja, border: "none", borderRadius: 7, padding: "5px 11px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>✏️</button>
                  )}
                  <button onClick={() => setUsuarioEliminar(u)}
                    style={{ background: COLORES.rojoPastel, color: COLORES.rojo, border: "none", borderRadius: 7, padding: "5px 11px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>🗑️</button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    );
  };

  return (
    <div style={{ padding: esMobil ? "16px" : "28px 32px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
        <div style={{ width: 4, height: 24, background: COLORES.verde, borderRadius: 2 }} />
        <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: COLORES.texto }}>Gestión de usuarios</h1>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20, background: COLORES.grisPastel, padding: 6, borderRadius: 10, width: esMobil ? "100%" : "fit-content" }}>
        <TabBtn id="tecnicos"    label="Técnicos"        count={tecnicos.length}    />
        <TabBtn id="admins"      label="Administradores" count={admins.length}      />
        <TabBtn id="productores" label="Productores"     count={productores.length} />
      </div>

      {tab === "tecnicos"    && <TablaUsuarios lista={tecnicos}    tipo="Técnico"       conTarjeta />}
      {tab === "admins"      && <TablaUsuarios lista={admins}      tipo="Administrador"             />}
      {tab === "productores" && <TablaUsuarios lista={productores} tipo="Productor"     soloEliminar />}

      {/* Modal crear */}
      {modalCrear && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={() => setModalCrear(false)}>
          <div style={{ background: COLORES.blanco, borderRadius: 16, padding: esMobil ? 20 : 28, width: 460, maxWidth: "100%", boxShadow: "0 8px 40px rgba(0,0,0,0.2)", maxHeight: "90vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: COLORES.verdeClaro, textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>Nuevo registro</div>
                <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: COLORES.texto }}>Registrar {rolModal === 3 ? 'Técnico' : 'Administrador'}</h2>
              </div>
              <button onClick={() => setModalCrear(false)} style={{ background: COLORES.grisPastel, border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 18, color: COLORES.gris }}>×</button>
            </div>

            {exito ? (
              <div style={{ textAlign: "center", padding: "24px 0" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: COLORES.verde }}>{exito}</div>
              </div>
            ) : (
              <div style={{ display: "grid", gap: 14 }}>
                {rolModal === 3 && (
                  <div>
                    <label style={labelStyle}>Tipo de técnico</label>
                    <div style={{ display: "flex", gap: 10 }}>
                      {[{ val: "particular", label: "🧑‍🌾 Particular" }, { val: "oficial", label: "🏛️ Oficial ICA" }].map(op => (
                        <button key={op.val} type="button"
                          onClick={() => setForm(f => ({ ...f, tipoTecnico: op.val, tarjetaProfesional: op.val === "particular" ? `ICA-PART-${Date.now().toString().slice(-6)}` : "" }))}
                          style={{ flex: 1, padding: "10px", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer",
                            border: `2px solid ${form.tipoTecnico === op.val ? COLORES.verde : COLORES.borde}`,
                            background: form.tipoTecnico === op.val ? COLORES.verdePastel : COLORES.blanco,
                            color: form.tipoTecnico === op.val ? COLORES.verde : COLORES.textoMuted }}>
                          {op.label}
                        </button>
                      ))}
                    </div>
                    {errores.tipoTecnico && <span style={{ fontSize: 12, color: COLORES.rojo }}>{errores.tipoTecnico}</span>}
                  </div>
                )}

                {[
                  { key: "nombre",            label: "Nombre completo",      placeholder: "Ej. Carlos Ramírez" },
                  { key: "numeroDocumento",   label: "Número de documento",  placeholder: "Cédula o pasaporte" },
                  { key: "correo",            label: "Correo electrónico",   placeholder: "correo@ejemplo.com" },
                  { key: "telefono",          label: "Teléfono",             placeholder: "3001234567" },
                  { key: "contrasena",        label: "Contraseña",           placeholder: "Mínimo 8 caracteres", type: "password" },
                  { key: "confirmContrasena", label: "Confirmar contraseña", placeholder: "Repite la contraseña", type: "password" },
                ].map(({ key, label, placeholder, type = "text" }) => (
                  <div key={key}>
                    <label style={labelStyle}>{label}</label>
                    <input type={type} placeholder={placeholder} value={form[key]}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      style={{ ...inputStyle, borderColor: errores[key] ? COLORES.rojo : COLORES.borde }} />
                    {errores[key] && <span style={{ fontSize: 12, color: COLORES.rojo }}>{errores[key]}</span>}
                  </div>
                ))}

                {rolModal === 3 && form.tipoTecnico && (
                  <div>
                    <label style={labelStyle}>
                      Tarjeta profesional
                      {form.tipoTecnico === "particular" && <span style={{ marginLeft: 8, fontSize: 11, background: COLORES.verdePastel, color: COLORES.verde, padding: "1px 7px", borderRadius: 10 }}>Automática</span>}
                    </label>
                    <input readOnly={form.tipoTecnico === "particular"} value={form.tarjetaProfesional}
                      onChange={e => form.tipoTecnico === "oficial" && setForm(f => ({ ...f, tarjetaProfesional: e.target.value }))}
                      placeholder={form.tipoTecnico === "oficial" ? "Ej. ICA-2024-0341" : ""}
                      style={{ ...inputStyle, background: form.tipoTecnico === "particular" ? "#F5F5F5" : COLORES.blanco, color: form.tipoTecnico === "particular" ? COLORES.textoMuted : COLORES.texto }} />
                    {errores.tarjetaProfesional && <span style={{ fontSize: 12, color: COLORES.rojo }}>{errores.tarjetaProfesional}</span>}
                  </div>
                )}

                {errores.general && (
                  <div style={{ background: COLORES.rojoPastel, color: COLORES.rojo, borderRadius: 8, padding: "10px 14px", fontSize: 14, fontWeight: 600 }}>⚠️ {errores.general}</div>
                )}

                <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                  <button onClick={() => setModalCrear(false)} style={{ flex: 1, background: COLORES.grisPastel, color: COLORES.gris, border: "none", borderRadius: 8, padding: "10px 0", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Cancelar</button>
                  <button onClick={handleEnviar} style={{ flex: 1, background: enviando ? COLORES.gris : COLORES.verde, color: COLORES.blanco, border: "none", borderRadius: 8, padding: "10px 0", fontSize: 14, fontWeight: 700, cursor: "pointer", opacity: enviando ? 0.7 : 1 }}>
                    {enviando ? "Guardando..." : "✓ Registrar"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {usuarioEditar && (
        <ModalEditarUsuario usuario={usuarioEditar} onClose={() => setUsuarioEditar(null)} onGuardar={cargarUsuarios} />
      )}
      {usuarioEliminar && (
        <ModalConfirmarEliminar usuario={usuarioEliminar} onClose={() => setUsuarioEliminar(null)} onConfirmar={cargarUsuarios} />
      )}
    </div>
  );
}

// ── APP PRINCIPAL ─────────────────────────────────────────────────────────────
export default function DashboardAdmin() {
  const [paginaActual, setPaginaActual] = useState("dashboard");
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [busqueda, setBusqueda]         = useState("");
  const [filtro, setFiltro]             = useState("Predios");
  const [stats, setStats] = useState({ lugares: 0, cultivos: 0, tecnicos: 0, inspecciones: 0 });
  const navigate = useNavigate()
  const [esMobil, setEsMobil] = useState(window.innerWidth < 768);

useEffect(() => {
  const handleResize = () => setEsMobil(window.innerWidth < 768);
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  const nombreAdmin = usuario.nombre || "Administrador";
  const iniciales = nombreAdmin.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  const [prediosData, setPrediosData] = useState([]);

useEffect(() => {
  fetch('https://proyectointegrador5.onrender.com/api/predial/predios/riesgo')
    .then(r => r.json())
    .then(data => {
      console.log(data);
      setPrediosData(Array.isArray(data) ? data : []);
    })
    .catch(err => console.error(err));
}, []);

  useEffect(() => {
  Promise.all([
    fetch('https://proyectointegrador5.onrender.com/api/predial/lugares').then(r => r.json()),
    fetch('https://proyectointegrador5.onrender.com/api/predial/cultivos').then(r => r.json()),
    fetch('https://proyectointegrador5.onrender.com/api/usuarios').then(r => r.json()),
    fetch('https://proyectointegrador5.onrender.com/api/inspecciones/inspecciones').then(r => r.json()),
  ]).then(([lugares, cultivos, usuarios, inspecciones]) => {
    const tecnicos = usuarios.filter(u => u.rol === 'tecnico');
    setStats({
      lugares: lugares.length,
      cultivos: cultivos.length,
      tecnicos: tecnicos.length,
      inspecciones: inspecciones.length,
    });
  }).catch(err => console.error(err));
}, []);

const nivelANum = n => n === 'Alto' ? 3 : n === 'Medio' ? 2 : 1;

const prediosFiltrados = prediosData
  .filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase()))
  .filter(p => {
    if (filtro === "Más afectados")   return p.nivelRiesgo === 'Alto' || p.nivelRiesgo === 'Medio';
    if (filtro === "Menos afectados") return p.nivelRiesgo === 'Bajo';
    return true;
  })
  .sort((a, b) => {
    if (filtro === "Más afectados")   return nivelANum(b.nivelRiesgo) - nivelANum(a.nivelRiesgo);
    if (filtro === "Menos afectados") return nivelANum(a.nivelRiesgo) - nivelANum(b.nivelRiesgo);
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
      <img src="/LogoICA.png" alt="Logo ICA" style={{ width: 30, height: 30, borderRadius: 8, objectFit: "cover" }} />
      <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: -0.5 }}>Proyecto ICA</span>
    </div>
  </div>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
  {!esMobil && (
    <div style={{ textAlign: "right" }}>
      <div style={{ fontSize: 15, fontWeight: 600 }}>{nombreAdmin}</div>
      <div style={{ fontSize: 13, opacity: 0.75 }}>Administrador</div>
    </div>
  )}
  <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700 }}>{iniciales}</div>
</div>
</header>

      <div style={{ display: "flex", flex: 1 }}>

   {/* SIDEBAR */}
{/* OVERLAY para móvil */}
{esMobil && menuAbierto && (
  <div
    onClick={() => setMenuAbierto(false)}
    style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 40 }}
  />
)}

{/* SIDEBAR */}
<aside style={{
  width: 230,
  background: COLORES.blanco,
  borderRight: `1px solid ${COLORES.borde}`,
  flexShrink: 0,
  display: "flex",
  flexDirection: "column",
  height: "calc(100vh - 56px)",
  position: esMobil ? "fixed" : "sticky",
  top: 56,
  left: 0,
  zIndex: 41,
  transform: esMobil ? (menuAbierto ? "translateX(0)" : "translateX(-100%)") : "none",
  transition: "transform 0.25s ease",
}}>
  <div style={{ flex: 1, overflowY: "auto" }}>
    <div style={{ padding: "14px 20px", background: "#A5D6A7", borderBottom: `1px solid ${COLORES.borde}` }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: "#1B5E20", textTransform: "uppercase", letterSpacing: 1 }}>
        ADMINISTRADOR
      </div>
    </div>
    <nav style={{ padding: "12px 0" }}>
      {navItems.map(item => (
        <button key={item.id} onClick={() => { setPaginaActual(item.id); if (esMobil) setMenuAbierto(false); }}
          style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "13px 16px",
            border: "none", background: paginaActual === item.id ? "#C8E6C9" : "transparent",
            color: paginaActual === item.id ? COLORES.verde : COLORES.gris,
            cursor: "pointer", fontWeight: paginaActual === item.id ? 700 : 500, fontSize: 14,
            textAlign: "left", borderLeft: paginaActual === item.id ? `3px solid ${COLORES.verde}` : "3px solid transparent",
          }}>
          <span style={{ fontSize: 17 }}>{item.icono}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  </div>
  <div style={{ borderTop: `1px solid ${COLORES.borde}` }}>
    <button onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('usuario'); navigate('/', { replace: true }); }}
      style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "14px 20px",
        border: "none", background: "transparent", color: COLORES.rojo, cursor: "pointer", fontWeight: 600, fontSize: 15 }}>
      <span style={{ fontSize: 17 }}>🚪</span>
      <span>Cerrar sesión</span>
    </button>
  </div>
</aside>

        {/* CONTENIDO */}
        <main style={{ flex: 1, overflow: "auto" }}>
        {paginaActual === "dashboard" && (
  <div style={{ padding: esMobil ? "16px" : "28px 32px" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
      <div style={{ width: 4, height: 24, background: COLORES.verde, borderRadius: 2 }} />
      <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: COLORES.texto }}>Inicio</h1>
    </div>

    {/* Tarjetas de stats — 2 columnas en móvil */}
    <div style={{ display: "grid", gridTemplateColumns: esMobil ? "1fr 1fr" : "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 24 }}>
      <Tarjeta icono="🗺️" titulo="Lugares"     valor={stats.lugares}      colorTexto={COLORES.azul}    colorFondo={COLORES.azulPastel}    />
      <Tarjeta icono="🌾" titulo="Cultivos"     valor={stats.cultivos}     colorTexto={COLORES.verde}   colorFondo={COLORES.verdePastel}   />
      <Tarjeta icono="⚙️" titulo="Técnicos"    valor={stats.tecnicos}     colorTexto={COLORES.naranja} colorFondo={COLORES.naranjaPastel} />
      <Tarjeta icono="🌿" titulo="Inspecciones" valor={stats.inspecciones} colorTexto={COLORES.morado}  colorFondo={COLORES.moradoPastel}  />
    </div>

    {/* Panel predios */}
    <div style={{ background: COLORES.blanco, borderRadius: 14, border: `1px solid ${COLORES.borde}`, overflow: "hidden" }}>

      {/* Header del panel */}
      <div style={{ padding: "14px 16px", borderBottom: `1px solid ${COLORES.borde}`, display: "flex", flexDirection: esMobil ? "column" : "row", gap: 10, alignItems: esMobil ? "stretch" : "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 4, height: 20, background: COLORES.verde, borderRadius: 2 }} />
          <span style={{ fontSize: 14, fontWeight: 700, color: COLORES.texto }}>Predios</span>
        </div>
        <input type="text" placeholder="Buscar predio..." value={busqueda} onChange={e => setBusqueda(e.target.value)}
          style={{ border: `1px solid ${COLORES.borde}`, borderRadius: 8, padding: "7px 14px", fontSize: 14, outline: "none", width: esMobil ? "100%" : 200, color: COLORES.texto, boxSizing: "border-box" }} />
      </div>

      {/* Filtros */}
      <div style={{ padding: "10px 16px", borderBottom: `1px solid ${COLORES.borde}`, display: "flex", gap: 6, flexWrap: "wrap" }}>
        {["Lugares de producción", "Más afectados", "Menos afectados"].map(f => (
          <button key={f} onClick={() => setFiltro(f)}
            style={{ padding: "5px 12px", borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: "pointer",
              border: `1px solid ${filtro === f ? COLORES.verde : COLORES.borde}`,
              background: filtro === f ? COLORES.verdePastel : COLORES.blanco,
              color: filtro === f ? COLORES.verde : COLORES.textoMuted }}>
            {f}
          </button>
        ))}
      </div>

      {/* Tabla en escritorio / Tarjetas en móvil */}
      {esMobil ? (
        <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: 10 }}>
          {prediosFiltrados.length === 0 ? (
            <div style={{ padding: "24px 0", textAlign: "center", color: COLORES.textoMuted, fontSize: 14 }}>No se encontraron predios</div>
          ) : prediosFiltrados.map((p, i) => (
            <div key={i} style={{ background: COLORES.blanco, border: `1px solid ${COLORES.borde}`, borderRadius: 12, padding: "12px 14px" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: COLORES.texto, marginBottom: 8 }}>{p.nombre}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span style={{ background: COLORES.grisPastel, color: COLORES.gris, padding: "2px 10px", borderRadius: 12, fontSize: 13, fontWeight: 500 }}>
                  📍 {p.lugarproduccion || p.vereda || '—'}
                </span>
                {p.nivelRiesgo === 'Alto'  && <span style={{ background: COLORES.rojoPastel,     color: COLORES.rojo,    fontSize: 13, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>🚨 Alerta</span>}
                {p.nivelRiesgo === 'Medio' && <span style={{ background: COLORES.amarilloPastel, color: COLORES.amarillo, fontSize: 13, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>⚠️ Media</span>}
                {p.nivelRiesgo === 'Bajo'  && <span style={{ background: COLORES.verdePastel,    color: COLORES.verde,   fontSize: 13, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>✅ Sin alertas</span>}
                {!p.nivelRiesgo            && <span style={{ background: COLORES.grisPastel,     color: COLORES.gris,    fontSize: 13, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>Sin inspección</span>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#A5D6A7" }}>
                {["Nombre", "Lugar de producción", "Nivel de riesgo"].map(h => (
                  <th key={h} style={{ padding: "11px 20px", textAlign: "left", fontSize: 13, fontWeight: 700, color: "#1B5E20", textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {prediosFiltrados.map((p, i) => (
                <tr key={i} style={{ borderTop: `1px solid ${COLORES.borde}`, background: i % 2 === 0 ? COLORES.blanco : "#FAFAFA" }}>
                  <td style={{ padding: "13px 20px", fontSize: 14, fontWeight: 600, color: COLORES.texto }}>{p.nombre}</td>
                  <td style={{ padding: "13px 20px" }}>
                    <span style={{ background: COLORES.grisPastel, color: COLORES.gris, padding: "2px 10px", borderRadius: 12, fontSize: 13, fontWeight: 500 }}>
                      {p.lugarproduccion || p.vereda || '—'}
                    </span>
                  </td>
                  <td style={{ padding: "13px 20px" }}>
                    {p.nivelRiesgo === 'Alto'  && <span style={{ background: COLORES.rojoPastel,     color: COLORES.rojo,    fontSize: 13, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>🚨 Alerta</span>}
                    {p.nivelRiesgo === 'Medio' && <span style={{ background: COLORES.amarilloPastel, color: COLORES.amarillo, fontSize: 13, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>⚠️ Alerta media</span>}
                    {p.nivelRiesgo === 'Bajo'  && <span style={{ background: COLORES.verdePastel,    color: COLORES.verde,   fontSize: 13, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>✅ Sin alertas</span>}
                    {!p.nivelRiesgo            && <span style={{ background: COLORES.grisPastel,     color: COLORES.gris,    fontSize: 13, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>Sin inspección</span>}
                  </td>
                </tr>
              ))}
              {prediosFiltrados.length === 0 && (
                <tr><td colSpan={3} style={{ padding: "24px 20px", textAlign: "center", color: COLORES.textoMuted, fontSize: 14 }}>No se encontraron predios</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ padding: "10px 16px", borderTop: `1px solid ${COLORES.borde}`, fontSize: 13, color: COLORES.textoMuted, textAlign: "right" }}>
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