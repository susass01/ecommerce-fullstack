USE empresa_demo;

-- 1. Quitar temporalmente la clave foránea que apunta a pedidos
ALTER TABLE pedidos DROP FOREIGN KEY pedidos_ibfk_1;

-- 2. Hacer que id_cliente se genere automáticamente
ALTER TABLE clientes MODIFY id_cliente INT AUTO_INCREMENT;

-- 3. Volver a crear la clave foránea
ALTER TABLE pedidos
  ADD CONSTRAINT pedidos_ibfk_1
  FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente);