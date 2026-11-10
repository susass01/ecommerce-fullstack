USE empresa_demo;

-- 1. Quitar temporalmente la clave foránea que apunta a productos
ALTER TABLE detalle_pedido DROP FOREIGN KEY detalle_pedido_ibfk_2;

-- 2. Hacer que id_producto se genere automáticamente
ALTER TABLE productos MODIFY id_producto INT AUTO_INCREMENT;

-- 3. Volver a crear la clave foránea
ALTER TABLE detalle_pedido
  ADD CONSTRAINT detalle_pedido_ibfk_2
  FOREIGN KEY (id_producto) REFERENCES productos(id_producto);