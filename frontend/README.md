## Proyecto Fifa

* **Gemini pro fue mi maestro en casi todo, cada vez que tuve un problema me apoye con la IA, hay algunas cosas que no llegue a ver por temas personales asi que gemini me ayudo con todo lo que no sabia, es una herramienta muy util**

* **Backend:**
    * **Node.js** con **Express.js** para el servidor API RESTful.
    * **MySQL** como base de datos relacional.
    * **Sequelize** como ORM para la conexión y consultas a la BBDD.
    * **JSON Web Tokens (JWT)** y **bcrypt.js** para la autenticación y el hasheo de contraseñas.
    * **CORS** para permitir la comunicación entre el frontend y el backend.
    * **xlsx** para la generación de reportes en Excel.
* **Frontend:**
    * **Angular** (versión moderna "Standalone", sin `app.module.ts`).
    * **Angular Router** para la navegación y protección de rutas.
    * **`HttpClient`** (con `withFetch()`) para el consumo de la API.
    * **`FormsModule`** para los formularios (login, edición, creación).
    * **Chart.js** (con `ng2-charts`) para los gráficos de radar.

---

## Procedimiento para Correr el Proyecto

Sigue estos pasos para levantar el proyecto localmente.

### Pre-requisitos

Asegúrate de tener instalado:
* **Node.js:** Recomendado vía `nvm` (Node Version Manager).
* **MySQL Server:** La base de datos donde vivirán los datos.
* **Angular CLI:** `npm install -g @angular/cli`

---

### 1. Configuración del Backend y Base de Datos

1.  **Moverse a la carpeta Backend:**
    ```bash
    cd fifa-proyecto/backend
    ```

2.  **Instalar dependencias de Node:**
    ```bash
    npm install
    ```

3.  **Configurar la Base de Datos MySQL:**
    * Entra a MySQL como `root`:
        ```bash
        sudo mysql -u root -p
        ```
    * Crea un usuario y una base de datos para la aplicación (es más seguro que usar `root`):
        ```sql
        CREATE DATABASE fifa_manager;
        CREATE USER 'fifa_user'@'localhost' IDENTIFIED BY 'tu_contraseña_segura';
        GRANT ALL PRIVILEGES ON fifa_manager.* TO 'fifa_user'@'localhost';
        FLUSH PRIVILEGES;
        EXIT;
        ```

4.  **Importar los Datos (El paso CRUCIAL):**
    * Los archivos `.sql` originales (`fifa_male_players.sql` y `fifa_female_players.sql`) entran en conflicto (ambos crean una tabla `players`).
    * **Paso A:** Importa la estructura y los datos de las mujeres. (Asegúrate de estar en la carpeta donde tienes tus `.sql`):
        ```bash
        mysql -u fifa_user -p fifa_manager < /ruta/a/fifa_female_players.sql
        ```
    * **Paso B:** Crea un archivo "limpio" solo con los `INSERT` de los hombres, modificando los IDs duplicados. (Este comando filtra y reemplaza los IDs por `NULL`):
        ```bash
        grep "INSERT INTO \`players\`" /ruta/a/fifa_male_players.sql | sed -E "s/\(([0-9]+),/(NULL,/g" > fifa_male_players_LIMPIO.sql
        ```
    * **Paso C:** Importa el archivo "limpio" de hombres, que ahora solo añadirá los datos sin conflictos:
        ```bash
        mysql -u fifa_user -p fifa_manager < fifa_male_players_LIMPIO.sql
        ```

5.  **Crear el Archivo de Entorno (`.env`):**
    * En la carpeta `backend`, crea un archivo `.env` con tus credenciales:
    ```ini
    DB_HOST=localhost
    DB_USER=fifa_user
    DB_PASS=tu_contraseña_segura
    DB_NAME=fifa_manager
    JWT_SECRET=una-frase-secreta-muy-larga-para-tus-tokens
    ```

