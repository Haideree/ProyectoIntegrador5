const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Rutas (las iremos agregando)
app.use('/api/usuarios', require('./src/routes/usuarios.routes'));
app.use('/api/geografico', require('./src/routes/geografico.routes'));
app.use('/api/predial', require('./src/routes/predial.routes'));
app.use('/api/inspecciones', require('./src/routes/inspecciones.routes'));

app.get('/', (req, res) => {
  res.json({ mensaje: '🚀 Backend Proyecto Integrador 5 funcionando' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
}); 
