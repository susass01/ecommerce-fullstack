# Casos de prueba: API de productos

**Herramienta:** Postman (colección en `postman/`)
**Fecha de ejecución:** 19/11/2026
**Entorno:** local (Node.js + Express + MySQL `empresa_demo`)
**Resultado general:** 10 casos ejecutados, 21 tests automáticos, 0 fallidos

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

## Observaciones

- **Datos sobrantes de pruebas manuales:** una prueba hecha antes de automatizar la captura del id dejó un producto de más en la tabla (id 7). Desde entonces TC-03, TC-04 y TC-05 se ejecutan en secuencia y la colección deja la base como la encontró.
- **URL con carácter oculto:** en TC-08 se detectó un `%09` (tabulación) al final de la URL, que se coló al escribirla. El caso pasaba igual, pero se corrigió para que ejecute exactamente `/productos/999`.
- **Mejora a futuro:** validar que `nombre_producto` no supere los 100 caracteres (límite de la columna).