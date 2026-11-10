# 🛒 E-commerce Full Stack: SQL + Node.js + React

Proyecto práctico que lleva una base de datos de comercio electrónico (MySQL) a una aplicación completa: API REST, pruebas con Postman, frontend en React y documentación QA.

La base de datos nace del repositorio de ejercicios SQL:
👉 [sql-ecommerce-practice](https://github.com/susass01/sql-ecommerce-practice)

## 🧱 Arquitectura

```
React (frontend)  →  API REST (Node + Express)  →  MySQL (empresa_demo)
                              ↑
                       Postman (pruebas)
```

## 🛠️ Tecnologías

- MySQL / MySQL Workbench
- Node.js + Express
- mysql2, cors, dotenv, nodemon
- Postman (próximamente)
- React (próximamente)
- Jira para la documentación QA (próximamente)

## 🗺️ Hoja de ruta

- [x] Paso 1: Entorno y repositorio
- [x] Paso 2: Backend conectado a MySQL
- [x] Paso 3: CRUD de productos
- [ ] Paso 4: Pruebas con Postman (colección exportada)
- [ ] Paso 5: Clientes y pedidos con JOINs
- [ ] Paso 6: Frontend en React
- [ ] Paso 7: Documentación QA (historias de usuario, casos de prueba, backlog)
- [ ] Paso 8: Cierre y repositorio final

## 🚀 Cómo ejecutarlo

1. Crear la base de datos ejecutando el script `Base_Datos_Ecommerce_Practica_SQL.sql` del repositorio de SQL.
2. Ejecutar `database/paso_03_auto_increment.sql` para que `productos` genere sus ids automáticamente.
3. Crear un usuario de MySQL para la app:
   ```sql
   CREATE USER 'ecommerce_user'@'localhost' IDENTIFIED BY 'tu_contraseña';
   GRANT ALL PRIVILEGES ON empresa_demo.* TO 'ecommerce_user'@'localhost';
   ```
4. Dentro de `backend/`, copiar `.env.example` como `.env` y completar la contraseña.
5. Instalar dependencias y levantar el servidor:
   ```
   cd backend
   npm install
   npm run dev
   ```
6. La API queda en `http://localhost:3000`.

## 📡 Endpoints de productos

| Método | Ruta | Descripción | Respuestas |
|---|---|---|---|
| GET | `/productos` | Lista todos los productos | 200 |
| GET | `/productos/:id` | Obtiene un producto | 200, 404 |
| POST | `/productos` | Crea un producto | 201, 400 |
| PUT | `/productos/:id` | Actualiza un producto | 200, 400, 404 |
| DELETE | `/productos/:id` | Elimina un producto | 200, 404, 409 |

Ejemplo de body para `POST` y `PUT`:

```json
{
  "nombre_producto": "Mouse Gamer",
  "categoria": "Accesorios",
  "precio": 60,
  "stock": 25
}
```

El `409` se devuelve al intentar eliminar un producto que forma parte de pedidos existentes (restricción de clave foránea).

## 🔒 Buenas prácticas aplicadas

- Consultas parametrizadas (`?`) para evitar inyección SQL.
- Credenciales en variables de entorno, fuera del repositorio.
- Usuario de base de datos propio para la app, sin usar `root`.
- Validación de datos y códigos HTTP correctos.