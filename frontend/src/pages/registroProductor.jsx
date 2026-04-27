import { useState, useRef, useEffect } from "react";

const inputBase = {
  height: 38, padding: "0 12px", fontSize: 14, borderRadius: 8,
  border: "0.5px solid #CFD8DC", background: "#F8F9FA", color: "#1B2631",
  outline: "none", width: "100%", fontFamily: "inherit", boxSizing: "border-box",
};

const labelStyle = { fontSize: 12, fontWeight: 500, color: "#607D8B", marginBottom: 4, display: "block" };

function Field({ label, id, type = "text", placeholder, value, onChange, error, required }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label style={labelStyle}>{label}{required && <span style={{ color: "#E24B4A", marginLeft: 2 }}>*</span>}</label>
      <input
        id={id} type={type} placeholder={placeholder}
        value={value} onChange={onChange}
        style={{ ...inputBase, borderColor: error ? "#E24B4A" : "#CFD8DC" }}
      />
      {error && <span style={{ fontSize: 11, color: "#E24B4A" }}>{error}</span>}
    </div>
  );
}

function PwField({ label, id, placeholder, value, onChange, error, required }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label style={labelStyle}>{label}{required && <span style={{ color: "#E24B4A", marginLeft: 2 }}>*</span>}</label>
      <div style={{ position: "relative" }}>
        <input
          id={id} type={show ? "text" : "password"} placeholder={placeholder}
          value={value} onChange={onChange}
          style={{ ...inputBase, paddingRight: 40, borderColor: error ? "#E24B4A" : "#CFD8DC" }}
        />
        <button onClick={() => setShow(!show)} type="button"
          style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#607D8B", padding: 0, display: "flex" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
          </svg>
        </button>
      </div>
      {error && <span style={{ fontSize: 11, color: "#E24B4A" }}>{error}</span>}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "14px 0 10px" }}>
      <span style={{ fontSize: 11, fontWeight: 500, color: "#607D8B", letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{children}</span>
      <div style={{ flex: 1, height: 0.5, background: "#CFD8DC" }} />
    </div>
  );
}

const INITIAL = { nombre: "", apellido: "", tipoId: "", numeroId: "", correo: "", celular: "", departamento: "", municipio: "", direccion: "", password: "", confirmPassword: "" };

