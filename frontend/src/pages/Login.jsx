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
  rojo: "#C62828",
}

export default function Login() {
  const [form, setForm] = useState({ correo: '', contrasena: '' })
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const navigate = useNavigate()

  // Si ya hay token, redirigir según rol
useEffect(() => {
  const token = localStorage.getItem('token')
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
  if (token) {
    if (usuario.rol === 'admin') navigate('/admin', { replace: true })
    else if (usuario.rol === 'tecnico') navigate('/tecnico', { replace: true })
    else if (usuario.rol === 'productor') navigate('/productor', { replace: true })
  }
}, [])

  const handleSubmit = async () => {
    setError('')
    if (!form.correo || !form.contrasena) {
      setError('Por favor completa todos los campos')
      return
    }
    setCargando(true)
    try {
      const res = await fetch('http://localhost:3000/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.mensaje || 'Error al iniciar sesión')
      localStorage.setItem('token', data.token)
      localStorage.setItem('usuario', JSON.stringify(data.usuario))
      // Redirigir según rol
      if (data.usuario.rol === 'tecnico') navigate('/tecnico', { replace: true })
else if (data.usuario.rol === 'admin') navigate('/admin', { replace: true })
else if (data.usuario.rol === 'productor') navigate('/productor', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: COLORES.grisPastel }}>
      <div style={{ background: COLORES.blanco, borderRadius: 16, padding: 40, width: 380, maxWidth: '90vw', boxShadow: '0 8px 40px rgba(0,0,0,0.12)' }}>
        
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 60, height: 60, background: COLORES.verde, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 12px' }}>🌱</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: COLORES.texto, margin: 0 }}>Bienvenido</h1>
          <p style={{ fontSize: 13, color: COLORES.textoMuted, margin: '6px 0 0' }}>Sistema de Inspecciones Sanitarias</p>
        </div>

        {/* Campos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: COLORES.textoMuted, textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 6 }}>Correo electrónico</label>
            <input
              type="email"
              value={form.correo}
              onChange={e => setForm({ ...form, correo: e.target.value })}
              placeholder="tucorreo@ejemplo.com"
              style={{ width: '100%', border: `1px solid ${COLORES.borde}`, borderRadius: 8, padding: '10px 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: COLORES.textoMuted, textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 6 }}>Contraseña</label>
            <input
              type="password"
              value={form.contrasena}
              onChange={e => setForm({ ...form, contrasena: e.target.value })}
              placeholder="••••••••"
              style={{ width: '100%', border: `1px solid ${COLORES.borde}`, borderRadius: 8, padding: '10px 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {error && (
            <div style={{ background: '#FFEBEE', color: COLORES.rojo, borderRadius: 8, padding: '10px 14px', fontSize: 13, fontWeight: 500 }}>
              ⚠️ {error}
            </div>
          )}

          <button
  onClick={handleSubmit}
  disabled={cargando}
  style={{ background: COLORES.verde, color: COLORES.blanco, border: 'none', borderRadius: 8, padding: '12px', fontSize: 15, fontWeight: 700, cursor: 'pointer', opacity: cargando ? 0.7 : 1, marginTop: 8 }}>
  {cargando ? 'Ingresando...' : 'Ingresar'}
</button>

<p style={{ textAlign: 'center', fontSize: 13, color: COLORES.textoMuted, marginTop: 14 }}>
  ¿Aún no estás registrado?{' '}
  <a href="/registro" style={{ color: COLORES.verde, textDecoration: 'none', fontWeight: 600 }}>
    Crear cuenta
  </a>
</p>
        </div>
      </div>
    </div>
  )
}