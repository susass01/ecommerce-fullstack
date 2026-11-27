# Casos de prueba: API de productos

**Herramienta:** Postman (colección en `postman/`)
**Fecha de ejecución:** 25/11/2026
**Entorno:** local (Node.js + Express + MySQL `empresa_demo`)
**Resultado general:** 24 casos ejecutados, 52 tests automáticos, 0 fallidos

| ID | Descripción | Método y ruta | Datos de entrada | Resultado esperado | Resultado obtenido | Estado |
|---|---|---|---|---|---|---|
| TC-01 | Listar productos | GET /productos | - | 200 y arreglo con al menos 6 productos | 200, 6 productos | ✅ Pass |
| TC-02 | Obtener producto existente | GET /productos/1 | id = 1 | 200 y Laptop Dell Inspiron | 200, Laptop Dell Inspiron | ✅ Pass |
| TC-03 | Crear producto válido | POST /productos | nombre, categoría, precio 60, stock 25 | 201 y `id_producto` numérico | 201, id generado | ✅ Pass |
| TC-04 | Actualizar producto | PUT /productos/:id | precio 55, stock 30 | 200 y precio 55 | 200, precio 55 | ✅ Pass |
| TC-05 | Eliminar producto | DELETE /productos/:id | id creado en TC-03 | 200 y "Producto eliminado" | 200, mensaje correcto | ✅ Pass |
| TC-06 | Crear producto sin precio | POST /productos | solo nombre_producto | 400 y mensaje de error | 400, mensaje de error | ✅ Pass |
| TC-07 | Crear producto con precio negativo | POST /productos | precio = -5 | 400 y mensaje de error | 400, mensaje de error | ✅ Pass |
| TC-08 | Obtener producto inexistente | GET /productos/999 | id = 999 | 404 y mensaje de error | 404, mensaje de error | ✅ Pass |
| TC-09 | Eliminar producto inexistente | DELETE /productos/999 | id = 999 | 404 y mensaje de error | 404, mensaje de error | ✅ Pass |
| TC-10 | Eliminar producto con pedidos | DELETE /productos/1 | id = 1 (está en pedidos) | 409 por clave foránea | 409, mensaje de error | ✅ Pass |
| TC-11 | Listar clientes | GET /clientes | - | 200 y al menos 8 clientes | 200, 8 clientes | ✅ Pass |
| TC-12 | Obtener cliente existente | GET /clientes/1 | id = 1 | 200, Ana Perez, fecha 2025-01-10 | 200, datos correctos | ✅ Pass |
| TC-13 | Crear cliente válido | POST /clientes | nombre, email, ciudad | 201 y `id_cliente` numérico | 201, id generado | ✅ Pass |
| TC-14 | Actualizar cliente | PUT /clientes/:id | ciudad = Tucuman | 200 y ciudad actualizada | 200, ciudad actualizada | ✅ Pass |
| TC-15 | Eliminar cliente | DELETE /clientes/:id | id creado en TC-13 | 200 y "Cliente eliminado" | 200, mensaje correcto | ✅ Pass |
| TC-16 | Crear cliente con email duplicado | POST /clientes | email de Ana Perez | 409 y mensaje de error | 409, mensaje de error | ✅ Pass |
| TC-17 | Crear cliente con email inválido | POST /clientes | email = "no-es-un-email" | 400 y mensaje de error | 400, mensaje de error | ✅ Pass |
| TC-18 | Obtener cliente inexistente | GET /clientes/999 | id = 999 | 404 y mensaje de error | 404, mensaje de error | ✅ Pass |
| TC-19 | Eliminar cliente con pedidos | DELETE /clientes/1 | id = 1 (tiene pedidos) | 409 por clave foránea | 409, mensaje de error | ✅ Pass |
| TC-20 | Listar pedidos con cliente y total | GET /pedidos | - | 200 y 7 pedidos | 200, 7 pedidos | ✅ Pass |
| TC-21 | Filtrar pedidos por estado | GET /pedidos?estado=Pendiente | estado = Pendiente | 200 y solo el pedido pendiente | 200, 1 pedido | ✅ Pass |
| TC-22 | Obtener pedido con detalle (JOIN) | GET /pedidos/5 | id = 5 | 200, Sofia Diaz, 3 productos, total 1410 | 200, datos correctos | ✅ Pass |
| TC-23 | Obtener pedido inexistente | GET /pedidos/999 | id = 999 | 404 y mensaje de error | 404, mensaje de error | ✅ Pass |
| TC-24 | Ranking de clientes (CTE + RANK) | GET /reportes/ranking-clientes | - | 200, 6 clientes, primero Sofia Diaz | 200, 6 clientes | ✅ Pass |

## Observaciones

- **Datos sobrantes de pruebas manuales:** una prueba hecha antes de automatizar la captura del id dejó un producto de más en la tabla (id 7). Desde entonces TC-03, TC-04 y TC-05 se ejecutan en secuencia y la colección deja la base como la encontró.
- **URL con carácter oculto:** en TC-08 se detectó un `%09` (tabulación) al final de la URL, que se coló al escribirla. El caso pasaba igual, pero se corrigió para que ejecute exactamente `/productos/999`.
- **Mejora a futuro:** validar que `nombre_producto` no supere los 100 caracteres (límite de la columna).
- **Repetibilidad de TC-13:** al diseñar el alta de clientes se detectó que, sin un `DELETE /clientes/:id`, la prueba fallaría en la segunda ejecución por email duplicado y dejaría datos sobrantes. Se agregó el endpoint y TC-15 limpia lo que crea TC-13.
- **Datos de referencia:** los casos de lectura (TC-11, TC-20 a TC-24) asumen los datos originales del script SQL (8 clientes, 7 pedidos).
- **Mejora a futuro:** crear pedidos (`POST /pedidos`), que requiere transacciones para guardar el pedido y su detalle juntos.