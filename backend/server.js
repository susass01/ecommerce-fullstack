require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.get('/', (req, res) => {
  res.json({ mensaje: 'API E-commerce funcionando' });
});

app.get('/productos', async (req, res) => {
  try {
    const [filas] = await pool.query('SELECT * FROM productos');
    res.json(filas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener un producto por id
app.get('/productos/:id', async (req, res) => {
  try {
    const [filas] = await pool.query(
      'SELECT * FROM productos WHERE id_producto = ?',
      [req.params.id]
    );
    if (filas.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(filas[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear un producto
app.post('/productos', async (req, res) => {
  try {
    const { nombre_producto, categoria, precio, stock } = req.body;

    if (!nombre_producto || precio === undefined || stock === undefined) {
      return res
        .status(400)
        .json({ error: 'nombre_producto, precio y stock son obligatorios' });
    }
    if (
      isNaN(precio) || Number(precio) < 0 ||
      !Number.isInteger(Number(stock)) || Number(stock) < 0
    ) {
      return res
        .status(400)
        .json({ error: 'precio y stock deben ser números válidos (0 o mayor)' });
    }

    const [resultado] = await pool.query(
      'INSERT INTO productos (nombre_producto, categoria, precio, stock) VALUES (?, ?, ?, ?)',
      [nombre_producto, categoria || null, precio, stock]
    );

    res.status(201).json({
      id_producto: resultado.insertId,
      nombre_producto,
      categoria: categoria || null,
      precio,
      stock,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar un producto
app.put('/productos/:id', async (req, res) => {
  try {
    const { nombre_producto, categoria, precio, stock } = req.body;

    if (!nombre_producto || precio === undefined || stock === undefined) {
      return res
        .status(400)
        .json({ error: 'nombre_producto, precio y stock son obligatorios' });
    }
    if (
      isNaN(precio) || Number(precio) < 0 ||
      !Number.isInteger(Number(stock)) || Number(stock) < 0
    ) {
      return res
        .status(400)
        .json({ error: 'precio y stock deben ser números válidos (0 o mayor)' });
    }

    const [resultado] = await pool.query(
      'UPDATE productos SET nombre_producto = ?, categoria = ?, precio = ?, stock = ? WHERE id_producto = ?',
      [nombre_producto, categoria || null, precio, stock, req.params.id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({
      id_producto: Number(req.params.id),
      nombre_producto,
      categoria: categoria || null,
      precio,
      stock,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar un producto
app.delete('/productos/:id', async (req, res) => {
  try {
    const [resultado] = await pool.query(
      'DELETE FROM productos WHERE id_producto = ?',
      [req.params.id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ mensaje: 'Producto eliminado' });
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({
        error: 'No se puede eliminar: el producto está en pedidos existentes',
      });
    }
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});