export default function RegistroProductor() {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [strength, setStrength] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [departamentos, setDepartamentos] = useState([]);
const [municipios, setMunicipios] = useState([]);

useEffect(() => {
  fetch('http://localhost:3000/api/geografico/departamentos')
    .then(res => res.json())
    .then(data => setDepartamentos(data))
    .catch(err => console.error(err));
}, []);

const handleDepartamento = (e) => {
  const id = e.target.value;
  const nombre = departamentos.find(d => d.id === parseInt(id))?.nombre || '';
  setForm(prev => ({ ...prev, departamento: nombre, departamento_id: id, municipio: '', municipio_id: '' }));
  fetch(`http://localhost:3000/api/geografico/municipios/departamento/${id}`)
    .then(res => res.json())
    .then(data => setMunicipios(data))
    .catch(err => console.error(err));
};

const handleMunicipio = (e) => {
  const id = e.target.value;
  const nombre = municipios.find(m => m.id === parseInt(id))?.nombre || '';
  setForm(prev => ({ ...prev, municipio: nombre, municipio_id: id }));
};

  // función de actualización para evitar stale closures
  const handleChange = (field) => (e) => {
  let val = e.target.value;

  // Solo números para cédula y celular
  if (field === "celular" || field === "numeroId") {
    val = val.replace(/\D/g, "");
  }

  // Formato celular (max dijitos)
  if (field === "celular") {
    val = val.slice(0, 10); 

    if (val.length > 6) {
      val = val.replace(/(\d{3})(\d{3})(\d{1,4})/, "$1 $2 $3");
    } else if (val.length > 3) {
      val = val.replace(/(\d{3})(\d{1,3})/, "$1 $2");
    }
  }

  setForm((prev) => ({ ...prev, [field]: val }));

  // Strength password
  if (field === "password") {
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    setStrength(score);
  }
};


  const validate = () => {
    const e = {};
    const required = ["nombre","apellido","tipoId","numeroId","correo","celular","departamento","municipio","direccion","password","confirmPassword"];
    required.forEach(f => { if (!form[f].trim()) e[f] = "Este campo es obligatorio"; });
    if (form.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) e.correo = "Ingresa un correo válido";
    if (form.numeroId && (form.numeroId.length < 6 || form.numeroId.length > 10)) {
  e.numeroId = "El número de identificación debe tener entre 6 y 10 dígitos";
}
if (form.celular && form.celular.replace(/\s/g, '').length < 10) {
  e.celular = "El celular debe tener 10 dígitos";
}

    // contraseña fuerte
  const password = form.password;

  const passwordErrors = [];

  if (!password) {
    passwordErrors.push("La contraseña es obligatoria");
  } else {
    if (password.length < 8) {
      passwordErrors.push("Debe tener mínimo 8 caracteres");
    }
    if (!/[A-Z]/.test(password)) {
      passwordErrors.push("Debe incluir al menos una mayúscula");
    }
    if (!/[a-z]/.test(password)) {
      passwordErrors.push("Debe incluir al menos una minúscula");
    }
    if (!/[0-9]/.test(password)) {
      passwordErrors.push("Debe incluir al menos un número");
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      passwordErrors.push("Debe incluir al menos un símbolo (!@#$%)");
    }
  }

  if (passwordErrors.length > 0) {
    e.password = passwordErrors.join(" · ");
  }


    if (form.password && form.confirmPassword && form.password !== form.confirmPassword) e.confirmPassword = "Las contraseñas no coinciden";
    return e;
  };

const handleSubmit = async () => {
  const e = validate();
  setErrors(e);
  if (Object.keys(e).length > 0) return;

  try {
    const res = await fetch('http://localhost:3000/api/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        numeroDocumento: form.numeroId,
        nombre: `${form.nombre} ${form.apellido}`,
        correo: form.correo,
        contrasena: form.password,
        telefono: form.celular.replace(/\s/g, '')
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al registrar');
    setSubmitted(true);
  } catch (err) {
    setErrors({ general: err.message });
  }
};

  const strengthColor = ["#E24B4A","#E24B4A","#EF9F27","#4CAF50","#2E7D32"][strength];
  const strengthWidth = ["0%","25%","50%","75%","100%"][strength];

  const bgStyle = {
  minHeight: "100vh",
  backgroundImage: "url('https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1400')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: 20,
  position: "relative",
};


  const cardStyle = {
    width: "100%", maxWidth: 480, background: "#fff",
    borderRadius: 16, overflow: "hidden", position: "relative", zIndex: 2, boxShadow: "0 8px 16px rgba(0,0,0,0.25)"

  };

  const grid2 = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 };
  const grid1 = { display: "grid", gap: 10, marginBottom: 10 };

  if (submitted) return (
    <div style={bgStyle}>
      <div style={cardStyle}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "3rem 2rem", textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#E8F5E9", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#2E7D32"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
          </div>
          <p style={{ fontSize: 18, fontWeight: 500, margin: "0 0 8px" }}>Registro exitoso</p>
         <p style={{ fontSize: 14, color: "#607D8B", margin: 0 }}>Tu cuenta ha sido creada exitosamente.<br/>Ya puedes iniciar sesión.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div style={bgStyle}>
      <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        zIndex: 1,
      }}
    />
      <div style={cardStyle}>
        {/* Header */}
        <div style={{ background: "#2E7D32", padding: "1.75rem 2rem 1.5rem", textAlign: "center" }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
            <svg width="24" height="24" viewBox="0 0 24 24"><path d="M17 8C8 10 5.9 16.17 3.82 21H5.5c.5-1.5 1.5-4 3.5-5.5C10 16 9 18 9 21h2c0-3 1.5-7 6-9.5V21h2V8h-2z" fill="white"/></svg>
          </div>
          <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 500, margin: "0 0 4px" }}>Registro de productor</h2>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, margin: 0 }}>Registra tus datos para unirte</p>
        </div>

        {/* Body */}
        <div style={{ padding: "1.5rem 2rem 2rem" }}>
          <SectionLabel>Información personal</SectionLabel>
          <div style={grid2}>
            <Field label="Nombre" id="nombre" placeholder="Ej. Carlos" value={form.nombre} onChange={handleChange("nombre")} error={errors.nombre} required />
            <Field label="Apellido" id="apellido" placeholder="Ej. Pérez" value={form.apellido} onChange={handleChange("apellido")} error={errors.apellido} required />
          </div>
          <div style={grid2}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={labelStyle}>Tipo de Identificación <span style={{ color: "#E24B4A" }}>*</span></label>
              <select value={form.tipoId} onChange={handleChange("tipoId")}
                style={{ ...inputBase, borderColor: errors.tipoId ? "#E24B4A" : "#CFD8DC" }}>
                <option value="">Seleccionar</option>
                <option value="cc">Cédula de ciudadanía</option>
                <option value="ce">Cédula de extranjería</option>
                <option value="nit">NIT</option>
                <option value="pasaporte">Pasaporte</option>
              </select>
              {errors.tipoId && <span style={{ fontSize: 11, color: "#E24B4A" }}>{errors.tipoId}</span>}
            </div>
            <Field label="Número de Identificación" placeholder="1234567890" value={form.numeroId} onChange={handleChange("numeroId")} error={errors.numeroId} required />
          </div>

          <SectionLabel>Contacto</SectionLabel>
          <div style={grid1}>
            <Field label="Correo electrónico" type="email" placeholder="correo@ejemplo.com" value={form.correo} onChange={handleChange("correo")} error={errors.correo} required />
            <Field label="Celular" placeholder="300 000 0000" value={form.celular} onChange={handleChange("celular")} error={errors.celular} required />
          </div>

       <SectionLabel>Ubicación</SectionLabel>
