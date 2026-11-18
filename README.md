<div align="center">

# 🏋️ Gym Management RESTful API (MariaDB)
### *Guía Súper Fácil para Probar la API en Swagger*

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MariaDB](https://img.shields.io/badge/MariaDB-12.3-003545?style=for-the-badge&logo=mariadb&logoColor=white)](https://mariadb.org/)
[![Swagger](https://img.shields.io/badge/OpenAPI-Swagger_Docs-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](https://swagger.io/)

<p align="center">
  Sistema de gestión de entrenamientos (workouts) y marcas de atletas (records) de un gimnasio. Guarda los datos en una base de datos real en la nube (<b>MariaDB Cloud</b>) y permite probar todo directamente desde el navegador con <b>Swagger</b>.
</p>

**🌐 Enlace directo para probar en Swagger:**  
👉 **[https://apirestgym-mariadb.onrender.com/api/v1/docs/](https://apirestgym-mariadb.onrender.com/api/v1/docs/)**

</div>

---

## 💡 ¿Qué hace esta API explicado en lenguaje sencillo?

Imagina que esta API es como la **libreta del recepcionista del gimnasio**:
- 🟢 **GET (Ver / Leer):** Es como abrir la libreta y leer los entrenamientos que hay apuntados.
- 🔵 **POST (Crear / Añadir):** Es como coger el boli y escribir un nuevo entrenamiento en la libreta.
- 🟡 **PATCH (Modificar / Cambiar):** Es como borrar solo el nombre de un entrenamiento para ponerle otro.
- 🔴 **DELETE (Borrar / Eliminar):** Es como arrancar la hoja y tirarla a la papelera.

> 🔑 **La contraseña de acceso:** Para que nadie desconocido toque la libreta, la API pide una clave secreta llamada API Key: **`EduApiKey`**.

---

## 🚀 Paso a Paso: Cómo probar todo en Swagger en 2 minutos

### 1️⃣ Paso Previo: Poner la Contraseña (Obligatorio)
Si no haces esto, la API te rechazará todas las peticiones con error:
1. Abre [https://apirestgym-mariadb.onrender.com/api/v1/docs/](https://apirestgym-mariadb.onrender.com/api/v1/docs/).
2. Arriba a la derecha, haz clic en el botón verde **Authorize** 🔓.
3. En la casilla de texto escribe: `EduApiKey`
4. Pulsa el botón **Authorize** y luego **Close**. ¡Listo! Ya tienes permiso total.

---

### 2️⃣ Los 5 Botones de Entrenamientos (Workouts)

#### 🟢 1. Ver todos los entrenamientos (`GET /api/v1/workouts`)
> **¿Qué hace?** Te saca la lista completa de todos los entrenamientos guardados en la base de datos.
- Haz clic sobre la barra azul **GET /api/v1/workouts**.
- Pulsa el botón **Try it out** (arriba a la derecha de la barra).
- Pulsa el botón grande azul **Execute**.
- **Lo que verás abajo:** Código `200` y la lista con `Tommy V`, `Heavy DT`, etc.

---

#### 🟢 2. Ver un solo entrenamiento por su ID (`GET /api/v1/workouts/{workoutId}`)
> **¿Qué hace?** Busca un entrenamiento concreto usando su código identificador (como buscar a alguien por su DNI).
- Despliega **GET /api/v1/workouts/{workoutId}**.
- Pulsa **Try it out**.
- En la casilla `workoutId`, copia y pega este código de prueba:
  ```text
  4a3a9acf-c2ec-4600-a457-3f1bfa52618b
  ```
- Pulsa **Execute**. Te devolverá únicamente los datos de ese entrenamiento.

---

#### 🔵 3. Crear un entrenamiento nuevo (`POST /api/v1/workouts`)
> **¿Qué hace?** Guarda un entrenamiento nuevo en la base de datos MariaDB.
- Despliega la barra verde **POST /api/v1/workouts**.
- Pulsa **Try it out**.
- En el cuadro de texto gris (Request body), borra lo que haya y pega esto:
  ```json
  {
    "name": "Mi Primer Entrenamiento",
    "mode": "For Time",
    "equipment": ["mancuernas", "cuerda"],
    "exercises": ["50 saltos de comba", "20 flexiones", "10 dominadas"],
    "trainerTips": ["Descansa 1 minuto entre rondas"]
  }
  ```
- Pulsa **Execute**.
- **Lo que verás abajo:** Código `201 Created` y tu nuevo entrenamiento creado con un ID único.

---

#### 🟡 4. Modificar un entrenamiento (`PATCH /api/v1/workouts/{workoutId}`)
> **¿Qué hace?** Cambia uno o varios datos de un entrenamiento ya existente sin borrar el resto.
- Despliega la barra naranja **PATCH /api/v1/workouts/{workoutId}**.
- Pulsa **Try it out**.
- En la casilla `workoutId` pon el ID del entrenamiento que quieras cambiar (por ejemplo `4a3a9acf-c2ec-4600-a457-3f1bfa52618b`).
- En el cuadro de texto pega solo lo que quieras cambiar:
  ```json
  {
    "name": "Tommy V - Modificado",
    "mode": "AMRAP 20"
  }
  ```
- Pulsa **Execute**. Verás código `200` confirmando el cambio.

---

#### 🔴 5. Borrar un entrenamiento (`DELETE /api/v1/workouts/{workoutId}`)
> **¿Qué hace?** Elimina definitivamente el entrenamiento de la base de datos.
- Despliega la barra roja **DELETE /api/v1/workouts/{workoutId}**.
- Pulsa **Try it out**.
- En `workoutId` pon el código del entrenamiento que quieras borrar.
- Pulsa **Execute**. Te devolverá: `"Workout con id ... eliminado"`.

---

#### 🏆 6. Ver los récords de un entrenamiento (`GET /api/v1/workouts/{workoutId}/records`)
> **¿Qué hace?** Te dice qué atletas han hecho ese entrenamiento y qué marcas/tiempos han conseguido.
- Despliega **GET /api/v1/workouts/{workoutId}/records**.
- Pulsa **Try it out**, pon `4a3a9acf-c2ec-4600-a457-3f1bfa52618b` y pulsa **Execute**.

---

### 3️⃣ Los 2 Botones de Récords y Marcas (Records)

#### 🟢 7. Ver todas las marcas del gimnasio (`GET /api/v1/records`)
> **¿Qué hace?** Muestra el listado de todos los récords de todos los atletas.
- Despliega **GET /api/v1/records** ➔ **Try it out** ➔ **Execute**.

#### 🟢 8. Ver una marca concreta (`GET /api/v1/records/{recordId}`)
> **¿Qué hace?** Consulta el récord de un atleta en particular.
- Despliega **GET /api/v1/records/{recordId}**.
- En `recordId` pega: `4819e075-801a-471a-874b-6ca035dbf1a2` y pulsa **Execute**.

---

## 📊 Tabla Resumen de Rutas

| Botón | Ruta | ¿Para qué sirve? | ¿Qué tienes que poner? |
| :---: | :--- | :--- | :--- |
| 🟢 `GET` | `/api/v1/workouts` | Ver todos los entrenamientos | Nada, solo pulsar *Execute* |
| 🟢 `GET` | `/api/v1/workouts/{id}` | Ver un entrenamiento concreto | El código `id` del entrenamiento |
| 🔵 `POST` | `/api/v1/workouts` | Añadir un entrenamiento nuevo | El JSON con nombre y ejercicios |
| 🟡 `PATCH` | `/api/v1/workouts/{id}` | Cambiar datos de un entrenamiento | El código `id` y los datos nuevos |
| 🔴 `DELETE` | `/api/v1/workouts/{id}` | Borrar un entrenamiento | El código `id` que quieres borrar |
| 🟢 `GET` | `/api/v1/workouts/{id}/records` | Ver quién ha hecho ese entreno | El código `id` del entrenamiento |
| 🟢 `GET` | `/api/v1/records` | Ver todas las marcas de atletas | Nada, solo pulsar *Execute* |
| 🟢 `GET` | `/api/v1/records/{id}` | Ver una marca específica | El código `id` del récord |

---

## 💻 Cómo probarlo también con Postman

Si prefieres usar **Postman** en lugar de Swagger:
1. En la raíz de este proyecto tienes el archivo listo: [`postman_collection.json`](postman_collection.json).
2. Abre Postman, dale al botón **Import** y arrastra ese archivo.
3. Ya tendrás todas las peticiones guardadas y la contraseña `EduApiKey` configurada automáticamente.

---

## 🛠️ Tecnologías Utilizadas

- **Lenguaje:** TypeScript 5 & Node.js
- **Servidor Web:** Express 5
- **Base de Datos:** MariaDB Community Server 12.3.3 (MariaDB Cloud SkySQL) con SSL
- **Documentación:** Swagger UI & OpenAPI 3.0
- **Hosting en la nube:** Render Web Service

---

## 👨‍💻 Autor

Desarrollado por **Eduardo Cruz Muñoz**  
- **Portfolio:** [eduardocruzdev.netlify.app](https://eduardocruzdev.netlify.app/)  
- **LinkedIn:** [linkedin.com/in/eduardo-cruz-muñoz2202](https://www.linkedin.com/in/eduardo-cruz-mu%C3%B1oz2202/)  
- **GitHub:** [@EduardoCruzmunioz](https://github.com/EduardoCruzmunioz)
