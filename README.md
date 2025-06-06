# Backend Banquito - Sistema Bancario Cooperativo

Backend API REST para el sistema bancario cooperativo Banquito, desarrollado con Node.js, Express y PostgreSQL.

## 🚀 Características

- **Autenticación JWT** con roles (admin, member, external)
- **Gestión de Miembros** con scoring crediticio
- **Sistema de Préstamos** con cronogramas de pago
- **Solicitudes de Préstamo** con flujo de aprobación
- **Planes de Ahorro** personalizables
- **API REST** completa con documentación Swagger
- **Validación de datos** con Joi
- **Rate Limiting** y middleware de seguridad
- **Base de datos PostgreSQL** con Sequelize ORM

## 📋 Requisitos Previos

- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL >= 12
- Git

## 🛠️ Instalación

### 1. Clonar o preparar el proyecto

```bash
cd Backend-banquito
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar base de datos PostgreSQL

```bash
# Conectar a PostgreSQL como superuser
psql -U postgres

# Crear usuario y base de datos
CREATE USER banquito_user WITH PASSWORD 'banquito_password';
CREATE DATABASE banquito_db OWNER banquito_user;
GRANT ALL PRIVILEGES ON DATABASE banquito_db TO banquito_user;

# Salir de psql
\q
```

### 4. Configurar variables de entorno

Copiar el archivo `.env.example` a `.env` y ajustar los valores:

```bash
cp .env.example .env
```

Editar `.env` con tus configuraciones:

```env
# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=banquito_db
DB_USER=banquito_user
DB_PASSWORD=banquito_password

# JWT (IMPORTANTE: Cambiar en producción)
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui_32_caracteres_minimo
JWT_REFRESH_SECRET=tu_refresh_secret_diferente_aqui

# CORS
FRONTEND_URL=http://localhost:3000
```

### 5. Ejecutar migraciones y seeds

```bash
# Crear todas las tablas
npm run migrate

# Cargar datos de ejemplo
npm run seed
```

## 🏃‍♂️ Ejecutar el servidor

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```

El servidor estará disponible en: `http://localhost:3001`

## 📚 Documentación API

Una vez que el servidor esté corriendo, la documentación Swagger estará disponible en:

**http://localhost:3001/api/v1/docs**

## 🔐 Usuarios de Prueba

El seed incluye estos usuarios de ejemplo:

| Usuario | Contraseña | Rol | Descripción |
|---------|------------|-----|-------------|
| `admin` | `123456` | admin | Administrador del sistema |
| `juan.perez` | `123456` | member | Miembro Juan Pérez |
| `maria.rodriguez` | `123456` | member | Miembro María Rodriguez |

## 🛡️ Endpoints Principales

### Autenticación
- `POST /api/v1/auth/login` - Iniciar sesión
- `POST /api/v1/auth/refresh-token` - Renovar token
- `GET /api/v1/auth/me` - Perfil del usuario
- `POST /api/v1/auth/logout` - Cerrar sesión

### Miembros
- `GET /api/v1/members` - Listar miembros
- `POST /api/v1/members` - Crear miembro
- `GET /api/v1/members/:id` - Obtener miembro
- `PUT /api/v1/members/:id` - Actualizar miembro
- `PUT /api/v1/members/:id/savings-plan` - Actualizar plan de ahorros

### Préstamos
- `GET /api/v1/loans` - Listar préstamos
- `POST /api/v1/loans` - Crear préstamo
- `GET /api/v1/loans/:id` - Obtener préstamo
- `POST /api/v1/loans/:id/payments` - Registrar pago
- `GET /api/v1/loans/:id/schedule` - Cronograma de pagos

### Solicitudes de Préstamo
- `GET /api/v1/loan-requests` - Listar solicitudes
- `POST /api/v1/loan-requests` - Crear solicitud
- `PUT /api/v1/loan-requests/:id/approve` - Aprobar solicitud
- `PUT /api/v1/loan-requests/:id/reject` - Rechazar solicitud

