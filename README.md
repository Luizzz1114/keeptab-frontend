<h1 align="center">KeepTab - Frontend</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Vue.js-3.x-4FC08D?logo=vuedotjs&logoColor=white" alt="Vue.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/PrimeVue-4.x-PrimeVue?logoColor=white" alt="PrimeVue" />
  <img src="https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-4.x-06B6D4?logo=tailwindcss&logoColor=white" alt="TailwindCSS" />
</p>

<p align="center">
  Interfaz web para sistema POS y control de inventario. Consume la API RESTful del KeepTab - Backend para la administración de productos, clientes, transacciones de ventas, control de abonos y seguimiento de jornadas de trabajo.
</p>

> [!IMPORTANT]
> Este proyecto forma parte del ecosistema **KeepTab**, que incluye el [Frontend](https://github.com/Luizzz1114/keeptab-frontend) y el [Backend](https://github.com/Luizzz1114/keeptab-backend).

## Tabla de Contenidos

- [Características Principales](#características-principales)
- [Tecnologías](#tecnologías)
- [Arquitectura del Proyecto](#arquitectura-del-proyecto)
- [Requisitos Previos](#requisitos-previos)
- [Instalación y Configuración](#instalación-y-configuración)
- [Ejecución](#ejecución)
- [Estructura de Vistas](#estructura-de-vistas)
- [Integración con el Backend](#integración-con-el-backend)
- [Scripts Disponibles](#scripts-disponibles)
- [Autor](#autor)

## Características Principales

- **Gestión de Productos** — registro, actualización y eliminación de productos con control de stock y precios
- **Control de Clientes** — registro de clientes con historial de compras
- **Sistema de Ventas** — registro de ventas con detalles y seguimiento de pagos desde el mostrador
- **Abonos** — registro y gestión de pagos parciales para ventas a crédito
- **Jornadas** — control de turnos y jornadas de trabajo
- **Gestión de Usuarios** — administración de cuentas de acceso al sistema
- **Cuentas Claras** — módulo de cuentas claras para gestión de clientes y deudas
- **Diseño Responsivo** — interfaz adaptativa para desktop y dispositivos móviles
- **UI con PrimeVue** — componentes UI modernos y profesionales

## Tecnologías

| Tecnología                                                                | Versión | Propósito                   |
| ------------------------------------------------------------------------- | ------- | --------------------------- |
| [Vue.js](https://vuejs.org/)                                              | 3.x     | Framework frontend reactivo |
| [TypeScript](https://www.typescriptlang.org/)                             | 5.x     | Tipado estático             |
| [Vite](https://vitejs.dev/)                                               | 8.x     | Build tool y dev server     |
| [PrimeVue](https://primevue.org/)                                         | 4.x     | Componentes UI              |
| [PrimeIcons](https://primeicons.org/)                                     | 6.x     | Iconos                      |
| [TailwindCSS](https://tailwindcss.com/)                                   | 4.x     | Framework de estilos        |
| [Pinia](https://pinia.vuejs.org/)                                         | 3.x     | State management            |
| [Vue Router](https://router.vuejs.org/)                                   | 5.x     | Enrutamiento                |
| [Axios](https://axios-http.com/)                                          | 1.x     | Cliente HTTP                |
| [Zod](https://zod.dev/)                                                   | 4.x     | Validación de esquemas      |
| [vue-tsc](https://github.com/vuejs/language-tools/tree/main/packages/tsc) | 3.x     | Type checking para Vue      |

## Arquitectura del Proyecto

El frontend sigue una arquitectura basada en **Vistas/Componentes** con separación clara entre lógica de presentación y estado. Utiliza el patrón de diseño **Composition API** de Vue 3 para una mejor reutilización y organización del código.

```text
keeptab-frontend/          # Frontend — Vue 3 + PrimeVue + TailwindCSS
│
├── src/
│   ├── api/               # Configuración y servicios de API
│   │   └── services/      # Servicios para cada entidad (auth, productos, ventas, etc.)
│   ├── assets/            # Recursos estáticos (imágenes, iconos, fuentes)
│   ├── components/        # Componentes reutilizables
│   ├── composables/       # Composables de Vue (lógica reutilizable)
│   ├── plugins/           # Plugins de Vue
│   ├── router/            # Configuración de rutas con Guards
│   ├── schemas/           # Esquemas Zod para validación de formularios
│   ├── stores/            # Stores de Pinia para gestión de estado
│   ├── types/             # Tipos TypeScript globales
│   ├── utils/             # Utilidades y funciones helper
│   ├── views/             # Vistas principales
│   ├── App.vue            # Componente raíz
│   ├── main.ts            # Punto de entrada
│   └── styles.css         # Estilos globales
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

| Herramienta | Versión mínima | Descarga                          |
| ----------- | -------------- | --------------------------------- |
| Node.js     | 20.x           | [nodejs.org](https://nodejs.org/) |
| pnpm        | 10.x           | [pnpm.io](https://pnpm.io/)       |

> [!IMPORTANT]
> El backend debe estar ejecutándose en `http://localhost:3000/keeptab-api` para que el frontend funcione correctamente. Consulta el [README del backend](https://github.com/Luizzz1114/keeptab-backend) para más información.

## Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/Luizzz1114/keeptab-frontend.git
cd keeptab-frontend
```

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Configurar variables de entorno (opcional)

Si necesitas personalizar la URL del backend, crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:3000/keeptab-api
```

| Variable       | Descripción                | Por defecto                         |
| -------------- | -------------------------- | ----------------------------------- |
| `VITE_API_URL` | URL base de la API RESTful | `http://localhost:3000/keeptab-api` |

## Ejecución

### Modo desarrollo

Inicia el servidor de desarrollo con Hot Module Replacement:

```bash
pnpm dev
```

> [!TIP]
> La aplicación estará disponible en `http://localhost:5173`

### Modo producción

Para compilar la aplicación para producción:

```bash
pnpm build
```

Esto genera una versión optimizada en la carpeta `dist/` que puede ser servida por cualquier servidor HTTP.

### Previsualización

Para previsualizar la versión de producción construida:

```bash
pnpm preview
```

## Estructura de Vistas

El frontend cuenta con las siguientes vistas:

### 1. Login (`/login`)

Página de autenticación:

- Ingreso de credenciales
- Validación de usuario
- Redirección según rol

### 2. Mostrador (`/mostrador`)

Página principal para realizar ventas. Incluye:

- Listado de productos disponibles
- Carrito de compras interactivo
- Selección de cliente (opcional)
- Métodos de pago (contado/crédito)
- Registro rápido de ventas

### 3. Productos (`/productos`)

Gestión del inventario de productos:

- Listado de productos
- Registro de nuevos productos
- Edición de productos existentes
- Control de stock por unidad
- Eliminación lógica de productos

### 4. Usuarios (`/usuarios`)

Administración de usuarios del sistema:

- Listado de usuarios
- Creación de nuevos usuarios
- Edición de usuarios
- Asignación de roles (USER, ADMIN)
- Eliminación de usuarios

### 5. Jornadas (`/jornadas`)

Control de jornadas de trabajo:

- Vista de jornada actual
- Apertura de nuevas jornadas
- Cierre de jornadas con cálculo de totales

### 6. Historial de Jornadas (`/jornadas/historial`)

Historial completo de jornadas:

- Listado de todas las jornadas
- Detalles de cada jornada

### 7. Cuentas Claras (`/cuentas`)

Módulo de cuentas claras:

- Gestión de clientes
- Seguimiento de deudas

## Integración con el Backend

El frontend consume la API RESTful del [backend](https://github.com/Luizzz1114/keeptab-backend). Asegúrate de que el backend esté configurado correctamente.

### Autenticación

El sistema utiliza **cookies HttpOnly** para la autenticación segura. El frontend envía credenciales en cada petición mediante la opción `credentials: 'include'`.

#### Control de Acceso (RBAC)

El sistema implementa control de acceso basado en roles:

| Rol       | Permisos                                                                    |
| --------- | --------------------------------------------------------------------------- |
| **ADMIN** | Acceso completo a todas las funcionalidades, incluyendo gestión de usuarios |
| **USER**  | Acceso al mostrador, productos, jornadas y cuentas claras                   |

> [!NOTE]
> Control de Acceso (RBAC): Las rutas del frontend están protegidas mediante Guards del router. Los usuarios con rol USER no podrán acceder a vistas administrativas como /usuarios, limitándose al mostrador, inventario y jornadas.

### Endpoints consumidos

| Entidad   | Métodos                               |
| --------- | ------------------------------------- |
| Auth      | POST login, POST refresh, POST logout |
| Productos | GET, POST, PATCH, DELETE              |
| Clientes  | GET, POST, PATCH, DELETE              |
| Ventas    | GET, POST, DELETE                     |
| Abonos    | GET, POST                             |
| Jornadas  | GET, POST, PATCH, DELETE              |
| Usuarios  | GET, POST, PATCH, DELETE              |

> [!NOTE]
> Consulta la documentación completa de la API en el [README del backend](https://github.com/Luizzz1114/keeptab-backend).

## Scripts Disponibles

| Comando            | Descripción                                                  |
| :----------------- | :----------------------------------------------------------- |
| `pnpm dev`         | Inicia el servidor de desarrollo con Hot Module Replacement. |
| `pnpm build`       | Compila la aplicación para producción (type-check + build).  |
| `pnpm build-only`  | Compila la aplicación sin type-check.                        |
| `pnpm preview`     | Previsualiza la versión de producción.                       |
| `pnpm type-check`  | Ejecuta verificación de tipos con vue-tsc.                   |
| `pnpm lint`        | Ejecuta linters (oxlint + eslint).                           |
| `pnpm lint:oxlint` | Ejecuta oxlint con auto-fix.                                 |
| `pnpm lint:eslint` | Ejecuta eslint con auto-fix.                                 |
| `pnpm format`      | Formatea el código con Prettier.                             |

## Autor

Luis Cortesía
