# CODESA-FRONT

Este proyecto es la aplicación frontend para el sistema de gestión escolar CODESA, construido con Angular.

## Prerrequisitos

Antes de comenzar, asegúrate de tener lo siguiente instalado:

- **Docker Desktop:** Esencial para ejecutar la aplicación y sus dependencias (backend y base de datos). Puedes descargarlo desde el sitio web oficial de Docker [aquí](https://www.docker.com/products/docker-desktop/).

## Tecnologías Utilizadas (Frontend)

- **Angular:** Versión 17.2.0
- **PrimeNG:** Librería de componentes de UI (Versión 17.6.0)
- **TypeScript:** Lenguaje utilizado para el desarrollo (Versión ~5.3.2)
- **Tailwind CSS:** Para estilos responsivos y basados en utilidades.

## Estructura del Proyecto

El proyecto sigue una estructura modular para organizar las funcionalidades:

src/
├── app/
│ ├── administrative/ // Módulo para la gestión de personal administrativo
│ ├── auth/ // Componentes y servicios relacionados con la autenticación
│ ├── course/ // Módulo para la gestión de cursos
│ ├── enrollment/ // Módulo para la gestión de inscripciones (Opcional/Bonus)
│ ├── layouts/ // Define diferentes layouts de la aplicación (auth, dashboard)
│ │ ├── auth-layout/
│ │ └── dashboard-layout/
│ ├── person/ // Módulo central para la gestión base de Personas
│ ├── services/ // Servicios compartidos para el cambio de los temas
│ ├── shared/ // Componentes, directivas compartidas, etc.
│ ├── student/ // Módulo para la gestión de estudiantes
│ ├── teacher/ // Módulo para la gestión de profesores
│ ├── app.component.ts
│ ├── app.config.ts
│ └── app.routes.ts // Define las rutas de la aplicación
├── assets/
│ └── images/
├── environments/ // Configuraciones específicas del entorno (desarrollo, producción)
├── themes/ // Archivos de temas de PrimeNG
└── styles.css // Estilos globales

## Cómo Ejecutar la Aplicación

Esta aplicación está diseñada para ejecutarse utilizando Docker Compose, lo que orquestará tanto el frontend, como el backend y la base de datos.

1.  **Navega a la raíz del proyecto:**
    ```bash
    cd codesa-front
    ```
2.  **Inicia los servicios:**

    ```bash
    docker compose up --build
    ```

    Este comando realizará lo siguiente:

    - Construirá las imágenes de Docker para el frontend.
    - Iniciará los contenedores.
    - El frontend de Angular estará disponible en `http://localhost:4200/`.

    _(Nota: El flag `--build` asegura que las imágenes se reconstruyan si hay cambios en el Dockerfile o en el contexto de construcción.)_

## Manual de Usuario Básico (Frontend)

Este manual proporciona una guía rápida para interactuar con la aplicación.

### 1. Acceso a la Aplicación

- Una vez que el contenedor de Docker esté en funcionamiento, abre tu navegador web y navega a: `http://localhost:4200/`

### 2. Navegación Principal

La aplicación está diseñada con un layout de dashboard que incluye un menú de navegación. Desde aquí podrás acceder a los diferentes módulos:

- **Módulo de Personas:** Este módulo central permite gestionar una entidad base `Persona`. Las sub-entidades (Estudiantes, Profesores, Administrativos) heredan de `Persona`.
- **Módulo de Estudiantes:** Gestiona la información específica de los estudiantes.
- **Módulo de Profesores:** Gestiona la información específica de los profesores.
- **Módulo de Administrativos:** Gestiona la información específica del personal administrativo (Opcional/Bonus).
- **Módulo de Cursos:** Gestiona la creación y administración de los cursos (Opcional/Bonus).
- **Módulo de Inscripciones:** Gestiona la relación de estudiantes con los cursos a los que están inscritos (Opcional/Bonus).

### 3. Funcionalidades Comunes en los Módulos de Gestión

Cada módulo de gestión (Personas, Estudiantes, Profesores, etc.) incluye las siguientes funcionalidades básicas:

- **Listado de Entidades:**
  - Al ingresar a un módulo, verás una tabla con la lista de las entidades correspondientes (ej. lista de personas, lista de estudiantes).
  - **Paginación:** La tabla incluirá controles de paginación en la parte inferior para navegar entre las diferentes páginas de registros.
  - **Ordenamiento:** Las columnas principales (ej. Nombre, Apellido) son ordenables. Haz clic en el encabezado de la columna para ordenar los datos de forma ascendente o descendente.
- **Creación de Nuevos Registros:**
  - Busca un botón con la etiqueta **"Nueva (nombre del modulo especifico)"** (ej. "Nueva Persona", "Nuevo Estudiante"), generalmente ubicado en la parte superior derecha de la tabla.
  - Al hacer clic, se abrirá un formulario para ingresar los datos de la nueva entidad.
- **Edición de Registros Existentes:**
  - En la columna "Acciones" de cada fila de la tabla, encontrarás un icono de **lápiz** (edición).
  - Haz clic en el icono para abrir el formulario con los datos pre-rellenados de la entidad seleccionada, listos para ser modificados.
- **Eliminación de Registros:**
  - En la columna "Acciones" de cada fila, encontrarás un icono de **papelera** (eliminar).
  - Al hacer clic, aparecerá un **diálogo de confirmación** para asegurarte de que deseas eliminar el registro. Confirma o cancela la acción.
  - _Nota: La eliminación de una entidad base (Persona) podría afectar a las entidades heredadas (Estudiante, Profesor, Administrativo) asociadas._

### 4. Formularios de Creación/Edición

- **Campos Requeridos:** Los campos obligatorios estarán claramente indicados y el formulario no se podrá enviar hasta que se completen.
- **Validaciones:**
  - **Formato de Email:** Se validará que la entrada sea un email válido.
  - **Formato de Teléfono:** Se validará el formato numérico del teléfono.
  - **Validación de Fechas:** Las fechas (ej. Fecha de Nacimiento, Fecha de Contratación) tendrán validaciones de formato.
  - Mensajes de error claros aparecerán debajo de los campos si hay algún problema de validación.
- **Guardar/Cancelar:** Los formularios tendrán botones para "Guardar" los cambios o "Cancelar" y volver al listado.

### 5. Consideraciones de Diseño

- **Diseño Responsive:** La aplicación está diseñada para adaptarse a diferentes tamaños de pantalla, desde dispositivos móviles hasta escritorios.
- **Tema Personalizado:** Se utiliza un tema visual basado en PrimeNG para la apariencia de la interfaz, el boton para la misma se encuentra en la parte derecha del topbar.
