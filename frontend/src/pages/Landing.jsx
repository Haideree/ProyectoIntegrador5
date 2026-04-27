import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const COLORES = {
  verde: "#2E7D32",
  verdeClaro: "#4CAF50",
  verdePastel: "#C8E6C9",
  blanco: "#FFFFFF",
  texto: "#1B2631",
  textoMuted: "#607D8B",
  borde: "#CFD8DC",
  grisPastel: "#ECEFF1",
}

const imagenes = [
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1400",
  "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=1400",
  "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1400",
]

const stats = [
  { label: "Cultivos inspeccionados", valor: "120+" },
  { label: "Predios registrados",     valor: "85"   },
  { label: "Cantidad exportada",      valor: "45 Ton"},
  { label: "Inspecciones realizadas", valor: "210"  },
]

const roles = [
  {
    titulo: "Administrador", icono: "🛡️",
    descripcion: "Gestiona el sistema. Puede registrar usuarios, administrar predios, supervisar inspecciones y generar reportes del estado fitosanitario de los cultivos."
  },
  {
    titulo: "Técnico", icono: "🔬",
    descripcion: "Realiza las inspecciones en los lugares de producción agrícola. Puede consultar inspecciones asignadas, registrar resultados y reportar posibles plagas detectadas."
  },
  {
    titulo: "Productor", icono: "🌾",
    descripcion: "Registra sus predios agrícolas y puede consultar los resultados de las inspecciones realizadas en sus cultivos."
  },
]

export default function Landing() {
  const [imagenActual, setImagenActual] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const intervalo = setInterval(() => {
      setImagenActual(i => (i + 1) % imagenes.length)
    }, 5000)
    return () => clearInterval(intervalo)
  }, [])

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", minHeight: '100vh' }}>

      {/* HEADER */}
      <header style={{ background: COLORES.verde, color: COLORES.blanco, padding: '0 32px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 2px 12px rgba(0,0,0,0.18)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 24 }}>🌱</span>
          <span style={{ fontWeight: 700, fontSize: 17 }}>Proyecto Integrador</span>
        </div>
        <nav style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <a href="#roles" style={{ color: COLORES.blanco, textDecoration: 'none', fontSize: 14, opacity: 0.9 }}>Roles</a>
          <a href="#sistema" style={{ color: COLORES.blanco, textDecoration: 'none', fontSize: 14, opacity: 0.9 }}>Nuestro sistema</a>
          <button onClick={() => navigate('/login')} style={{ background: COLORES.blanco, color: COLORES.verde, border: 'none', borderRadius: 8, padding: '8px 20px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            Iniciar sesión
          </button>
        </nav>
      </header>

      {/* CARRUSEL */}
      <section style={{ position: 'relative', height: 480, overflow: 'hidden' }}>
        {imagenes.map((img, i) => (
          <div key={i} style={{
            position: 'absolute', inset: 0,
            backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${img})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            opacity: i === imagenActual ? 1 : 0,
            transition: 'opacity 1s ease',
          }} />
        ))}
        <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: COLORES.blanco, textAlign: 'center', padding: '0 24px' }}>
          <h1 style={{ fontSize: 38, fontWeight: 800, margin: '0 0 16px', textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>Sistema de Inspecciones Fitosanitarias</h1>
          <p style={{ fontSize: 17, opacity: 0.9, maxWidth: 600, margin: '0 0 28px' }}>Gestión y supervisión de inspecciones en cultivos agrícolas</p>
          <button onClick={() => navigate('/login')} style={{ background: COLORES.verdeClaro, color: COLORES.blanco, border: 'none', borderRadius: 10, padding: '14px 36px', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
            Comenzar →
          </button>
        </div>
        {/* Puntos del carrusel */}
        <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, zIndex: 2 }}>
          {imagenes.map((_, i) => (
            <button key={i} onClick={() => setImagenActual(i)} style={{ width: i === imagenActual ? 24 : 8, height: 8, borderRadius: 4, background: COLORES.blanco, border: 'none', cursor: 'pointer', opacity: i === imagenActual ? 1 : 0.5, transition: 'all 0.3s' }} />
          ))}
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: COLORES.verde, padding: '32px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 12, padding: '20px 16px', textAlign: 'center', color: COLORES.blanco }}>
              <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>{s.valor}</div>
              <div style={{ fontSize: 12, opacity: 0.85 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* DESCRIPCIÓN */}
      <section id="sistema" style={{ padding: '60px 24px', background: COLORES.blanco }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: COLORES.texto, marginBottom: 16 }}>¿Qué hace nuestro sistema?</h2>
          <p style={{ fontSize: 15, color: COLORES.textoMuted, lineHeight: 1.8 }}>
            El sistema de inspecciones fitosanitarias permite registrar, gestionar y supervisar las inspecciones realizadas en cultivos agrícolas. Su objetivo es garantizar que los productos cumplan con las normas sanitarias necesarias para su exportación y comercialización. Además facilita el control de predios, cultivos e informes técnicos generados por los inspectores.
          </p>
        </div>
      </section>

      {/* ROLES */}
      <section id="roles" style={{ padding: '60px 24px', background: COLORES.grisPastel }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: COLORES.texto, textAlign: 'center', marginBottom: 32 }}>Roles del Sistema</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {roles.map((r, i) => (
              <div key={i} style={{ background: COLORES.blanco, borderRadius: 14, padding: 28, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', borderTop: `4px solid ${COLORES.verde}` }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{r.icono}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: COLORES.texto, marginBottom: 10 }}>{r.titulo}</h3>
                <p style={{ fontSize: 13, color: COLORES.textoMuted, lineHeight: 1.7 }}>{r.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: COLORES.texto, color: COLORES.blanco, padding: '40px 24px 20px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32, marginBottom: 32 }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>🌱 Proyecto Integrador</h3>
            <p style={{ fontSize: 13, opacity: 0.7, lineHeight: 1.7 }}>Sistema para la gestión de inspecciones fitosanitarias en predios agrícolas.</p>
          </div>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>Redes sociales</h3>
            {['Facebook', 'Instagram', 'Twitter'].map(r => (
              <p key={r} style={{ fontSize: 13, opacity: 0.7, marginBottom: 4 }}><a href="#" style={{ color: COLORES.blanco, textDecoration: 'none' }}>{r}</a></p>
            ))}
          </div>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>Contacto</h3>
            <p style={{ fontSize: 13, opacity: 0.7, marginBottom: 4 }}>📞 +57 300 123 4567</p>
            <p style={{ fontSize: 13, opacity: 0.7, marginBottom: 4 }}>📞 +57 310 987 6543</p>
            <p style={{ fontSize: 13, opacity: 0.7 }}>📧 proyecto.integrador@email.com</p>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 16, textAlign: 'center', fontSize: 12, opacity: 0.5 }}>
          © 2026 Proyecto Integrador
        </div>
      </footer>

    </div>
  )
}