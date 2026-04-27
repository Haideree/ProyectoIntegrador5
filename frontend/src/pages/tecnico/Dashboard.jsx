import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
const COLORES = {
  verde: "#2E7D32",
  verdeClaro: "#4CAF50",
  verdePastel: "#C8E6C9",
  verdeMedio: "#A5D6A7",
  amarillo: "#F9A825",
  amarilloPastel: "#FFFDE7",
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



const historial = [
  { id: 1, lugar: "La Esperanza", fechaInspeccion: "11/03/2026", fechaFin: "18/03/2026", cultivos: "Banano, Manzana, Uva", propietario: "Bartholomew Roberts", plantas: 750, ubicacion: "Santander/Piedecuesta/Vereda Los Curos" },
  { id: 2, lugar: "San Gabriel", fechaInspeccion: "04/01/2026", fechaFin: "08/01/2026", cultivos: "Café, Cacao", propietario: "Luis Perez", plantas: 430, ubicacion: "Santander/Girón/Vereda Alta" },
  { id: 3, lugar: "El Paraíso", fechaInspeccion: "04/12/2025", fechaFin: "15/12/2025", cultivos: "Arroz, Sorgo", propietario: "Ana Torres", plantas: 560, ubicacion: "Santander/Lebrija/Vereda Centro" },
  { id: 4, lugar: "Altamira", fechaInspeccion: "20/11/2025", fechaFin: "26/11/2025", cultivos: "Caña, Plátano", propietario: "Jorge Medina", plantas: 280, ubicacion: "Santander/Rionegro/Vereda Baja" },
  { id: 5, lugar: "NovaCampo", fechaInspeccion: "01/11/2025", fechaFin: "12/11/2025", cultivos: "Tomate, Pimentón", propietario: "Sandra Gómez", plantas: 390, ubicacion: "Santander/Betulia/Vereda El Pino" },
  { id: 6, lugar: "La Ceiba", fechaInspeccion: "25/10/2025", fechaFin: "30/10/2025", cultivos: "Aguacate, Mango", propietario: "Fernando Ríos", plantas: 210, ubicacion: "Santander/Sabana de Torres/Vereda Palmas" },
  { id: 7, lugar: "El Progreso", fechaInspeccion: "14/10/2025", fechaFin: "18/10/2025", cultivos: "Maíz, Sorgo", propietario: "Diana Castillo", plantas: 145, ubicacion: "Santander/San Vicente/Vereda Llanos" },
  { id: 8, lugar: "Santa Rosa", fechaInspeccion: "26/09/2025", fechaFin: "03/11/2025", cultivos: "Papa, Zanahoria", propietario: "Hernán Vargas", plantas: 320, ubicacion: "Santander/Charta/Vereda Montaña" },
];



const diasSemana = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];

function Calendario({ inspecciones }) {
  const hoy = new Date();
  const [mes, setMes] = useState(hoy.getMonth());
  const [anio, setAnio] = useState(hoy.getFullYear());

  const diasConInspeccion = inspecciones
  .filter(ins => ins.fechaInspeccion)
  .map(ins => new Date(ins.fechaInspeccion))
  .filter(f => f.getMonth() === mes && f.getFullYear() === anio)
  .map(f => f.getDate());
  const diasMes = new Date(anio, mes + 1, 0).getDate();
  const primerDia = new Date(anio, mes, 1).getDay();
  const dias = [];
  for (let i = 0; i < primerDia; i++) dias.push(null);
  for (let i = 1; i <= diasMes; i++) dias.push(i);

  const anterior = () => {
    if (mes === 0) { setMes(11); setAnio(a => a - 1); }
    else setMes(m => m - 1);
  };

  const siguiente = () => {
    if (mes === 11) { setMes(0); setAnio(a => a + 1); }
    else setMes(m => m + 1);
  };

  const esHoy = (d) => d === hoy.getDate() && mes === hoy.getMonth() && anio === hoy.getFullYear();

  const nombresMeses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

    return (
  <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #CFD8DC", padding: 28, width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontWeight: 700, color: "#1B2631", fontSize: 15 }}>{nombresMeses[mes]} {anio}</span>
        <div style={{ display: "flex", gap: 4 }}>
          <button onClick={anterior} style={{ background: "#ECEFF1", border: "none", cursor: "pointer", color: "#546E7A", fontSize: 16, width: 28, height: 28, borderRadius: 6 }}>‹</button>
          <button onClick={siguiente} style={{ background: "#ECEFF1", border: "none", cursor: "pointer", color: "#546E7A", fontSize: 16, width: 28, height: 28, borderRadius: 6 }}>›</button>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, textAlign: "center" }}>
        {diasSemana.map(d => (
          <div key={d} style={{ fontSize: 13, fontWeight: 600, color: "#607D8B", padding: "8px 0" }}>{d}</div>
        ))}
        {dias.map((d, i) => {
          const tieneInspeccion = d && diasConInspeccion.includes(d);
          const hoyDia = d && esHoy(d);
          return (
            <div key={i} style={{
              fontSize: 15, padding: "14px 0", borderRadius: 8,
              cursor: d ? "pointer" : "default",
              background: hoyDia ? "#2E7D32" : tieneInspeccion ? "#A5D6A7" : "transparent",
              color: hoyDia ? "#FFFFFF" : tieneInspeccion ? "#1B5E20" : d ? "#1B2631" : "transparent",
              fontWeight: hoyDia || tieneInspeccion ? 700 : 400,
              position: "relative",
            }}>
              {d || ""}
              {tieneInspeccion && !hoyDia && (
                <span style={{ position: "absolute", bottom: 2, left: "50%", transform: "translateX(-50%)", width: 4, height: 4, borderRadius: "50%", background: "#2E7D32", display: "block" }} />
              )}
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 12, display: "flex", gap: 12, fontSize: 11 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#2E7D32", display: "inline-block" }} /> Hoy
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#A5D6A7", display: "inline-block" }} /> Inspección programada
        </span>
      </div>
    </div>
  );
}

function Badge({ estado }) {
  const estilos = {
    "En revisión":  { bg: COLORES.azulPastel,    color: COLORES.azul },
    "Por revisar":  { bg: COLORES.amarilloPastel, color: "#B7770D" },
    "REVISADO":     { bg: "#C8E6C9",              color: "#1B5E20" },
    "EN PROCESO":   { bg: COLORES.azulPastel,     color: COLORES.azul },
    "PENDIENTE":    { bg: COLORES.grisPastel,     color: COLORES.gris },
  };
  const s = estilos[estado] || { bg: COLORES.grisPastel, color: COLORES.gris };
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, whiteSpace: "nowrap" }}>
      {estado}
    </span>
  );
}