## 🗄️ Estructura de la Base de Datos

### Tablas Principales:
- `members` - Información de miembros
- `users` - Usuarios del sistema
- `loans` - Préstamos activos
- `loan_requests` - Solicitudes de préstamo
- `payments` - Registro de pagos
- `savings_plans` - Planes de ahorro
- `settings` - Configuración del sistema

## 🔧 Scripts Disponibles

```bash
npm start          # Iniciar servidor en producción
npm run dev        # Iniciar en modo desarrollo con nodemon
npm test           # Ejecutar pruebas
npm run migrate    # Ejecutar migraciones
npm run seed       # Ejecutar seeders
npm run db:setup   # Migrar y hacer seed en un comando
npm run lint       # Revisar código con ESLint
npm run format     # Formatear código con Prettier
```

## 🏗️ Estructura del Proyecto

```
Backend-banquito/
├── src/
│   ├── config/           # Configuraciones
│   ├── controllers/      # Controladores de rutas
│   ├── middleware/       # Middleware personalizado
│   ├── models/          # Modelos de Sequelize
│   ├── routes/          # Definición de rutas
│   ├── services/        # Lógica de negocio
│   ├── utils/           # Utilidades
│   ├── validators/      # Validadores Joi
│   ├── database/        # Migraciones y seeds
│   └── app.js           # Punto de entrada
├── logs/                # Archivos de log
├── uploads/             # Archivos subidos
├── package.json
├── .env                 # Variables de entorno
└── README.md
```

## 🔒 Seguridad

- Autenticación JWT con tokens de acceso y renovación
- Middleware de seguridad con Helmet
- Rate limiting por IP
- Validación estricta de entrada de datos
- Encriptación de contraseñas con bcrypt
- CORS configurado

## 🐛 Debugging

### Logs
Los logs se guardan en el directorio `logs/` y en la consola durante desarrollo.

### Health Check
Verificar estado del servidor: `GET /api/v1/health`

### Variables de Entorno de Debug
```env
NODE_ENV=development
LOG_LEVEL=debug
```

## 📝 Modelo de Datos

### Member (Miembro)
```javascript
{
  id: number,
  name: string,
  dni: string,
  shares: number,
  guarantee: decimal,
  creditScore: number (1-90),
  creditRating: 'green' | 'yellow' | 'red',
  phone: string,
  email: string,
  address: string,
  isActive: boolean
}
```

### Loan (Préstamo)
```javascript
{
  id: number,
  memberId: number,
  originalAmount: decimal,
  remainingAmount: decimal,
  monthlyInterestRate: decimal,
  weeklyPayment: decimal,
  totalWeeks: number,
  currentWeek: number,
  status: 'current' | 'overdue' | 'paid' | 'cancelled',
  startDate: date,
  dueDate: date
}
```

## ⚠️ Notas Importantes

1. **Cambiar secrets JWT** en producción
2. **Configurar HTTPS** en producción
3. **Configurar backups** de base de datos
4. **Monitorear logs** en producción
5. **Actualizar dependencias** regularmente

## 🚀 Despliegue

Para despliegue en producción:

1. Configurar variables de entorno de producción
2. Ejecutar migraciones: `npm run migrate`
3. Iniciar con PM2 o similar: `npm start`
4. Configurar proxy reverso (nginx)
5. Configurar HTTPS

## 🤝 Contribuir

1. Fork el proyecto
2. Crear rama feature: `git checkout -b feature/nueva-caracteristica`
3. Commit cambios: `git commit -m 'Agregar nueva característica'`
4. Push a la rama: `git push origin feature/nueva-caracteristica`
5. Abrir Pull Request

## 📞 Soporte

Para soporte técnico o dudas sobre la implementación, contactar al equipo de desarrollo.

---

**Banquito Backend v1.0.0** - Sistema Bancario Cooperativo