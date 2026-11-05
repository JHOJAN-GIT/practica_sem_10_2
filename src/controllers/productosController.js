const pool = require('../config/db');

// 1. Listar todos (GET)
exports.listar = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM productos');
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al listar productos' });
  }
};

// 2. Obtener uno por ID (GET)
exports.obtener = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.execute('SELECT * FROM productos WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
};

// 3. Crear un producto (POST)
exports.crear = async (req, res) => {
  const { nombre, precio, stock } = req.body;

  // Validaciones (Error 400)
  if (!nombre || precio === undefined || stock === undefined) {
    return res.status(400).json({ error: 'Nombre, precio y stock son obligatorios' });
  }

  try {
    const [result] = await pool.execute(
      'INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)',
      [nombre, precio, stock]
    );
    
    // Devolvemos el producto recién creado con estado 201
    const [rows] = await pool.execute('SELECT * FROM productos WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear producto' });
  }
};

// 4. Actualizar un producto (PUT)
exports.actualizar = async (req, res) => {
  const { id } = req.params;
  const { nombre, precio, stock } = req.body;

  if (!nombre || precio === undefined || stock === undefined) {
    return res.status(400).json({ error: 'Nombre, precio y stock son obligatorios' });
  }

  try {
    const [existe] = await pool.execute('SELECT id FROM productos WHERE id = ?', [id]);
    if (existe.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    await pool.execute(
      'UPDATE productos SET nombre = ?, precio = ?, stock = ? WHERE id = ?',
      [nombre, precio, stock, id]
    );

    const [rows] = await pool.execute('SELECT * FROM productos WHERE id = ?', [id]);
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
};

// 5. Eliminar un producto (DELETE)
exports.eliminar = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.execute('DELETE FROM productos WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.status(200).json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
};