# Backoffice - Backend

## Descripción

Este es el backend del sistema **Backoffice**, diseñado para gestionar productos, tiendas, y otras operaciones de negocio. Utiliza múltiples tecnologías como **Node.js**, **PostgreSQL**, y servicios externos como **AWS S3**, **Redis** y **Swagger** para documentación de la API.

## Características principales

- **Autenticación JWT** mediante Cognito de AWS.
- **CRUD de productos** y categorías.
- **Documentación de API** con Swagger.
- **Control de layouts de tienda**.
- **Integración con Redis** para almacenamiento en caché.
- **Soporte para PostgreSQL** con Sequelize como ORM.
- **Servicios externos** como datagod para log de errores y slack para notificaciones.

## Requisitos previos

Antes de iniciar, asegúrate de tener lo siguiente instalado:

- Node.js (versión 16 o superior)
- PostgreSQL
- Redis
- AWS CLI (configurado con credenciales válidas)

## Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/tu-usuario/backoffice.git

2. Para entorno de producción:

        ```
        npm run production

3. Accede a la documentación de la API en Swagger:

        ```
        Abre tu navegador y ve a http://localhost:3500/api/docs.

## Endpoints API
El backend cuenta con varios endpoints que gestionan productos, tiendas y operaciones:

- GET /api/app-user: Gestión de usuarios.
- GET /api/product: Gestión de productos.
- GET /api/categories: Gestión de categorías.
- GET /api/store: Gestión de tiendas.
- POST /api/layout: Gestión de layouts.

Para más detalles, consulta la documentación Swagger.

## Testing
Para ejecutar los tests:

        ```
        cd src
        cd tests
        node 'nombre del test'
        ```
## Pruebas específicas incluidas:
Layout Control: Valida que el layout de la tienda coincida con el inventario.
Comparación de layouts: Compara dos layouts diferentes.
Consulta de producto por ID interno: Recupera información del producto dado un ID interno.
## Scripts útiles
**npm start**: Inicia el servidor en modo desarrollo.

### Rutas deshabilitadas
Algunas rutas y funcionalidades han sido removidas o deshabilitadas para proteger la información confidencial de la empresa para la que se desarrolló este proyecto. Sin embargo, el resto del código refleja fielmente mi trabajo y las técnicas utilizadas.

Contacto
Para cualquier duda o sugerencia, puedes contactar al equipo de desarrollo en graciana.baratti@gmail.com.