const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');  // <--- agregar cors

dotenv.config();

const app = express();

app.use(cors());             // <--- habilitar CORS para evitar bloqueo
app.use(express.json());

const conexionRoutes = require('./routes/conexion');
app.use(conexionRoutes);     // <--- sin prefijo, rutas directas

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = app;