<div style={grid2}>
  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    <label style={labelStyle}>Departamento <span style={{ color: "#E24B4A" }}>*</span></label>
    <select onChange={handleDepartamento} value={form.departamento_id || ''}
      style={{ ...inputBase, borderColor: errors.departamento ? "#E24B4A" : "#CFD8DC" }}>
      <option value="">Seleccionar</option>
      {departamentos.map(d => (
        <option key={d.id} value={d.id}>{d.nombre}</option>
      ))}
    </select>
    {errors.departamento && <span style={{ fontSize: 11, color: "#E24B4A" }}>{errors.departamento}</span>}
  </div>
  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    <label style={labelStyle}>Municipio <span style={{ color: "#E24B4A" }}>*</span></label>
    <select onChange={handleMunicipio} value={form.municipio_id || ''}
      style={{ ...inputBase, borderColor: errors.municipio ? "#E24B4A" : "#CFD8DC" }}
      disabled={!form.departamento_id}>
      <option value="">Seleccionar</option>
      {municipios.map(m => (
        <option key={m.id} value={m.id}>{m.nombre}</option>
      ))}
    </select>
    {errors.municipio && <span style={{ fontSize: 11, color: "#E24B4A" }}>{errors.municipio}</span>}
  </div>
</div>
<div style={grid1}>
  <Field label="Vereda" placeholder="Ej. Vereda El Palmar, km 3" value={form.direccion} onChange={handleChange("direccion")} error={errors.direccion} required />
</div>

          <SectionLabel>Contraseña</SectionLabel>
          <div style={grid2}>
            <div>
              <PwField label="Contraseña" id="password" placeholder="Mínimo 8 caracteres" value={form.password} onChange={handleChange("password")} error={errors.password} required />
              <div style={{ height: 3, borderRadius: 2, background: "#ECEFF1", marginTop: 5, overflow: "hidden" }}>
                <div style={{ height: "100%", width: strengthWidth, background: strengthColor, borderRadius: 2, transition: "width 0.25s, background 0.25s" }} />
              </div>
            </div>
            <PwField label="Confirmar contraseña" placeholder="Repite tu contraseña" value={form.confirmPassword} onChange={handleChange("confirmPassword")} error={errors.confirmPassword} required />
          </div>

          {errors.general && (
  <div style={{ background: "#FFEBEE", color: "#C62828", borderRadius: 8, padding: "10px 14px", fontSize: 13, marginBottom: 8 }}>
    ⚠️ {errors.general}
  </div>
)}
    <button onClick={handleSubmit}
  style={{ width: "100%", height: 42, background: "#2E7D32", color: "#fff", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 500, cursor: "pointer", marginTop: 8, fontFamily: "inherit" }}
  onMouseOver={e => e.currentTarget.style.background = "#388E3C"}
  onMouseOut={e => e.currentTarget.style.background = "#2E7D32"}>
  Crear cuenta
</button>
          <p style={{ textAlign: "center", fontSize: 13, color: "#607D8B", marginTop: 14 }}>
            ¿Ya tienes cuenta? <a href="#" style={{ color: "#2E7D32", textDecoration: "none", fontWeight: 500 }}>Inicia sesión</a>
          </p>
        </div>
      </div>
    </div>
  );
}