6.  **Correr el Backend:**
    ```bash
    node index.js
    ```
    *El servidor debería arrancar en `http://localhost:3000` y confirmar la conexión a la BBDD.*

---

### 2. Configuración del Frontend

1.  **Abrir una SEGUNDA terminal.**

2.  **Moverse a la carpeta Frontend:**
    ```bash
    cd fifa-proyecto/frontend
    ```

3.  **Instalar dependencias de Angular:**
    ```bash
    npm install
    ```

4.  **Correr el Frontend:**
    ```bash
    ng serve -o
    ```
    *Se abrirá automáticamente tu navegador en `http://localhost:4200`.*

---

## Decisiones Técnicas y Funcionales

Durante el desarrollo se tomaron las siguientes decisiones clave:

### Arquitectura y Stack

* **Full-Stack Separado:** Se eligió una arquitectura desacoplada (API de Node, Cliente de Angular) como se solicitó, lo que permite que el frontend y el backend escalen de forma independiente.
* **Sequelize (ORM):** Se eligió Sequelize para el backend para abstraer las consultas SQL. Esto fue vital para construir los filtros dinámicos (Funcionalidad 1), donde usamos `Op.like` y la función `fn('LOWER', col(...))` para lograr búsquedas insensibles a mayúsculas.

### Manejo de Base de Datos

* **Conflicto de Importación:** El desafío más grande fue la importación de datos. La decisión fue usar el archivo `fifa_female_players.sql` para definir la estructura de la tabla `players` y luego "operar" el archivo `fifa_male_players.sql` usando comandos de Linux (`grep` y `sed`) para extraer solo los `INSERT` y reemplazar los IDs primarios por `NULL`, permitiendo que MySQL los auto-genere sin conflictos.
* **Flexibilización de `NOT NULL`:** El segundo gran desafío fue el `POST /api/players` (Crear jugador). La BBDD original tenía docenas de campos `NOT NULL`, lo que hacía imposible la creación simple. **Decisión:** Se ejecutó un script `ALTER TABLE ... MODIFY COLUMN ... NULL` en la BBDD de MySQL para "relajar" todos los campos no esenciales (como `league_id`, `player_face_url`, etc.), permitiendo que nuestra API solo se preocupe de los campos que usamos en la app.

### Configuración de Angular (Standalone y SSR)

El proyecto se creó con una versión moderna de Angular (Standalone, sin `app.module.ts`) y con Server-Side Rendering (SSR) activado, lo que generó varios desafíos de configuración:

1.  **Error `localStorage is not defined`:** Este error ocurría porque el `AuthGuard` y el `AuthService` intentaban acceder a `localStorage` (que solo existe en el navegador) durante el renderizado en el servidor (SSR).
    * **Decisión:** Inyectar `PLATFORM_ID` y `isPlatformBrowser` en el `AuthService` y envolver todas las llamadas a `localStorage` (ej. `getToken`, `logout`) en un `if (this.isBrowser) { ... }`.

2.  **Error `NG0908: Angular requires Zone.js`:** Este error persistió a pesar de importar `zone.js` en `main.ts`.
    * **Decisión:** El error era doble. `zone.js` (en minúscula) debía importarse en la **Línea 1** tanto de `main.ts` (para el cliente) como de `main.server.ts` (para el servidor).

3.  **Error del Gráfico en Blanco:** El gráfico de radar (Funcionalidad 2) no aparecía, aunque los datos llegaban correctamente (visto en la consola). Era un problema de Detección de Cambios de Angular.
    * **Decisión:** Se tomaron dos acciones:
        1.  En `player-detail.ts`, la función `updateChartData` fue modificada para crear un objeto `radarChartData` **nuevo** en lugar de mutar el existente (lo que `ng2-charts` no detectaba).
        2.  Se inyectó `ChangeDetectorRef` y se llamó a `this.cdr.detectChanges()` manualmente justo después de recibir la respuesta de la API, forzando a Angular a "refrescar" la vista.
