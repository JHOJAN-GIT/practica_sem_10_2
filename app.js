const express = require('express');
const cors = require('cors');
require('dotenv').config();

const productosRoutes = require('./src/routes/productosRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.static('public')); // Permite mostrar archivos HTML y CSS
app.use(express.json()); // Permite recibir JSON en el req.body

// Rutas
app.use('/api/productos', productosRoutes);

// Manejo de rutas no encontradas (Error 404)
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});