function ModalAviso({ onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div style={{ background: COLORES.blanco, borderRadius: 16, padding: 36, width: 340, maxWidth: "90vw", textAlign: "center", boxShadow: "0 8px 40px rgba(0,0,0,0.2)" }} onClick={e => e.stopPropagation()}>
        <div style={{ width: 60, height: 60, borderRadius: "50%", background: COLORES.rojoPastel, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 30 }}>⚠️</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: COLORES.rojo, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>AVISO</div>
        <p style={{ fontSize: 15, color: COLORES.texto, margin: "0 0 28px", lineHeight: 1.6 }}>
          El formulario no está disponible en este momento
        </p>
        <button onClick={onClose} style={{ background: COLORES.verde, color: COLORES.blanco, border: "none", borderRadius: 8, padding: "11px 36px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
          Aceptar
        </button>
      </div>
    </div>
  );
}

function ModalDetalle({ item, onClose }) {
  if (!item) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div style={{ background: COLORES.blanco, borderRadius: 16, padding: 28, width: 420, maxWidth: "90vw", boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: COLORES.verdeClaro, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Lugar de producción</div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: COLORES.texto }}>{item.lugar}</h2>
          </div>
          <button onClick={onClose} style={{ background: COLORES.grisPastel, border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 18, color: COLORES.gris }}>×</button>
        </div>
        <div style={{ display: "grid", gap: 14 }}>
          <InfoFila label="Ubicación" valor={item.ubicacion} />
          <InfoFila label="Cultivos" valor={item.cultivos} />
          <InfoFila label="Productor propietario" valor={item.nombreProductor || 'Sin información'} />
          <InfoFila label="Cantidad de plantas totales" valor={item.cantidadPlantas ?? 'Sin información'} />
          {item.lotes && <InfoFila label="Cantidad de lotes" valor={`${item.lotes}`} />}
        </div>
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${COLORES.borde}` }}>
          <div style={{ background: "#C8E6C9", borderRadius: 8, padding: 12, fontSize: 12, color: "#2E7D32" }}>
           🗺 {item.departamento} / {item.municipio} / {item.vereda}
          </div>
        </div>
        <button onClick={onClose} style={{ marginTop: 14, background: "none", border: "none", color: COLORES.verde, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>← Volver</button>
      </div>
    </div>
  );
}

function InfoFila({ label, valor }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <span style={{ fontSize: 11, color: COLORES.textoMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</span>
      <span style={{ fontSize: 14, color: COLORES.texto, fontWeight: 500 }}>{valor}</span>
    </div>
  );
}

function ModalLotes({ item, lotes, onClose, onAbrirFormularioLote, esCompletada }) {
  if (!item) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div style={{ background: COLORES.blanco, borderRadius: 16, padding: 28, width: 500, maxWidth: "90vw", boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: COLORES.texto }}>Formularios</h2>
          <button onClick={onClose} style={{ background: COLORES.grisPastel, border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 18, color: COLORES.gris }}>×</button>
        </div>
        <p style={{ margin: "0 0 16px", fontSize: 13, color: COLORES.textoMuted }}>
          Lugar de producción: <strong style={{ color: COLORES.texto }}>{item.lugar}</strong> · cantidad de lotes: <strong>{lotes.length}</strong>
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr 1fr", gap: 8, padding: "8px 12px", background: "#C8E6C9", borderRadius: 8, fontSize: 11, fontWeight: 700, color: "#1B5E20", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>
          <span>Lote</span><span>Estado</span><span style={{ textAlign: "right" }}>Ver informe</span>
        </div>
        <div style={{ display: "grid", gap: 6 }}>
          {lotes.map(lote => (
  <div key={lote.id} style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr 1fr", gap: 8, alignItems: "center", padding: "10px 12px", borderRadius: 8, border: `1px solid ${COLORES.borde}` }}>
    <div>
      <span style={{ fontWeight: 600, fontSize: 13, color: COLORES.texto }}>{lote.nombre}</span>
      {lote.cultivos && (
        <div style={{ fontSize: 11, color: COLORES.textoMuted, marginTop: 2 }}>🌱 {lote.cultivos}</div>
      )}
    </div>
    <Badge estado={lote.estado} />
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      {!esCompletada && (
        <button
          onClick={() => onAbrirFormularioLote(item, lote)}
          style={{
            background: lote.estado === "PENDIENTE" ? COLORES.grisPastel : lote.estado === "EN PROCESO" ? COLORES.azul : COLORES.verde,
            color: lote.estado === "PENDIENTE" ? COLORES.gris : COLORES.blanco,
            border: "none", borderRadius: 6, padding: "5px 14px", fontSize: 11, fontWeight: 700, cursor: "pointer"
          }}>
          {lote.estado === "EN PROCESO" ? "SEGUIR" : lote.estado === "PENDIENTE" ? "+" : "VER"}
        </button>
      )}
      {esCompletada && (
        <span style={{ fontSize: 11, fontWeight: 700, color: COLORES.verde }}>✓ Revisado</span>
      )}
    </div>
  </div>
))}
          <div style={{ textAlign: "center", padding: "8px 0", fontSize: 13, color: COLORES.textoMuted, fontWeight: 500 }}>
        
          </div>
        </div>
      </div>
    </div>
  );
}

function ModalFormularioLote({ inspeccion, lote, onClose, onVolver }) {
  const cultivos = inspeccion?.cultivos?.split(",").map(c => c.trim()) || [];
  const [form] = useState({
    numeroLote: lote?.id || "",
    cantidades: cultivos.map(() => Math.floor(Math.random() * 100) + 50),
    plantacionTotal: inspeccion?.plantas || 0
  });
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);

  if (!inspeccion || !lote) return null;

  const handleConfirmar = async () => {
    setGuardando(true);
    try {
      const res = await fetch(`http://localhost:3000/api/inspecciones/inspecciones/${inspeccion.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fechaInspeccion: new Date().toISOString().split('T')[0],
          observaciones: `Lote ${lote.nombre} inspeccionado`,
          resultado: 'En proceso'
        })
      });
      if (!res.ok) throw new Error('Error al guardar');
      setGuardado(true);
      setTimeout(() => onVolver(), 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 150, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div style={{ background: COLORES.blanco, borderRadius: 16, padding: 28, width: 480, maxWidth: "90vw", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 8px 40px rgba(0,0,0,0.2)" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: COLORES.verdeClaro, textTransform: "uppercase", letterSpacing: 1 }}>Formulario · {lote.nombre}</div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: COLORES.texto }}>{inspeccion.lugar}</h2>
          </div>
          <button onClick={onClose} style={{ background: COLORES.grisPastel, border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 18, color: COLORES.gris }}>×</button>
        </div>

        <div style={{ display: "grid", gap: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
            <span style={{ color: COLORES.textoMuted }}>Número de lote</span>
            <strong>{form.numeroLote}</strong>
          </div>
          {cultivos.map((c, i) => (
            <div key={i} style={{ background: i % 2 === 0 ? "#C8E6C9" : COLORES.azulPastel, borderRadius: 10, padding: "14px 16px", display: "grid", gap: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: i % 2 === 0 ? "#1B5E20" : COLORES.azul }}>Cultivo {i + 1}</div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span style={{ color: COLORES.textoMuted }}>Nombre</span><strong>{c}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span style={{ color: COLORES.textoMuted }}>Cantidad</span><strong>{form.cantidades[i]}</strong>
              </div>
            </div>
          ))}
          <div style={{ borderTop: `1px solid ${COLORES.borde}`, paddingTop: 16 }}>
            <div style={{ background: "#C8E6C9", borderRadius: 8, padding: "12px 16px", display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, color: "#2E7D32" }}>Total plantas</span>
              <strong style={{ color: "#1B5E20" }}>{form.plantacionTotal}</strong>
            </div>
          </div>
        </div>

        {guardado && (
          <div style={{ background: "#C8E6C9", borderRadius: 8, padding: "10px 14px", textAlign: "center", color: "#1B5E20", fontWeight: 600, fontSize: 13, marginTop: 16 }}>
            ✓ Guardado exitosamente
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
          <button onClick={onVolver} style={{ background: COLORES.grisPastel, color: COLORES.gris, border: "none", borderRadius: 8, padding: "10px 24px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>← Volver</button>
          <button 
            onClick={handleConfirmar}
            disabled={guardando}
            style={{ background: COLORES.verde, color: COLORES.blanco, border: "none", borderRadius: 8, padding: "10px 28px", fontSize: 13, fontWeight: 700, cursor: "pointer", opacity: guardando ? 0.7 : 1 }}>
            {guardando ? 'Guardando...' : 'Confirmar ✓'}
          </button>
        </div>
      </div>
    </div>
  );
}

function CampoForm({ label, value, onChange, placeholder, tipo = "text", error }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label style={{ fontSize: 11, color: COLORES.textoMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</label>
      <input type={tipo} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: "100%", border: `1px solid ${error ? COLORES.rojo : COLORES.borde}`, borderRadius: 8, padding: "8px 12px", fontSize: 13, color: COLORES.texto, background: COLORES.blanco, boxSizing: "border-box", outline: "none" }} />
      {error && <span style={{ fontSize: 11, color: COLORES.rojo, fontWeight: 500 }}>{error}</span>}
    </div>
  );
}

function PaginaInicio({ inspecciones, onVerDetalle, onVerFormulario }) {
  return (
    <div style={{ padding: "24px 28px" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 40 }}>
        {/* FIX: fondo más oscuro en el header del calendario */}
        <div style={{ width: "100%", background: "#A5D6A7", padding: "18px 0", marginBottom: 24, borderBottom: `1px solid ${COLORES.borde}`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 4, height: "100%", background: COLORES.verde, borderTopRightRadius: 4, borderBottomRightRadius: 4 }} />
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#1B5E20" }}>Calendario</h2>
        </div>
        <Calendario inspecciones={inspecciones} />
        {/* FIX: fondo más oscuro en el label debajo del calendario */}
    <div style={{ marginTop: 16, background: "#A5D6A7", borderRadius: 10, padding: "12px 20px", textAlign: "center", width: "100%", maxWidth: 1100 }}>
  <div style={{ fontSize: 11, fontWeight: 700, color: "#1B5E20", marginBottom: 4 }}>HOY</div>
  <div style={{ fontSize: 15, fontWeight: 700, color: "#1B5E20" }}>
    {new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
  </div>
  <div style={{ fontSize: 12, color: "#2E7D32", marginTop: 4 }}>{inspecciones.length} inspecciones programadas</div>
</div>
      </div>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
          <div style={{ width: 4, height: 22, background: COLORES.verde, borderRadius: 2 }} />
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: COLORES.texto }}>Lista de inspecciones por realizar</h2>
        </div>
        <div style={{ display: "grid", gap: 10 }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1.4fr auto auto", gap: 8, padding: "6px 14px", fontSize: 11, fontWeight: 700, color: COLORES.textoMuted, textTransform: "uppercase", letterSpacing: 0.5 }}>
            <span>Lugar de producción</span><span>Fecha de inspección</span><span>Estado</span><span>Detalles</span><span>Formulario</span>
          </div>
          {inspecciones.map(insp => (
            <div key={insp.id} style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1.4fr auto auto", gap: 8, alignItems: "center", padding: "12px 14px", background: COLORES.blanco, borderRadius: 10, border: `1px solid ${COLORES.borde}` }}>
              <span style={{ fontWeight: 600, fontSize: 13, color: COLORES.texto }}>{insp.lugar}</span>
              <span style={{ fontSize: 12, color: COLORES.textoMuted }}>{insp.fechaInspeccion ? new Date(insp.fechaInspeccion).toLocaleDateString('es-CO') : 'Sin fecha'}</span>
              <Badge estado={insp.estado} />
              <button onClick={() => onVerDetalle(insp)} style={{ background: "#C8E6C9", color: "#1B5E20", border: "none", borderRadius: 6, padding: "5px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>VER</button>
              <button onClick={() => onVerFormulario(insp)} style={{ background: insp.disponible ? COLORES.verde : COLORES.grisPastel, color: insp.disponible ? COLORES.blanco : COLORES.gris, border: "none", borderRadius: 6, padding: "5px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>VER</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PaginaHistorial({ onVerDetalle, onVerFormulario }) {
  const [busqueda, setBusqueda] = useState("");
  const [historialReal, setHistorialReal] = useState([]);
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  useEffect(() => {
    fetch(`http://localhost:3000/api/inspecciones/inspecciones/tecnico/${usuario.id}`)
      .then(res => res.json())
      .then(data => setHistorialReal(data.filter(i => i.resultado === 'Completada')))
      .catch(err => console.error(err));
  }, []);

  const filtrados = historialReal.filter(h => 
    h.lugar?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div style={{ padding: "24px 28px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 4, height: 22, background: COLORES.verde, borderRadius: 2 }} />
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: COLORES.texto }}>Historial de inspecciones</h2>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input placeholder="Buscar lugar..." value={busqueda} onChange={e => setBusqueda(e.target.value)}
            style={{ border: `1px solid ${COLORES.borde}`, borderRadius: 8, padding: "7px 14px", fontSize: 13, outline: "none", width: 180 }} />
          <button style={{ background: COLORES.verde, color: COLORES.blanco, border: "none", borderRadius: 8, padding: "8px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>FILTRAR</button>
        </div>
      </div>
      <div style={{ background: COLORES.blanco, borderRadius: 12, border: `1px solid ${COLORES.borde}`, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1.4fr 1.4fr auto auto", gap: 8, padding: "10px 16px", background: "#A5D6A7", fontSize: 11, fontWeight: 700, color: "#1B5E20", textTransform: "uppercase", letterSpacing: 0.5 }}>
          <span>Lugar de producción</span><span>Fecha inspección</span><span>Fecha finalización</span><span>Detalle</span><span>Formulario</span>
        </div>
        {filtrados.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: COLORES.textoMuted, fontSize: 13 }}>No hay inspecciones completadas</div>
        ) : filtrados.map((h, i) => (
          <div key={h.id} style={{ display: "grid", gridTemplateColumns: "2fr 1.4fr 1.4fr auto auto", gap: 8, alignItems: "center", padding: "12px 16px", borderTop: i === 0 ? "none" : `1px solid ${COLORES.borde}` }}>
            <span style={{ fontWeight: 600, fontSize: 13, color: COLORES.texto }}>{h.lugar}</span>
            <span style={{ fontSize: 12, color: COLORES.textoMuted }}>
              {h.fechaInspeccion ? new Date(h.fechaInspeccion).toLocaleDateString('es-CO') : '-'}
            </span>
            <span style={{ fontSize: 12, color: COLORES.textoMuted }}>{h.fechaFin ? new Date(h.fechaFin).toLocaleDateString('es-CO') : '-'}</span>
            <button onClick={() => onVerDetalle(h)} style={{ background: COLORES.grisPastel, color: COLORES.gris, border: "none", borderRadius: 6, padding: "5px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>DETALLES</button>
            <button onClick={() => onVerFormulario(h)} style={{ background: "#C8E6C9", color: "#1B5E20", border: "none", borderRadius: 6, padding: "5px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>VER</button>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 10, fontSize: 12, color: COLORES.textoMuted, textAlign: "right" }}>{filtrados.length} registros encontrados</div>
    </div>
  );
}

function PaginaFormulario({ inspecciones }) {
  const inspeccionHoy = inspecciones?.[0] || null;

  const [paso, setPaso] = useState(1);
  const [datos, setDatos] = useState({
  lugar: "",
  propietario: "",
  departamento: "",
  municipio: "",
  vereda: "",
  cultivo: "",
  plantas: "",
  lotes: "",
  observaciones: "",
  fechaInicio: "",
  fechaFin: "",
  plagaDetectada: "",
  nivelRiesgo: "Bajo",
  estadoFitosanitario: "",
});
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);

useEffect(() => {
  if (inspeccionHoy) {
    fetch(`http://localhost:3000/api/inspecciones/lotes/predio/${inspeccionHoy.predio_id}`)
      .then(res => res.json())
      .then(data => {
        setDatos(prev => ({
          ...prev,
          lugar: inspeccionHoy.lugar || "",
          departamento: inspeccionHoy.departamento || "",
          municipio: inspeccionHoy.municipio || "",
          vereda: inspeccionHoy.vereda || "",
          cultivo: inspeccionHoy.cultivos || "",
          lotes: data.length.toString(),
        }));
      })
      .catch(err => console.error(err));
  }
}, [inspeccionHoy]);

  if (!inspeccionHoy) return (
    <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
      <h2 style={{ color: COLORES.texto, fontWeight: 700, margin: 0 }}>No hay inspecciones para hoy</h2>
      <p style={{ color: COLORES.textoMuted, marginTop: 8 }}>Cuando tengas una inspección asignada para hoy aparecerá aquí.</p>
    </div>
  );

  const validarPaso = () => {
    let e = {};
    if (paso === 2) {
      if (!datos.plantas) e.plantas = "Requerido";
    }
    if (paso === 3) {
      if (!datos.observaciones) e.observaciones = "Requerido";
      if (!datos.fechaInicio) e.fechaInicio = "Requerido";
      if (!datos.fechaFin) e.fechaFin = "Requerido";
    }
    setErrores(e);
    return Object.keys(e).length === 0;
  };

const guardar = async () => {
  if (!validarPaso()) return;
  setGuardando(true);
  try {
    console.log('Datos a guardar:', datos);
    const res = await fetch(`http://localhost:3000/api/inspecciones/inspecciones/${inspeccionHoy.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fechaInspeccion: datos.fechaInicio,
        fechaFin: datos.fechaFin,
        observaciones: datos.observaciones,
        resultado: 'Completada',
        plagaDetectada: datos.plagaDetectada,
        nivelRiesgo: datos.nivelRiesgo,
        cantidadPlantas: Number(datos.plantas),
        estadoFitosanitario: datos.estadoFitosanitario,
      })
    });
    if (!res.ok) throw new Error('Error al guardar');
    setGuardado(true);
  } catch (err) {
    console.error(err);
  } finally {
    setGuardando(false);
  }
};

  const siguiente = () => {
    if (paso === 3) { guardar(); return; }
    if (validarPaso()) setPaso(p => Math.min(3, p + 1));
  };

  if (guardado) return (
    <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
      <h2 style={{ color: COLORES.verde, fontWeight: 700, margin: 0 }}>Inspección guardada</h2>
      <p style={{ color: COLORES.textoMuted, marginTop: 8 }}>La inspección ha sido registrada exitosamente.</p>
    </div>
  );

  return (
    <div style={{ padding: "24px 28px" }}>
      <div style={{ width: "100%", background: "#A5D6A7", padding: "14px 0", marginBottom: 24, borderBottom: `1px solid ${COLORES.borde}`, display: "flex", alignItems: "center", position: "relative" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 4, height: "100%", background: COLORES.verde, borderTopRightRadius: 4, borderBottomRightRadius: 4 }} />
        <div style={{ paddingLeft: 16 }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1B5E20" }}>Formulario de inspección · {inspeccionHoy.lugar}</h2>
        </div>
      </div>
      <div style={{ maxWidth: 580, margin: "0 auto" }}>
        <div style={{ display: "flex", marginBottom: 28, position: "relative" }}>
          {["Información general", "Cultivos", "Observaciones"].map((label, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center", position: "relative" }}>
              {i < 2 && <div style={{ position: "absolute", top: 15, left: "50%", right: "-50%", height: 2, background: paso > i + 1 ? COLORES.verde : COLORES.borde }} />}
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: paso >= i + 1 ? COLORES.verde : COLORES.borde, color: COLORES.blanco, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px", fontWeight: 700, position: "relative", zIndex: 1 }}>{paso > i ? "✓" : i + 1}</div>
              <div style={{ fontSize: 11, color: paso === i + 1 ? COLORES.verde : COLORES.textoMuted }}>{label}</div>
            </div>
          ))}
        </div>
        <div style={{ background: COLORES.blanco, borderRadius: 12, border: `1px solid ${COLORES.borde}`, padding: 24, display: "grid", gap: 16 }}>
          {paso === 1 && <>
            <CampoForm label="Lugar de producción" value={datos.lugar} onChange={() => {}} placeholder="" error={null} disabled />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <CampoForm label="Departamento" value={datos.departamento} onChange={() => {}} placeholder="" disabled />
              <CampoForm label="Municipio" value={datos.municipio} onChange={() => {}} placeholder="" disabled />
            </div>
            <CampoForm label="Vereda" value={datos.vereda} onChange={() => {}} placeholder="" disabled />
          </>}
          {paso === 2 && <>
            <CampoForm label="Cultivos" value={datos.cultivo} onChange={() => {}} placeholder="" disabled />
            <CampoForm label="Cantidad de plantas totales" tipo="number" value={datos.plantas} onChange={v => setDatos({ ...datos, plantas: v })} placeholder="Ej: 255" error={errores.plantas} />
            <CampoForm label="Cantidad de lotes" value={datos.lotes} onChange={() => {}} placeholder="" disabled />
          </>}
          {paso === 3 && <>
  <div>
    <label style={{ fontSize: 11, fontWeight: 600, color: COLORES.textoMuted, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Observaciones *</label>
    <textarea value={datos.observaciones} onChange={e => setDatos({ ...datos, observaciones: e.target.value })} placeholder="Escriba las observaciones..."
      style={{ width: "100%", border: `1px solid ${errores.observaciones ? COLORES.rojo : COLORES.borde}`, borderRadius: 8, padding: "10px 12px", fontSize: 13, color: COLORES.texto, minHeight: 100, resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }} />
    {errores.observaciones && <span style={{ fontSize: 11, color: COLORES.rojo }}>Requerido</span>}
  </div>

  <div>
    <label style={{ fontSize: 11, fontWeight: 600, color: COLORES.textoMuted, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>🦗 Plaga Detectada</label>
    <select value={datos.plagaDetectada} onChange={e => setDatos({ ...datos, plagaDetectada: e.target.value })}
      style={{ width: "100%", border: `1px solid ${COLORES.borde}`, borderRadius: 8, padding: "9px 12px", fontSize: 13, outline: "none", background: COLORES.blanco, boxSizing: "border-box" }}>
      <option value="">Seleccione una plaga</option>
      <option>Broca</option>
      <option>Roya</option>
      <option>Gusano Cogollero</option>
      <option>Mosca Blanca</option>
      <option>Pulgón</option>
      <option>Trips</option>
      <option>Ácaros</option>
      <option>Sin plagas</option>
    </select>
  </div>

  <div>
    <label style={{ fontSize: 11, fontWeight: 600, color: COLORES.textoMuted, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>⚠️ Nivel de Riesgo</label>
    <div style={{ display: "flex", gap: 10 }}>
      {["Bajo", "Medio", "Alto"].map(nivel => (
        <button key={nivel} onClick={() => setDatos({ ...datos, nivelRiesgo: nivel })}
          style={{ flex: 1, padding: "9px", borderRadius: 8,
            border: `2px solid ${datos.nivelRiesgo === nivel ? (nivel === "Bajo" ? COLORES.verde : nivel === "Medio" ? COLORES.amarillo : COLORES.rojo) : COLORES.borde}`,
            background: datos.nivelRiesgo === nivel ? (nivel === "Bajo" ? "#C8E6C9" : nivel === "Medio" ? COLORES.amarilloPastel : COLORES.rojoPastel) : COLORES.blanco,
            color: datos.nivelRiesgo === nivel ? (nivel === "Bajo" ? "#1B5E20" : nivel === "Medio" ? "#B7770D" : COLORES.rojo) : COLORES.textoMuted,
            fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
          {nivel === "Bajo" ? "✅" : nivel === "Medio" ? "⚠️" : "🚨"} {nivel}
        </button>
      ))}
    </div>
  </div>

  <div>
    <label style={{ fontSize: 11, fontWeight: 600, color: COLORES.textoMuted, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Estado Fitosanitario</label>
    <select value={datos.estadoFitosanitario} onChange={e => setDatos({ ...datos, estadoFitosanitario: e.target.value })}
      style={{ width: "100%", border: `1px solid ${COLORES.borde}`, borderRadius: 8, padding: "9px 12px", fontSize: 13, outline: "none", background: COLORES.blanco, boxSizing: "border-box" }}>
      <option value="">Seleccione un estado</option>
      <option>Aprobado</option>
      <option>Con observaciones</option>
      <option>Alerta</option>
      <option>Rechazado</option>
    </select>
  </div>

  <CampoForm label="Fecha de inicio" tipo="date" value={datos.fechaInicio} onChange={v => setDatos({ ...datos, fechaInicio: v })} error={errores.fechaInicio} />
  <CampoForm label="Fecha de finalización" tipo="date" value={datos.fechaFin} onChange={v => setDatos({ ...datos, fechaFin: v })} error={errores.fechaFin} />
</>}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
          <button onClick={() => setPaso(p => Math.max(1, p - 1))} disabled={paso === 1} style={{ background: COLORES.grisPastel, color: COLORES.gris, border: "none", borderRadius: 8, padding: "10px 24px", fontSize: 13, fontWeight: 600, cursor: "pointer", opacity: paso === 1 ? 0.4 : 1 }}>← Anterior</button>
          <button onClick={siguiente} disabled={guardando} style={{ background: COLORES.verde, color: COLORES.blanco, border: "none", borderRadius: 8, padding: "10px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer", opacity: guardando ? 0.7 : 1 }}>
            {paso === 3 ? (guardando ? "Guardando..." : "✓ Guardar") : "Siguiente →"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [paginaActual, setPaginaActual] = useState("inicio");
  const [itemDetalle, setItemDetalle] = useState(null);
  const [itemLotes, setItemLotes] = useState(null);
  const [lotesReales, setLotesReales] = useState([]);
  const [formularioLote, setFormularioLote] = useState({ inspeccion: null, lote: null });
  const [mostrarAviso, setMostrarAviso] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(true);
const navigate = useNavigate()
  const [inspecciones, setInspecciones] = useState([]);

  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  useEffect(() => {
    fetch(`http://localhost:3000/api/inspecciones/inspecciones/tecnico/${usuario.id}`)
      .then(res => res.json())
      .then(data => setInspecciones(data))
      .catch(err => console.error(err));
  }, []);

  const navItems = [
    { id: "inicio",     label: "INICIO",                  icono: "🏠" },
    { id: "formulario", label: "FORMULARIO DE INSPECCIÓN", icono: "📋" },
    { id: "historial",  label: "HISTORIAL",                icono: "📁" },
  ];

  const abrirModalLotes = (insp) => {
    setItemLotes(insp);
    fetch(`http://localhost:3000/api/inspecciones/lotes/predio/${insp.predio_id}`)
      .then(res => res.json())
      .then(data => setLotesReales(data))
      .catch(err => console.error(err));
  };

const handleVerFormulario = (insp) => {
  if (insp.resultado === 'Completada') {
    abrirModalLotes(insp);
  } else {
    setPaginaActual("formulario");
  }
}

  const handleVolverDesdeLote = () => {
    const inspeccionGuardada = formularioLote.inspeccion;
    setFormularioLote({ inspeccion: null, lote: null });
    setItemLotes(inspeccionGuardada);
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", minHeight: "100vh", background: COLORES.grisPastel }}>

      {/* Header */}
      <header style={{ background: COLORES.verde, color: COLORES.blanco, padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 2px 12px rgba(0,0,0,0.18)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 8, width: 36, height: 36, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, flexShrink: 0 }}>
            {[0, 1, 2].map(i => <span key={i} style={{ display: "block", width: 18, height: 2, background: COLORES.blanco, borderRadius: 2 }} />)}
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 30, height: 30, background: "rgba(255,255,255,0.2)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🌱</div>
            <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: -0.5 }}>Asistente Técnico</span>
          </div>
        </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
  <span style={{ fontSize: 13, opacity: 0.85 }}>
    {new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
  </span>
  <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>TÉ</div>
</div>
      </header>

      <div style={{ display: "flex", minHeight: "calc(100vh - 56px)" }}>

        {/* FIX SIDEBAR: ancho con minWidth fijo, texto no se corta en transición */}
        <aside style={{
          width: menuAbierto ? 230 : 56,
          minWidth: menuAbierto ? 230 : 56,
          background: COLORES.blanco,
          borderRight: `1px solid ${COLORES.borde}`,
          flexShrink: 0,
          transition: "width 0.25s ease, min-width 0.25s ease",
          overflow: "hidden",
        }}>
          <div style={{ padding: "12px 16px", background: "#A5D6A7", borderBottom: `1px solid ${COLORES.borde}`, whiteSpace: "nowrap", minWidth: 230 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#1B5E20", textTransform: "uppercase", letterSpacing: 1 }}>
              {menuAbierto ? "TÉCNICO" : "TÉ"}
            </div>
          </div>
          <nav style={{ padding: "12px 0" }}>
            {navItems.map(item => (
              <button key={item.id} onClick={() => setPaginaActual(item.id)} style={{
                display: "flex", alignItems: "center", gap: 12, width: "100%",
                padding: menuAbierto ? "13px 16px" : "13px 0",
                justifyContent: menuAbierto ? "flex-start" : "center",
                border: "none", background: paginaActual === item.id ? "#C8E6C9" : "transparent",
                color: paginaActual === item.id ? COLORES.verde : COLORES.gris,
                cursor: "pointer", fontWeight: paginaActual === item.id ? 700 : 500,
                fontSize: 12, textAlign: "left", whiteSpace: "nowrap",
                borderLeft: menuAbierto ? (paginaActual === item.id ? `3px solid ${COLORES.verde}` : "3px solid transparent") : "none",
                transition: "all 0.15s",
              }}>
                <span style={{ fontSize: 17, flexShrink: 0 }}>{item.icono}</span>
                {menuAbierto && <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{item.label}</span>}
              </button>
            ))}
          </nav>

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

        {/* Contenido principal */}
        <main style={{ flex: 1, overflow: "auto" }}>
          {paginaActual === "inicio" && <PaginaInicio inspecciones={inspecciones} onVerDetalle={setItemDetalle} onVerFormulario={handleVerFormulario} />}
          {paginaActual === "historial" && <PaginaHistorial onVerDetalle={setItemDetalle} onVerFormulario={handleVerFormulario} />}
          {paginaActual === "formulario" && (
  <PaginaFormulario 
    inspecciones={inspecciones.filter(i => {
      if (!i.fechaInspeccion) return false;
      const fecha = new Date(i.fechaInspeccion);
      const hoy = new Date();
      return fecha.getUTCFullYear() === hoy.getFullYear() &&
             fecha.getUTCMonth() === hoy.getMonth() &&
             fecha.getUTCDate() === hoy.getDate();
    })} 
  />
)}
        </main>
      </div>

      {/* Modales */}
      {mostrarAviso && <ModalAviso onClose={() => setMostrarAviso(false)} />}
      {itemDetalle && <ModalDetalle item={itemDetalle} onClose={() => setItemDetalle(null)} />}
      {itemLotes && (
 <ModalLotes
  item={itemLotes}
  lotes={lotesReales}
  esCompletada={itemLotes?.resultado === 'Completada'}
  onClose={() => setItemLotes(null)}
  onAbrirFormularioLote={(insp, lote) => {
    setItemLotes(null);
    setFormularioLote({ inspeccion: insp, lote });
  }}
/>
)}
      {formularioLote.inspeccion && (
        <ModalFormularioLote
          inspeccion={formularioLote.inspeccion}
          lote={formularioLote.lote}
          onClose={() => setFormularioLote({ inspeccion: null, lote: null })}
          onVolver={handleVolverDesdeLote}
        />
      )}
    </div>
  );
}