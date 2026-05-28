import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

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
  const [esMobil, setEsMobil] = useState(window.innerWidth < 768)

  const [stats, setStats] = useState([
    { label: "Cultivos inspeccionados", valor: "..." },
    { label: "Predios registrados",     valor: "..." },
    { label: "Inspecciones realizadas", valor: "..." },
  ])

  useEffect(() => {
    const handler = () => setEsMobil(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  useEffect(() => {
    Promise.all([
      fetch('https://proyectointegrador5.onrender.com/api/predial/cultivos').then(r => r.json()),
      fetch('https://proyectointegrador5.onrender.com/api/predial/predios').then(r => r.json()),
      fetch('https://proyectointegrador5.onrender.com/api/inspecciones/inspecciones').then(r => r.json()),
    ]).then(([cultivos, predios, inspecciones]) => {
      setStats([
        { label: "Cultivos registrados",    valor: cultivos.length + "+" },
        { label: "Predios registrados",     valor: predios.length },
        { label: "Inspecciones realizadas", valor: inspecciones.length },
      ])
    }).catch(err => console.error(err))
  }, [])

  useEffect(() => {
    const intervalo = setInterval(() => {
      setImagenActual(i => (i + 1) % imagenes.length)
    }, 5000)
    return () => clearInterval(intervalo)
  }, [])

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", minHeight: '100vh' }}>

      {/* HEADER */}
      <header style={{ background: COLORES.verde, color: COLORES.blanco, padding: '0 20px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 2px 12px rgba(0,0,0,0.18)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 22 }}>🌱</span>
          <span style={{ fontWeight: 700, fontSize: esMobil ? 14 : 17 }}>Proyecto Integrador</span>
        </div>
        <nav style={{ display: 'flex', gap: esMobil ? 10 : 24, alignItems: 'center' }}>
          {!esMobil && <a href="#roles" style={{ color: COLORES.blanco, textDecoration: 'none', fontSize: 14, opacity: 0.9 }}>Roles</a>}
          {!esMobil && <a href="#sistema" style={{ color: COLORES.blanco, textDecoration: 'none', fontSize: 14, opacity: 0.9 }}>Nuestro sistema</a>}
          <button onClick={() => navigate('/login')} style={{ background: COLORES.blanco, color: COLORES.verde, border: 'none', borderRadius: 8, padding: esMobil ? '7px 14px' : '8px 20px', fontSize: esMobil ? 13 : 14, fontWeight: 700, cursor: 'pointer' }}>
            Iniciar sesión
          </button>
        </nav>
      </header>

      {/* CARRUSEL */}
      <section style={{ position: 'relative', height: esMobil ? 320 : 480, overflow: 'hidden' }}>
        {imagenes.map((img, i) => (
          <div key={i} style={{
            position: 'absolute', inset: 0,
            backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${img})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            opacity: i === imagenActual ? 1 : 0,
            transition: 'opacity 1s ease',
          }} />
        ))}
        <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: COLORES.blanco, textAlign: 'center', padding: '0 20px' }}>
          <h1 style={{ fontSize: esMobil ? 22 : 38, fontWeight: 800, margin: '0 0 12px', textShadow: '0 2px 8px rgba(0,0,0,0.4)', lineHeight: 1.3 }}>Sistema de Inspecciones Fitosanitarias</h1>
          <p style={{ fontSize: esMobil ? 14 : 17, opacity: 0.9, maxWidth: 600, margin: '0 0 24px' }}>Gestión y supervisión de inspecciones en cultivos agrícolas</p>
          <button onClick={() => navigate('/login')} style={{ background: COLORES.verdeClaro, color: COLORES.blanco, border: 'none', borderRadius: 10, padding: esMobil ? '11px 28px' : '14px 36px', fontSize: esMobil ? 14 : 16, fontWeight: 700, cursor: 'pointer' }}>
            Comenzar →
          </button>
        </div>
        <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, zIndex: 2 }}>
          {imagenes.map((_, i) => (
            <button key={i} onClick={() => setImagenActual(i)} style={{ width: i === imagenActual ? 24 : 8, height: 8, borderRadius: 4, background: COLORES.blanco, border: 'none', cursor: 'pointer', opacity: i === imagenActual ? 1 : 0.5, transition: 'all 0.3s' }} />
          ))}
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: COLORES.verde, padding: '28px 20px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: esMobil ? '1fr' : 'repeat(3, 1fr)', gap: 12 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 12, padding: '18px 16px', textAlign: 'center', color: COLORES.blanco }}>
              <div style={{ fontSize: esMobil ? 24 : 28, fontWeight: 800, marginBottom: 6 }}>{s.valor}</div>
              <div style={{ fontSize: 13, opacity: 0.85 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* DESCRIPCIÓN */}
      <section id="sistema" style={{ padding: esMobil ? '40px 20px' : '60px 24px', background: COLORES.blanco }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: esMobil ? 20 : 26, fontWeight: 700, color: COLORES.texto, marginBottom: 14 }}>¿Qué hace nuestro sistema?</h2>
          <p style={{ fontSize: esMobil ? 14 : 15, color: COLORES.textoMuted, lineHeight: 1.8 }}>
            El sistema de inspecciones fitosanitarias permite registrar, gestionar y supervisar las inspecciones realizadas en cultivos agrícolas. Su objetivo es garantizar que los productos cumplan con las normas sanitarias necesarias para su exportación y comercialización. Además facilita el control de predios, cultivos e informes técnicos generados por los inspectores.
          </p>
        </div>
      </section>

      {/* ROLES */}
      <section id="roles" style={{ padding: esMobil ? '40px 20px' : '60px 24px', background: COLORES.grisPastel }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ fontSize: esMobil ? 20 : 26, fontWeight: 700, color: COLORES.texto, textAlign: 'center', marginBottom: 24 }}>Roles del Sistema</h2>
          <div style={{ display: 'grid', gridTemplateColumns: esMobil ? '1fr' : 'repeat(3, 1fr)', gap: 16 }}>
            {roles.map((r, i) => (
              <div key={i} style={{ background: COLORES.blanco, borderRadius: 14, padding: esMobil ? 20 : 28, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', borderTop: `4px solid ${COLORES.verde}` }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>{r.icono}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORES.texto, marginBottom: 8 }}>{r.titulo}</h3>
                <p style={{ fontSize: esMobil ? 14 : 15, color: COLORES.textoMuted, lineHeight: 1.7 }}>{r.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: COLORES.texto, color: COLORES.blanco, padding: esMobil ? '32px 20px 16px' : '40px 24px 20px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: esMobil ? '1fr' : 'repeat(3, 1fr)', gap: esMobil ? 24 : 32, marginBottom: 24 }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>🌱 Proyecto Integrador</h3>
            <p style={{ fontSize: 14, opacity: 0.7, lineHeight: 1.7 }}>Sistema para la gestión de inspecciones fitosanitarias en predios agrícolas.</p>
          </div>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>Redes sociales</h3>
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              {[
                { nombre: 'Facebook',  href: '#', icono: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/facebook.svg' },
                { nombre: 'Instagram', href: '#', icono: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/instagram.svg' },
                { nombre: 'Twitter',   href: '#', icono: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/twitter.svg' },
              ].map(r => (
                <a key={r.nombre} href={r.href} title={r.nombre} style={{ width: 38, height: 38, borderRadius: 8, background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}>
                  <img src={r.icono} alt={r.nombre} style={{ width: 18, height: 18, filter: 'invert(1)' }} />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>Contacto</h3>
            {[
              { icono: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/whatsapp.svg', texto: '+57 300 123 4567' },
              { icono: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/whatsapp.svg', texto: '+57 310 987 6543' },
              { icono: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/gmail.svg',    texto: 'proyecto.integrador@email.com' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, opacity: 0.7 }}>
                <img src={item.icono} alt="" style={{ width: 16, height: 16, filter: 'invert(1)', flexShrink: 0 }} />
                <span style={{ fontSize: 13 }}>{item.texto}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 16, textAlign: 'center', fontSize: esMobil ? 11 : 14, opacity: 0.5 }}>
          © 2026 Proyecto Integrador Haider Esteban Fuentes || Angel Giovanny Arevalo || Brayan Andrés Suarez
        </div>
      </footer>

    </div>
  )
}