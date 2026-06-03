import { useState, useEffect, useRef } from 'react'
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
          <div key={d} style={{ fontSize: 15, fontWeight: 600, color: "#607D8B", padding: "8px 0" }}>{d}</div>
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
      <div style={{ marginTop: 12, display: "flex", gap: 12, fontSize: 13 }}>
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
    <span style={{ background: s.bg, color: s.color, fontSize: 13, fontWeight: 600, padding: "3px 10px", borderRadius: 20, whiteSpace: "nowrap" }}>
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
        <p style={{ fontSize: 15, color: COLORES.texto, margin: "0 0 28px", lineHeight: 1.6 }}>El formulario no está disponible en este momento</p>
        <button onClick={onClose} style={{ background: COLORES.verde, color: COLORES.blanco, border: "none", borderRadius: 8, padding: "11px 36px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Aceptar</button>
      </div>
    </div>
  );
}

function InfoFila({ label, valor }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <span style={{ fontSize: 13, color: COLORES.textoMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</span>
      <span style={{ fontSize: 14, color: COLORES.texto, fontWeight: 500 }}>{valor}</span>
    </div>
  );
}

function ModalDetalle({ item, onClose }) {
  if (!item) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div style={{ background: COLORES.blanco, borderRadius: 16, padding: 28, width: 420, maxWidth: "90vw", boxShadow: "0 8px 40px rgba(0,0,0,0.18)", maxHeight: "90vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: COLORES.verdeClaro, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Lugar de producción</div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: COLORES.texto }}>{item.lugarproduccion}</h2>
          </div>
          <button onClick={onClose} style={{ background: COLORES.grisPastel, border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 18, color: COLORES.gris }}>×</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
          <InfoFila label="Predio" valor={item.lugar} />
          <InfoFila label="Cultivos" valor={item.cultivos} />
          <InfoFila label="Vereda" valor={item.vereda} />
          <InfoFila label="Municipio" valor={item.municipio} />
          <InfoFila label="Departamento" valor={item.departamento} />
          <InfoFila label="Productor" valor={item.nombreProductor || 'Sin información'} />
        </div>
        <div style={{ borderTop: `1px solid ${COLORES.borde}`, paddingTop: 16 }}>
          <span style={{ fontSize: 11, color: COLORES.textoMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>Ubicación en mapa</span>
          <div style={{ marginTop: 8, borderRadius: 10, overflow: "hidden", border: `1px solid ${COLORES.borde}` }}>
            <iframe title="ubicacion" width="100%" height="200" style={{ border: 0, display: "block" }} loading="lazy" allowFullScreen
              src={`https://maps.google.com/maps?q=${encodeURIComponent(`${item.vereda}, ${item.municipio}, ${item.departamento}, Colombia`)}&output=embed`}/>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10, fontSize: 12, color: COLORES.textoMuted }}>
            <span>📍</span>
            <span style={{ fontSize: 14, color: COLORES.textoMuted, fontWeight: 500 }}>{item.departamento} · {item.municipio} · {item.vereda}</span>
          </div>
        </div>
        <button onClick={onClose} style={{ marginTop: 20, background: "none", border: "none", color: COLORES.verde, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>← Volver</button>
      </div>
    </div>
  );
}

function ModalLotes({ item, lotes, onClose, onAbrirFormularioLote, esCompletada }) {
  const [lotesDetalle, setLotesDetalle] = useState([]);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);

  useEffect(() => {
    if (!esCompletada || !item?.id) return;
    setCargandoDetalle(true);
    fetch(`https://proyectointegrador5.onrender.com/api/inspecciones/inspecciones/${item.id}/lotes`)
      .then(res => res.json())
      .then(data => setLotesDetalle(Array.isArray(data) ? data : []))
      .catch(err => console.error(err))
      .finally(() => setCargandoDetalle(false));
  }, [esCompletada, item?.id]);

  if (!item) return null;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div style={{ background: COLORES.blanco, borderRadius: 16, padding: 28, width: 540, maxWidth: "90vw", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: COLORES.texto }}>{esCompletada ? "Resultado de inspección" : "Formularios"}</h2>
          <button onClick={onClose} style={{ background: COLORES.grisPastel, border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 18, color: COLORES.gris }}>×</button>
        </div>
        <p style={{ margin: "0 0 16px", fontSize: 15, color: COLORES.textoMuted }}>
          Lugar de producción: <strong style={{ color: COLORES.texto }}>{item.lugarproduccion || item.lugar}</strong>
        </p>
        {esCompletada && (
          <div style={{ display: "grid", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, background: COLORES.grisPastel, borderRadius: 10, padding: "14px 16px" }}>
              <InfoFila label="Fecha inspección" valor={item.fechaInspeccion ? new Date(item.fechaInspeccion).toLocaleDateString('es-CO') : '—'} />
              <InfoFila label="Fecha finalización" valor={item.fechaFin ? new Date(item.fechaFin).toLocaleDateString('es-CO') : '—'} />
              <InfoFila label="Nivel de riesgo" valor={item.nivelRiesgo || '—'} />
              <InfoFila label="Estado fitosanitario" valor={item.estadoFitosanitario || '—'} />
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: COLORES.textoMuted, textTransform: "uppercase", letterSpacing: 0.5 }}>Detalle por lote</div>
            {cargandoDetalle && <p style={{ fontSize: 14, color: COLORES.textoMuted, margin: 0 }}>Cargando lotes...</p>}
            {!cargandoDetalle && lotesDetalle.length === 0 && <p style={{ fontSize: 14, color: COLORES.textoMuted, margin: 0 }}>Sin detalle por lote registrado.</p>}
            {lotesDetalle.map(lote => (
              <div key={lote.id} style={{ borderRadius: 10, border: `1px solid ${COLORES.borde}`, overflow: "hidden" }}>
                <div style={{ background: "#A5D6A7", padding: "8px 14px", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 16 }}>🌿</span>
                  <span style={{ fontWeight: 700, fontSize: 14, color: "#1B5E20" }}>{lote.nombreLote || `Lote #${lote.lote_id}`}</span>
                </div>
                <div style={{ padding: "12px 14px", display: "grid", gap: 10 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: COLORES.textoMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Observaciones</div>
                    <div style={{ fontSize: 14, color: COLORES.texto }}>{lote.observaciones || "Sin observaciones"}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: COLORES.textoMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>🦗 Plagas detectadas</div>
                    {lote.plagasDetectadas ? (
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {lote.plagasDetectadas.split(",").map((p, pi) => (
                          <span key={pi} style={{ background: COLORES.rojoPastel, color: COLORES.rojo, fontSize: 13, fontWeight: 600, padding: "3px 10px", borderRadius: 20 }}>{p.trim()}</span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ fontSize: 14, color: "#2E7D32", fontWeight: 600 }}>✅ Sin plagas</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {!esCompletada && (
          <>
            <p style={{ margin: "0 0 16px", fontSize: 15, color: COLORES.textoMuted }}>Cantidad de lotes: <strong>{lotes.length}</strong></p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr 1fr", gap: 8, padding: "8px 12px", background: "#C8E6C9", borderRadius: 8, fontSize: 13, fontWeight: 700, color: "#1B5E20", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>
              <span>Lote</span><span>Estado</span><span style={{ textAlign: "right" }}>Ver informe</span>
            </div>
            <div style={{ display: "grid", gap: 6 }}>
              {lotes.map(lote => (
                <div key={lote.id} style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr 1fr", gap: 8, alignItems: "center", padding: "10px 12px", borderRadius: 8, border: `1px solid ${COLORES.borde}` }}>
                  <div>
                    <span style={{ fontWeight: 600, fontSize: 15, color: COLORES.texto }}>{lote.nombre}</span>
                    {lote.cultivos && <div style={{ fontSize: 13, color: COLORES.textoMuted, marginTop: 2 }}>🌱 {lote.cultivos}</div>}
                  </div>
                  <Badge estado={lote.estado} />
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button onClick={() => onAbrirFormularioLote(item, lote)}
                      style={{ background: lote.estado === "PENDIENTE" ? COLORES.grisPastel : lote.estado === "EN PROCESO" ? COLORES.azul : COLORES.verde, color: lote.estado === "PENDIENTE" ? COLORES.gris : COLORES.blanco, border: "none", borderRadius: 6, padding: "5px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                      {lote.estado === "EN PROCESO" ? "SEGUIR" : lote.estado === "PENDIENTE" ? "+" : "VER"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        <button onClick={onClose} style={{ marginTop: 20, background: COLORES.grisPastel, color: COLORES.gris, border: "none", borderRadius: 8, padding: "10px 24px", fontSize: 15, fontWeight: 600, cursor: "pointer", width: "100%" }}>Cerrar</button>
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
      const res = await fetch(`https://proyectointegrador5.onrender.com/api/inspecciones/inspecciones/${inspeccion.id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fechaInspeccion: new Date().toISOString().split('T')[0], observaciones: `Lote ${lote.nombre} inspeccionado`, resultado: 'En proceso' })
      });
      if (!res.ok) throw new Error('Error al guardar');
      setGuardado(true);
      setTimeout(() => onVolver(), 1500);
    } catch (err) { console.error(err); }
    finally { setGuardando(false); }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 150, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div style={{ background: COLORES.blanco, borderRadius: 16, padding: 28, width: 480, maxWidth: "90vw", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 8px 40px rgba(0,0,0,0.2)" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: COLORES.verdeClaro, textTransform: "uppercase", letterSpacing: 1 }}>Formulario · {lote.nombre}</div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: COLORES.texto }}>{inspeccion.lugar}</h2>
          </div>
          <button onClick={onClose} style={{ background: COLORES.grisPastel, border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 18, color: COLORES.gris }}>×</button>
        </div>
        <div style={{ display: "grid", gap: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15 }}>
            <span style={{ color: COLORES.textoMuted }}>Número de lote</span><strong>{form.numeroLote}</strong>
          </div>
          {cultivos.map((c, i) => (
            <div key={i} style={{ background: i % 2 === 0 ? "#C8E6C9" : COLORES.azulPastel, borderRadius: 10, padding: "14px 16px", display: "grid", gap: 10 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: i % 2 === 0 ? "#1B5E20" : COLORES.azul }}>Cultivo {i + 1}</div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15 }}><span style={{ color: COLORES.textoMuted }}>Nombre</span><strong>{c}</strong></div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15 }}><span style={{ color: COLORES.textoMuted }}>Cantidad</span><strong>{form.cantidades[i]}</strong></div>
            </div>
          ))}
          <div style={{ borderTop: `1px solid ${COLORES.borde}`, paddingTop: 16 }}>
            <div style={{ background: "#C8E6C9", borderRadius: 8, padding: "12px 16px", display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 15, color: "#2E7D32" }}>Total plantas</span>
              <strong style={{ color: "#1B5E20" }}>{form.plantacionTotal}</strong>
            </div>
          </div>
        </div>
        {guardado && <div style={{ background: "#C8E6C9", borderRadius: 8, padding: "10px 14px", textAlign: "center", color: "#1B5E20", fontWeight: 600, fontSize: 15, marginTop: 16 }}>✓ Guardado exitosamente</div>}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
          <button onClick={onVolver} style={{ background: COLORES.grisPastel, color: COLORES.gris, border: "none", borderRadius: 8, padding: "10px 24px", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>← Volver</button>
          <button onClick={handleConfirmar} disabled={guardando} style={{ background: COLORES.verde, color: COLORES.blanco, border: "none", borderRadius: 8, padding: "10px 28px", fontSize: 15, fontWeight: 700, cursor: "pointer", opacity: guardando ? 0.7 : 1 }}>
            {guardando ? 'Guardando...' : 'Confirmar ✓'}
          </button>
        </div>
      </div>
    </div>
  );
}

function PaginaInicio({ inspecciones, onVerDetalle, onVerFormulario, onVerProgreso }) {
  const [esMobil, setEsMobil] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setEsMobil(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const pendientes = inspecciones.filter(i => i.resultado !== 'Completada');

  return (
    <div style={{ padding: esMobil ? "14px" : "24px 28px" }}>
      <div style={{ width: "100%", background: "#A5D6A7", padding: "14px 0", marginBottom: 16, borderBottom: `1px solid ${COLORES.borde}`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 4, height: "100%", background: COLORES.verde, borderTopRightRadius: 4, borderBottomRightRadius: 4 }} />
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1B5E20" }}>Calendario</h2>
      </div>
      <Calendario inspecciones={inspecciones} />
      <div style={{ marginTop: 14, marginBottom: 28, background: "#A5D6A7", borderRadius: 10, padding: "12px 16px", textAlign: "center" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#1B5E20", marginBottom: 3 }}>HOY</div>
        <div style={{ fontSize: esMobil ? 13 : 15, fontWeight: 700, color: "#1B5E20" }}>
          {new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
        <div style={{ fontSize: 13, color: "#2E7D32", marginTop: 4 }}>{pendientes.length} inspecciones programadas</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <div style={{ width: 4, height: 22, background: COLORES.verde, borderRadius: 2 }} />
        <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: COLORES.texto }}>Lista de inspecciones por realizar</h2>
      </div>
      {esMobil ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {pendientes.length === 0 ? (
            <div style={{ padding: "28px 0", textAlign: "center", color: COLORES.textoMuted, fontSize: 14 }}>No hay inspecciones pendientes</div>
          ) : pendientes.map(insp => (
            <div key={insp.id} style={{ background: COLORES.blanco, border: `1px solid ${COLORES.borde}`, borderRadius: 12, padding: "13px 14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: COLORES.texto, flex: 1, marginRight: 8 }}>{insp.lugarproduccion}</div>
                <Badge estado={insp.estado} />
              </div>
              <div style={{ fontSize: 12, color: COLORES.textoMuted, marginBottom: 12 }}>
                📅 {insp.fechaInspeccion ? new Date(insp.fechaInspeccion).toLocaleDateString('es-CO') : 'Sin fecha'}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => onVerProgreso(insp)} style={{ flex: 1, background: "#C8E6C9", color: "#1B5E20", border: "none", borderRadius: 8, padding: "8px 0", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Ver progreso</button>
                <button onClick={() => onVerFormulario(insp)} style={{ flex: 1, background: insp.disponible ? COLORES.verde : COLORES.grisPastel, color: insp.disponible ? COLORES.blanco : COLORES.gris, border: "none", borderRadius: 8, padding: "8px 0", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Formulario</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ background: COLORES.blanco, borderRadius: 12, border: `1px solid ${COLORES.borde}`, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 140px 90px 110px", gap: 8, padding: "10px 18px", background: "#A5D6A7", fontSize: 13, fontWeight: 700, color: "#1B5E20", textTransform: "uppercase", letterSpacing: 0.5 }}>
            <span>Lugar de producción</span><span>Fecha de inspección</span><span>Estado</span><span>Detalles</span><span>Formulario</span>
          </div>
          {pendientes.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: COLORES.textoMuted, fontSize: 14 }}>No hay inspecciones pendientes</div>
          ) : pendientes.map(insp => (
            <div key={insp.id} style={{ display: "grid", gridTemplateColumns: "2fr 2fr 140px 90px 110px", gap: 8, alignItems: "center", padding: "12px 18px", borderTop: `1px solid ${COLORES.borde}`, background: COLORES.blanco }}>
              <span style={{ fontWeight: 600, fontSize: 14, color: COLORES.texto }}>{insp.lugarproduccion}</span>
              <span style={{ fontSize: 13, color: COLORES.textoMuted }}>{insp.fechaInspeccion ? new Date(insp.fechaInspeccion).toLocaleDateString('es-CO') : 'Sin fecha'}</span>
              <Badge estado={insp.estado} />
              <button onClick={() => onVerProgreso(insp)} style={{ background: "#C8E6C9", color: "#1B5E20", border: "none", borderRadius: 6, padding: "5px 10px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>VER</button>
              <button onClick={() => onVerFormulario(insp)} style={{ background: insp.disponible ? COLORES.verde : COLORES.grisPastel, color: insp.disponible ? COLORES.blanco : COLORES.gris, border: "none", borderRadius: 6, padding: "5px 10px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>VER</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PaginaHistorial({ onVerDetalle, onVerFormulario }) {
  const [busqueda, setBusqueda] = useState("");
  const [historialReal, setHistorialReal] = useState([]);
  const [esMobil, setEsMobil] = useState(window.innerWidth < 768);
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  useEffect(() => {
    const handleResize = () => setEsMobil(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetch(`https://proyectointegrador5.onrender.com/api/inspecciones/inspecciones/tecnico/${usuario.id}`)
      .then(res => res.json())
      .then(data => setHistorialReal(data.filter(i => i.resultado === 'Completada')))
      .catch(err => console.error(err));
  }, []);

  const filtrados = historialReal.filter(h => h.lugar?.toLowerCase().includes(busqueda.toLowerCase()));

  return (
    <div style={{ padding: esMobil ? "14px" : "24px 28px" }}>
      <div style={{ display: "flex", flexDirection: esMobil ? "column" : "row", justifyContent: "space-between", alignItems: esMobil ? "stretch" : "center", gap: 12, marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 4, height: 22, background: COLORES.verde, borderRadius: 2 }} />
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: COLORES.texto }}>Historial de inspecciones</h2>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input placeholder="Buscar lugar..." value={busqueda} onChange={e => setBusqueda(e.target.value)}
            style={{ border: `1px solid ${COLORES.borde}`, borderRadius: 8, padding: "7px 12px", fontSize: 14, outline: "none", flex: 1, minWidth: 0 }} />
          <button style={{ background: COLORES.verde, color: COLORES.blanco, border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer", flexShrink: 0 }}>Filtrar</button>
        </div>
      </div>
      {esMobil ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtrados.length === 0 ? (
            <div style={{ padding: "28px 0", textAlign: "center", color: COLORES.textoMuted, fontSize: 14 }}>No hay inspecciones completadas</div>
          ) : filtrados.map(h => (
            <div key={h.id} style={{ background: COLORES.blanco, border: `1px solid ${COLORES.borde}`, borderRadius: 12, padding: "13px 14px" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: COLORES.texto, marginBottom: 8 }}>{h.lugar}</div>
              <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 11, color: COLORES.textoMuted, fontWeight: 600, textTransform: "uppercase", marginBottom: 2 }}>Inicio</div>
                  <div style={{ fontSize: 13, color: COLORES.texto, fontWeight: 500 }}>{h.fechaInspeccion ? new Date(h.fechaInspeccion).toLocaleDateString('es-CO') : '—'}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: COLORES.textoMuted, fontWeight: 600, textTransform: "uppercase", marginBottom: 2 }}>Finalización</div>
                  <div style={{ fontSize: 13, color: COLORES.texto, fontWeight: 500 }}>{h.fechaFin ? new Date(h.fechaFin).toLocaleDateString('es-CO') : '—'}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: COLORES.textoMuted, fontWeight: 600, textTransform: "uppercase", marginBottom: 2 }}>Estado</div>
                  <span style={{ background: "#C8E6C9", color: "#1B5E20", fontSize: 12, fontWeight: 700, padding: "2px 10px", borderRadius: 20 }}>Completada</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => onVerDetalle(h)} style={{ flex: 1, background: COLORES.grisPastel, color: COLORES.gris, border: "none", borderRadius: 8, padding: "8px 0", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Detalles</button>
                <button onClick={() => onVerFormulario(h)} style={{ flex: 1, background: "#C8E6C9", color: "#1B5E20", border: "none", borderRadius: 8, padding: "8px 0", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Ver resultado</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ background: COLORES.blanco, borderRadius: 12, border: `1px solid ${COLORES.borde}`, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1.4fr 1.4fr auto auto", gap: 8, padding: "10px 16px", background: "#A5D6A7", fontSize: 13, fontWeight: 700, color: "#1B5E20", textTransform: "uppercase", letterSpacing: 0.5 }}>
            <span>Lugar de producción</span><span>Fecha inspección</span><span>Fecha finalización</span><span>Detalle</span><span>Formulario</span>
          </div>
          {filtrados.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: COLORES.textoMuted, fontSize: 14 }}>No hay inspecciones completadas</div>
          ) : filtrados.map((h, i) => (
            <div key={h.id} style={{ display: "grid", gridTemplateColumns: "2fr 1.4fr 1.4fr auto auto", gap: 8, alignItems: "center", padding: "12px 16px", borderTop: i === 0 ? "none" : `1px solid ${COLORES.borde}` }}>
              <span style={{ fontWeight: 600, fontSize: 14, color: COLORES.texto }}>{h.lugar}</span>
              <span style={{ fontSize: 13, color: COLORES.textoMuted }}>{h.fechaInspeccion ? new Date(h.fechaInspeccion).toLocaleDateString('es-CO') : '—'}</span>
              <span style={{ fontSize: 13, color: COLORES.textoMuted }}>{h.fechaFin ? new Date(h.fechaFin).toLocaleDateString('es-CO') : '—'}</span>
              <button onClick={() => onVerDetalle(h)} style={{ background: COLORES.grisPastel, color: COLORES.gris, border: "none", borderRadius: 6, padding: "5px 10px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>DETALLES</button>
              <button onClick={() => onVerFormulario(h)} style={{ background: "#C8E6C9", color: "#1B5E20", border: "none", borderRadius: 6, padding: "5px 10px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>VER</button>
            </div>
          ))}
        </div>
      )}
      <div style={{ marginTop: 10, fontSize: 13, color: COLORES.textoMuted, textAlign: "right" }}>{filtrados.length} registros encontrados</div>
    </div>
  );
}

function PaginaFormulario({ inspecciones, onGuardado }) {
  const inspeccionHoy = inspecciones?.[0] || null;
  const [esMobil, setEsMobil] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setEsMobil(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const PLAGAS_LISTA = ["Broca","Roya","Gusano Cogollero","Mosca Blanca","Pulgón","Trips","Ácaros","Sin plagas"];
  const [infoLugar, setInfoLugar] = useState({ lugar: "", departamento: "", municipio: "", vereda: "", cultivos: [] });
  const [lotes, setLotes] = useState([]);
  const [inspeccionLotes, setInspeccionLotes] = useState({});
  const [fechaInicio, setFechaInicio] = useState("");
  const [nivelRiesgo, setNivelRiesgo] = useState("Bajo");
  const [estadoFitosanitario, setEstadoFitosanitario] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [autoGuardado, setAutoGuardado] = useState(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!inspeccionHoy) return;
    setInfoLugar({
      lugar: inspeccionHoy.lugar || inspeccionHoy.lugarproduccion || "",
      departamento: inspeccionHoy.departamento || "",
      municipio: inspeccionHoy.municipio || "",
      vereda: inspeccionHoy.vereda || "",
      cultivos: inspeccionHoy.cultivos ? inspeccionHoy.cultivos.split(",").map(c => c.trim()) : [],
    });
    setFechaInicio(inspeccionHoy.fechaInspeccion ? new Date(inspeccionHoy.fechaInspeccion).toISOString().split('T')[0] : "");
    fetch(`https://proyectointegrador5.onrender.com/api/inspecciones/lotes/predio/${inspeccionHoy.predio_id}`)
      .then(res => res.json())
      .then(lotesData => {
        const lotesArr = Array.isArray(lotesData) ? lotesData : [];
        setLotes(lotesArr);
        fetch(`https://proyectointegrador5.onrender.com/api/inspecciones/inspecciones/${inspeccionHoy.id}/progreso`)
          .then(res => res.json())
          .then(progreso => {
            if (progreso?.datos) {
              const d = progreso.datos;
              if (d.inspeccionLotes) setInspeccionLotes(d.inspeccionLotes);
              if (d.nivelRiesgo) setNivelRiesgo(d.nivelRiesgo);
              if (d.estadoFitosanitario) setEstadoFitosanitario(d.estadoFitosanitario);
            } else {
              const init = {};
              lotesArr.forEach(l => { init[l.id] = { observaciones: "", plagas: [""], cantidadPlantas: "" }; });
              setInspeccionLotes(init);
            }
          })
          .catch(() => {
            const init = {};
            lotesArr.forEach(l => { init[l.id] = { observaciones: "", plagas: [""], cantidadPlantas: "" }; });
            setInspeccionLotes(init);
          });
      })
      .catch(err => console.error(err));
  }, [inspeccionHoy?.id]);

  useEffect(() => {
    if (!inspeccionHoy?.id || Object.keys(inspeccionLotes).length === 0) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setAutoGuardado("guardando");
    debounceRef.current = setTimeout(async () => {
      try {
        await fetch(`https://proyectointegrador5.onrender.com/api/inspecciones/inspecciones/${inspeccionHoy.id}/progreso`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ datos: { inspeccionLotes, nivelRiesgo, estadoFitosanitario } }),
        });
        setAutoGuardado("guardado");
        setTimeout(() => setAutoGuardado(null), 2000);
      } catch (err) { console.error("Error autoguardado:", err); setAutoGuardado(null); }
    }, 2000);
    return () => clearTimeout(debounceRef.current);
  }, [inspeccionLotes, nivelRiesgo, estadoFitosanitario, inspeccionHoy?.id]);

  const setObsLote = (loteId, valor) => setInspeccionLotes(prev => ({ ...prev, [loteId]: { ...prev[loteId], observaciones: valor } }));
  const setPlagaLote = (loteId, index, valor) => setInspeccionLotes(prev => {
    const plagas = [...(prev[loteId]?.plagas || [""])];
    plagas[index] = valor;
    return { ...prev, [loteId]: { ...prev[loteId], plagas } };
  });
  const agregarPlagaLote = (loteId) => setInspeccionLotes(prev => {
    const plagas = prev[loteId]?.plagas || [""];
    if (plagas.length >= 5) return prev;
    return { ...prev, [loteId]: { ...prev[loteId], plagas: [...plagas, ""] } };
  });
  const eliminarPlagaLote = (loteId, index) => setInspeccionLotes(prev => {
    const plagas = (prev[loteId]?.plagas || [""]).filter((_, i) => i !== index);
    return { ...prev, [loteId]: { ...prev[loteId], plagas: plagas.length ? plagas : [""] } };
  });

  if (!inspeccionHoy) return (
    <div style={{ padding: "28px 16px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
      <h2 style={{ color: COLORES.texto, fontWeight: 700, margin: 0, textAlign: "center" }}>No hay inspecciones pendientes</h2>
      <p style={{ color: COLORES.textoMuted, marginTop: 8, textAlign: "center" }}>Cuando tengas una inspección asignada aparecerá aquí.</p>
    </div>
  );

  const guardar = async () => {
    setGuardando(true);
    const hoy = new Date().toISOString().split('T')[0];
    try {
      const res = await fetch(`https://proyectointegrador5.onrender.com/api/inspecciones/inspecciones/${inspeccionHoy.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fechaInspeccion: fechaInicio, fechaFin: hoy, observaciones: "Inspección por lotes completada", resultado: "Completada", estado: "completada", plagaDetectada: "Ver detalle por lote", nivelRiesgo, estadoFitosanitario }),
      });
      if (!res.ok) throw new Error("Error al guardar inspección");
      const lotesPayload = lotes.map(lote => {
        const d = inspeccionLotes[lote.id] || { observaciones: "", plagas: [""], cantidadPlantas: "" };
        return { lote_id: lote.id, observaciones: d.observaciones || "", plagasDetectadas: d.plagas.filter(Boolean).join(", ") || "Sin plagas", cantidadPlantas: d.cantidadPlantas || null };
      });
      const res2 = await fetch(`https://proyectointegrador5.onrender.com/api/inspecciones/inspecciones/lotes`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inspeccion_id: inspeccionHoy.id, lotes: lotesPayload }),
      });
      if (!res2.ok) throw new Error("Error al guardar lotes");
      await fetch(`https://proyectointegrador5.onrender.com/api/inspecciones/inspecciones/${inspeccionHoy.id}/progreso`, { method: "DELETE" });
      setGuardado(true);
      setTimeout(() => onGuardado(), 2000);
    } catch (err) { console.error(err); }
    finally { setGuardando(false); }
  };

  if (guardado) return (
    <div style={{ padding: "28px 16px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
      <h2 style={{ color: COLORES.verde, fontWeight: 700, margin: 0 }}>Inspección guardada</h2>
      <p style={{ color: COLORES.textoMuted, marginTop: 8 }}>La inspección ha sido registrada exitosamente.</p>
    </div>
  );

  const inputReadonly = { width: "100%", border: `1px solid ${COLORES.borde}`, borderRadius: 8, padding: "8px 12px", fontSize: 14, color: COLORES.textoMuted, background: "#F5F5F5", boxSizing: "border-box", outline: "none" };
  const labelStyle = { fontSize: 12, color: COLORES.textoMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 6 };
  const seccionHeader = (texto) => (
    <div style={{ fontSize: 11, fontWeight: 700, color: COLORES.verde, textTransform: "uppercase", letterSpacing: 1, marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ width: 3, height: 14, background: COLORES.verde, borderRadius: 2 }} />{texto}
    </div>
  );

  return (
    <div style={{ padding: esMobil ? "14px" : "24px 28px" }}>
      <div style={{ background: "#A5D6A7", padding: "12px 16px", marginBottom: 20, borderRadius: esMobil ? 10 : 0, display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
        {!esMobil && <div style={{ position: "absolute", left: 0, top: 0, width: 4, height: "100%", background: COLORES.verde, borderTopRightRadius: 4, borderBottomRightRadius: 4 }} />}
        <h2 style={{ margin: 0, fontSize: esMobil ? 14 : 16, fontWeight: 700, color: "#1B5E20", paddingLeft: esMobil ? 0 : 12 }}>Formulario · {infoLugar.lugar}</h2>
        <div>
          {autoGuardado === "guardando" && <span style={{ fontSize: 12, color: "#2E7D32", fontWeight: 600 }}>💾 Guardando...</span>}
          {autoGuardado === "guardado" && <span style={{ fontSize: 12, color: "#2E7D32", fontWeight: 600 }}>✅ Guardado</span>}
        </div>
      </div>
      <div style={{ maxWidth: 720, margin: "0 auto", display: "grid", gap: 16 }}>
        <div style={{ background: COLORES.blanco, borderRadius: 12, border: `1px solid ${COLORES.borde}`, padding: esMobil ? 16 : 24 }}>
          {seccionHeader("Información general")}
          <div style={{ display: "grid", gap: 12 }}>
            <div><label style={labelStyle}>Lugar de producción</label><input readOnly value={infoLugar.lugar} style={inputReadonly} /></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div><label style={labelStyle}>Departamento</label><input readOnly value={infoLugar.departamento} style={inputReadonly} /></div>
              <div><label style={labelStyle}>Municipio</label><input readOnly value={infoLugar.municipio} style={inputReadonly} /></div>
            </div>
            <div><label style={labelStyle}>Vereda</label><input readOnly value={infoLugar.vereda} style={inputReadonly} /></div>
            <div>
              <label style={labelStyle}>Fecha de inspección</label>
              <input type="date" readOnly value={fechaInicio} style={inputReadonly} />
              <span style={{ fontSize: 11, color: COLORES.textoMuted, marginTop: 4, display: "block" }}>📅 La fecha de finalización se registra automáticamente al guardar.</span>
            </div>
          </div>
        </div>
        <div style={{ background: COLORES.blanco, borderRadius: 12, border: `1px solid ${COLORES.borde}`, padding: esMobil ? 16 : 24 }}>
          {seccionHeader("Cultivos del predio")}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {infoLugar.cultivos.length > 0 ? infoLugar.cultivos.map((c, i) => {
              const cols = [["#C8E6C9","#1B5E20"],["#E3F2FD","#1565C0"],["#FFF3E0","#E65100"],["#F3E5F5","#6A1B9A"]];
              const [bg, col] = cols[i % 4];
              return <span key={i} style={{ background: bg, color: col, fontSize: 13, fontWeight: 700, padding: "5px 14px", borderRadius: 20 }}>🌱 {c}</span>;
            }) : <span style={{ fontSize: 14, color: COLORES.textoMuted }}>Sin cultivos registrados</span>}
          </div>
        </div>
        <div style={{ background: COLORES.blanco, borderRadius: 12, border: `1px solid ${COLORES.borde}`, padding: esMobil ? 16 : 24 }}>
          {seccionHeader(`Inspección por lote (${lotes.length} lotes)`)}
          {lotes.length === 0 && <p style={{ color: COLORES.textoMuted, fontSize: 14 }}>No se encontraron lotes.</p>}
          <div style={{ display: "grid", gap: 14 }}>
            {lotes.map(lote => {
              const datosLote = inspeccionLotes[lote.id] || { observaciones: "", plagas: [""], cantidadPlantas: "" };
              return (
                <div key={lote.id} style={{ borderRadius: 10, border: `1px solid ${COLORES.borde}`, overflow: "hidden" }}>
                  <div style={{ background: "#A5D6A7", padding: "9px 14px", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 16 }}>🌿</span>
                    <span style={{ fontWeight: 700, fontSize: 14, color: "#1B5E20" }}>{lote.nombre}</span>
                    {lote.cultivos && <span style={{ fontSize: 12, color: "#2E7D32" }}>· {lote.cultivos}</span>}
                  </div>
                  <div style={{ padding: esMobil ? 12 : 16, display: "grid", gap: 12 }}>
                    <div>
                      <label style={labelStyle}>Observaciones (opcional)</label>
                      <textarea value={datosLote.observaciones} onChange={e => setObsLote(lote.id, e.target.value)} placeholder="Escriba observaciones para este lote..."
                        style={{ width: "100%", border: `1px solid ${COLORES.borde}`, borderRadius: 8, padding: "9px 12px", fontSize: 14, color: COLORES.texto, minHeight: 70, resize: "vertical", fontFamily: "inherit", boxSizing: "border-box", outline: "none", background: COLORES.blanco }} />
                    </div>
                    <div>
                      <label style={labelStyle}>🦗 Plagas detectadas (máx. 5)</label>
                      <div style={{ display: "grid", gap: 8 }}>
                        {datosLote.plagas.map((plaga, pIdx) => (
                          <div key={pIdx} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <select value={plaga} onChange={e => setPlagaLote(lote.id, pIdx, e.target.value)}
                              style={{ flex: 1, border: `1px solid ${COLORES.borde}`, borderRadius: 8, padding: "8px 10px", fontSize: 14, outline: "none", background: COLORES.blanco, boxSizing: "border-box" }}>
                              <option value="">Seleccione una plaga...</option>
                              {PLAGAS_LISTA.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                            {datosLote.plagas.length > 1 && (
                              <button onClick={() => eliminarPlagaLote(lote.id, pIdx)} style={{ background: COLORES.rojoPastel, color: COLORES.rojo, border: "none", borderRadius: 7, width: 32, height: 36, cursor: "pointer", fontWeight: 700, fontSize: 16, flexShrink: 0 }}>×</button>
                            )}
                          </div>
                        ))}
                        {datosLote.plagas.length < 5 && (
                          <button onClick={() => agregarPlagaLote(lote.id)} style={{ background: COLORES.azulPastel, color: COLORES.azul, border: `1px dashed ${COLORES.azul}`, borderRadius: 8, padding: "7px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer", width: "fit-content" }}>+ Agregar plaga</button>
                        )}
                      </div>
                    </div>
                    <div>
                      <label style={labelStyle}>🌱 Cantidad de plantas</label>
                      <input type="number" min="0" value={datosLote.cantidadPlantas || ""} onChange={e => setInspeccionLotes(prev => ({ ...prev, [lote.id]: { ...prev[lote.id], cantidadPlantas: e.target.value } }))} placeholder="Ej: 120"
                        style={{ width: "100%", border: `1px solid ${COLORES.borde}`, borderRadius: 8, padding: "8px 12px", fontSize: 14, outline: "none", boxSizing: "border-box", background: COLORES.blanco }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ background: COLORES.blanco, borderRadius: 12, border: `1px solid ${COLORES.borde}`, padding: esMobil ? 16 : 24 }}>
          {seccionHeader("Resultado de la inspección")}
          <div style={{ display: "grid", gap: 14 }}>
            <div>
              <label style={labelStyle}>⚠️ Nivel de riesgo</label>
              <div style={{ display: "flex", gap: 8 }}>
                {["Bajo","Medio","Alto"].map(nivel => (
                  <button key={nivel} onClick={() => setNivelRiesgo(nivel)} style={{ flex: 1, padding: esMobil ? "8px 4px" : "9px", borderRadius: 8, fontWeight: 700, fontSize: esMobil ? 13 : 15, cursor: "pointer",
                    border: `2px solid ${nivelRiesgo === nivel ? (nivel === "Bajo" ? COLORES.verde : nivel === "Medio" ? COLORES.amarillo : COLORES.rojo) : COLORES.borde}`,
                    background: nivelRiesgo === nivel ? (nivel === "Bajo" ? "#C8E6C9" : nivel === "Medio" ? COLORES.amarilloPastel : COLORES.rojoPastel) : COLORES.blanco,
                    color: nivelRiesgo === nivel ? (nivel === "Bajo" ? "#1B5E20" : nivel === "Medio" ? "#B7770D" : COLORES.rojo) : COLORES.textoMuted }}>
                    {nivel === "Bajo" ? "✅" : nivel === "Medio" ? "⚠️" : "🚨"} {nivel}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={labelStyle}>Estado fitosanitario</label>
              <select value={estadoFitosanitario} onChange={e => setEstadoFitosanitario(e.target.value)}
                style={{ width: "100%", border: `1px solid ${COLORES.borde}`, borderRadius: 8, padding: "9px 12px", fontSize: 14, outline: "none", background: COLORES.blanco, boxSizing: "border-box" }}>
                <option value="">Seleccione un estado</option>
                <option>Aprobado</option><option>Con observaciones</option><option>Alerta</option><option>Rechazado</option>
              </select>
            </div>
          </div>
        </div>
        <button onClick={guardar} disabled={guardando} style={{ background: COLORES.verde, color: COLORES.blanco, border: "none", borderRadius: 8, padding: esMobil ? "13px" : "14px", fontSize: esMobil ? 15 : 16, fontWeight: 700, cursor: "pointer", opacity: guardando ? 0.7 : 1 }}>
          {guardando ? "Guardando..." : "✓ Guardar inspección"}
        </button>
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
  const [menuAbierto, setMenuAbierto] = useState(false);
  const navigate = useNavigate();
  const [inspecciones, setInspecciones] = useState([]);
  const [inspeccionSeleccionada, setInspeccionSeleccionada] = useState(null);
  const [esMobil, setEsMobil] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setEsMobil(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  const cargarInspecciones = () => {
    fetch(`https://proyectointegrador5.onrender.com/api/inspecciones/inspecciones/tecnico/${usuario.id}`)
      .then(res => res.json())
      .then(data => setInspecciones(data.sort((a, b) => new Date(b.fechaInspeccion) - new Date(a.fechaInspeccion))))
      .catch(err => console.error(err));
  };

  useEffect(() => { cargarInspecciones(); }, []);

  const navItems = [
    { id: "inicio",     label: "INICIO",                  icono: "🏠" },
    { id: "formulario", label: "FORMULARIO DE INSPECCIÓN", icono: "📋" },
    { id: "historial",  label: "HISTORIAL",                icono: "📁" },
  ];

  const abrirModalLotes = (insp) => {
    setItemLotes(insp);
    fetch(`https://proyectointegrador5.onrender.com/api/inspecciones/lotes/predio/${insp.predio_id}`)
      .then(res => res.json())
      .then(data => setLotesReales(data))
      .catch(err => console.error(err));
  };

  const handleVerFormulario = (insp) => {
    if (insp.resultado === 'Completada') {
      abrirModalLotes(insp);
    } else {
      setInspeccionSeleccionada(insp);
      setPaginaActual("formulario");
    }
  };

  const handleVolverDesdeLote = () => {
    const inspeccionGuardada = formularioLote.inspeccion;
    setFormularioLote({ inspeccion: null, lote: null });
    setItemLotes(inspeccionGuardada);
  };

  const sidebarWidth = menuAbierto ? 230 : 56;

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", minHeight: "100vh", background: COLORES.grisPastel }}>

      {/* HEADER */}
      <header style={{ background: COLORES.verde, color: COLORES.blanco, padding: "0 16px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 2px 12px rgba(0,0,0,0.18)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => setMenuAbierto(!menuAbierto)}
            style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 8, width: 36, height: 36, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, flexShrink: 0 }}>
            {[0,1,2].map(i => <span key={i} style={{ display: "block", width: 18, height: 2, background: COLORES.blanco, borderRadius: 2 }} />)}
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <img src="/LogoICA.png" alt="Logo ICA" style={{ width: 30, height: 30, borderRadius: 8, objectFit: "cover" }} />
            <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: -0.5 }}>Asistente Técnico</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {!esMobil && <span style={{ fontSize: 13, opacity: 0.85 }}>{new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>}
          {!esMobil && (
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{usuario.nombre || "Técnico"}</div>
              <div style={{ fontSize: 12, opacity: 0.75 }}>Técnico inspector</div>
            </div>
          )}
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700 }}>
            {(usuario.nombre || "TÉ").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
          </div>
        </div>
      </header>

      {/* OVERLAY móvil */}
      {esMobil && menuAbierto && (
        <div onClick={() => setMenuAbierto(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 40 }} />
      )}

      {/* LAYOUT: sidebar + main en el mismo flex */}
      <div style={{ display: "flex", minHeight: "calc(100vh - 56px)" }}>

        {/* SIDEBAR */}
        <aside style={{
          width: esMobil ? 230 : sidebarWidth,
          minWidth: esMobil ? 230 : sidebarWidth,
          background: COLORES.blanco,
          borderRight: `1px solid ${COLORES.borde}`,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          position: esMobil ? "fixed" : "sticky",
          top: 56,
          left: 0,
          height: "calc(100vh - 56px)",
          zIndex: 41,
          transform: esMobil ? (menuAbierto ? "translateX(0)" : "translateX(-100%)") : "none",
          transition: esMobil ? "transform 0.25s ease" : "width 0.25s ease, min-width 0.25s ease",
          overflow: "hidden",
        }}>
          <div style={{ padding: "12px 16px", background: "#A5D6A7", borderBottom: `1px solid ${COLORES.borde}`, whiteSpace: "nowrap", minWidth: 230 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1B5E20", textTransform: "uppercase", letterSpacing: 1 }}>
              {menuAbierto ? "TÉCNICO" : ""}
            </div>
          </div>
          <nav style={{ padding: "12px 0", flex: 1 }}>
            {navItems.map(item => (
              <button key={item.id} onClick={() => {
                if (item.id === "formulario") setInspeccionSeleccionada(null);
                setPaginaActual(item.id);
                if (esMobil) setMenuAbierto(false);
              }} style={{
                display: "flex", alignItems: "center", gap: 12, width: "100%",
                padding: menuAbierto ? "13px 16px" : "13px 0",
                justifyContent: menuAbierto ? "flex-start" : "center",
                border: "none", background: paginaActual === item.id ? "#C8E6C9" : "transparent",
                color: paginaActual === item.id ? COLORES.verde : COLORES.gris,
                cursor: "pointer", fontWeight: paginaActual === item.id ? 700 : 500,
                fontSize: 14, textAlign: "left", whiteSpace: "nowrap",
                borderLeft: menuAbierto ? (paginaActual === item.id ? `3px solid ${COLORES.verde}` : "3px solid transparent") : "none",
                transition: "all 0.15s",
              }}>
                <span style={{ fontSize: 17, flexShrink: 0 }}>{item.icono}</span>
                {menuAbierto && <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{item.label}</span>}
              </button>
            ))}
          </nav>
          <div style={{ borderTop: `1px solid ${COLORES.borde}` }}>
            <button onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('usuario'); navigate('/', { replace: true }); }}
              style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: menuAbierto ? "14px 20px" : "14px 0", justifyContent: menuAbierto ? "flex-start" : "center", border: "none", background: "transparent", color: COLORES.rojo, cursor: "pointer", fontWeight: 600, fontSize: 14, whiteSpace: "nowrap" }}>
              <span style={{ fontSize: 17, flexShrink: 0 }}>🚪</span>
              {menuAbierto && <span>Cerrar sesión</span>}
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {paginaActual === "inicio" && (
            <PaginaInicio
              inspecciones={inspecciones}
              onVerDetalle={setItemDetalle}
              onVerFormulario={handleVerFormulario}
              onVerProgreso={(insp) => { setInspeccionSeleccionada(insp); setPaginaActual("formulario"); }}
            />
          )}
          {paginaActual === "historial" && <PaginaHistorial onVerDetalle={setItemDetalle} onVerFormulario={handleVerFormulario} />}
          {paginaActual === "formulario" && (
            <PaginaFormulario
              key={inspeccionSeleccionada?.id ?? 'default'}
              inspecciones={inspeccionSeleccionada ? [inspeccionSeleccionada] : inspecciones.filter(i => i.resultado !== 'Completada')}
              onGuardado={() => { cargarInspecciones(); setInspeccionSeleccionada(null); setPaginaActual("inicio"); }}
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
          onAbrirFormularioLote={(insp, lote) => { setItemLotes(null); setFormularioLote({ inspeccion: insp, lote }); }}
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
