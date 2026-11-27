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
  dateStrings: true,
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

// ---------- CLIENTES ----------

function validarCliente({ nombre, email, fecha_registro }) {
  if (!nombre || !email) {
    return 'nombre y email son obligatorios';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'el email no tiene un formato válido';
  }
  if (fecha_registro && !/^\d{4}-\d{2}-\d{2}$/.test(fecha_registro)) {
    return 'fecha_registro debe tener el formato AAAA-MM-DD';
  }
  return null;
}

// Listar clientes
app.get('/clientes', async (req, res) => {
  try {
    const [filas] = await pool.query('SELECT * FROM clientes ORDER BY id_cliente');
    res.json(filas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener un cliente por id
app.get('/clientes/:id', async (req, res) => {
  try {
    const [filas] = await pool.query(
      'SELECT * FROM clientes WHERE id_cliente = ?',
      [req.params.id]
    );
    if (filas.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json(filas[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear un cliente
app.post('/clientes', async (req, res) => {
  try {
    const { nombre, email, ciudad, fecha_registro } = req.body;

    const errorValidacion = validarCliente(req.body);
    if (errorValidacion) {
      return res.status(400).json({ error: errorValidacion });
    }

    const [existentes] = await pool.query(
      'SELECT id_cliente FROM clientes WHERE email = ?',
      [email]
    );
    if (existentes.length > 0) {
      return res.status(409).json({ error: 'Ya existe un cliente con ese email' });
    }

    const [resultado] = await pool.query(
      'INSERT INTO clientes (nombre, email, ciudad, fecha_registro) VALUES (?, ?, ?, COALESCE(?, CURDATE()))',
      [nombre, email, ciudad || null, fecha_registro || null]
    );

    const [nuevo] = await pool.query(
      'SELECT * FROM clientes WHERE id_cliente = ?',
      [resultado.insertId]
    );
    res.status(201).json(nuevo[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar un cliente
app.put('/clientes/:id', async (req, res) => {
  try {
    const { nombre, email, ciudad, fecha_registro } = req.body;

    const errorValidacion = validarCliente(req.body);
    if (errorValidacion) {
      return res.status(400).json({ error: errorValidacion });
    }

    const [duplicado] = await pool.query(
      'SELECT id_cliente FROM clientes WHERE email = ? AND id_cliente <> ?',
      [email, req.params.id]
    );
    if (duplicado.length > 0) {
      return res.status(409).json({ error: 'Ya existe otro cliente con ese email' });
    }

    const [resultado] = await pool.query(
      'UPDATE clientes SET nombre = ?, email = ?, ciudad = ?, fecha_registro = COALESCE(?, fecha_registro) WHERE id_cliente = ?',
      [nombre, email, ciudad || null, fecha_registro || null, req.params.id]
    );
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    const [actualizado] = await pool.query(
      'SELECT * FROM clientes WHERE id_cliente = ?',
      [req.params.id]
    );
    res.json(actualizado[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar un cliente
app.delete('/clientes/:id', async (req, res) => {
  try {
    const [resultado] = await pool.query(
      'DELETE FROM clientes WHERE id_cliente = ?',
      [req.params.id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.json({ mensaje: 'Cliente eliminado' });
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({
        error: 'No se puede eliminar: el cliente tiene pedidos asociados',
      });
    }
    res.status(500).json({ error: error.message });
  }
});

// ---------- PEDIDOS ----------

// Listar pedidos con cliente y total (filtro opcional: ?estado=Entregado)
app.get('/pedidos', async (req, res) => {
  try {
    const { estado } = req.query;
    const filtro = estado ? 'WHERE p.estado = ?' : '';

    const [filas] = await pool.query(
      `SELECT
         p.id_pedido,
         p.fecha_pedido,
         p.estado,
         c.id_cliente,
         c.nombre AS cliente,
         COALESCE(SUM(pr.precio * dp.cantidad), 0) AS total
       FROM pedidos p
       JOIN clientes c ON p.id_cliente = c.id_cliente
       LEFT JOIN detalle_pedido dp ON p.id_pedido = dp.id_pedido
       LEFT JOIN productos pr ON dp.id_producto = pr.id_producto
       ${filtro}
       GROUP BY p.id_pedido, p.fecha_pedido, p.estado, c.id_cliente, c.nombre
       ORDER BY p.id_pedido`,
      estado ? [estado] : []
    );
    res.json(filas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener un pedido con el cliente y sus productos
app.get('/pedidos/:id', async (req, res) => {
  try {
    const [pedidos] = await pool.query(
      `SELECT
         p.id_pedido,
         p.fecha_pedido,
         p.estado,
         c.id_cliente,
         c.nombre AS cliente,
         c.email
       FROM pedidos p
       JOIN clientes c ON p.id_cliente = c.id_cliente
       WHERE p.id_pedido = ?`,
      [req.params.id]
    );
    if (pedidos.length === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    const [items] = await pool.query(
      `SELECT
         pr.id_producto,
         pr.nombre_producto,
         pr.precio,
         dp.cantidad,
         pr.precio * dp.cantidad AS subtotal
       FROM detalle_pedido dp
       JOIN productos pr ON dp.id_producto = pr.id_producto
       WHERE dp.id_pedido = ?
       ORDER BY dp.id_detalle`,
      [req.params.id]
    );

    const total = items.reduce((acc, item) => acc + Number(item.subtotal), 0);
    res.json({ ...pedidos[0], items, total: Number(total.toFixed(2)) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---------- REPORTES ----------

// Ranking de clientes por gasto total (CTE + funciones de ventana)
app.get('/reportes/ranking-clientes', async (req, res) => {
  try {
    const [filas] = await pool.query(
      `WITH gasto_clientes AS (
         SELECT
           c.id_cliente,
           c.nombre,
           SUM(pr.precio * dp.cantidad) AS total_gastado
         FROM clientes c
         JOIN pedidos p ON c.id_cliente = p.id_cliente
         JOIN detalle_pedido dp ON p.id_pedido = dp.id_pedido
         JOIN productos pr ON dp.id_producto = pr.id_producto
         GROUP BY c.id_cliente, c.nombre
       )
       SELECT
         nombre,
         total_gastado,
         RANK() OVER (ORDER BY total_gastado DESC) AS ranking_rank,
         DENSE_RANK() OVER (ORDER BY total_gastado DESC) AS ranking_dense,
         ROW_NUMBER() OVER (ORDER BY total_gastado DESC, id_cliente) AS numero_fila
       FROM gasto_clientes
       ORDER BY total_gastado DESC, id_cliente`
    );
    res.json(filas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});