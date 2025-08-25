# CRUD de Talentos - Proyecto Next.js + Prisma + PostgreSQL

Este proyecto implementa un CRUD completo para gestionar talentos, referentes técnicos e interacciones. La aplicación incluye backend con API usando **Next.js App Router** y frontend con UI reutilizable (shadcn/ui).  

Además, incorpora autenticación básica (registro/login) y un seed inicial para poblar la base de datos.  

---

## Contenido

- [Modelo de datos](#modelo-de-datos)  
- [Autenticación](#autenticación)  
- [Rutas API](#rutas-api)  
- [Frontend](#frontend)  
- [Base de datos y Seed](#base-de-datos-y-seed)  
- [Instalación y ejecución](#instalación-y-ejecución)  
- [Tests](#tests)  

---

## Modelo de datos

### User

- `id`: String (PK, cuid)  
- `email`: String (único)  
- `firstName`: String  
- `lastName`: String  
- `password`: String (hash)  
- `createdAt`: DateTime  
- `updatedAt`: DateTime  

### Talento

- `id`: Int (PK, autoincrement)  
- `nombre_y_apellido`: String  
- `seniority`: Enum (JUNIOR, SEMI_SENIOR, SENIOR)  
- `rol`: String  
- `estado`: Enum (ACTIVO, INACTIVO)  
- `referenteLiderId`: Int? (FK hacia `ReferenteTecnico`)  
- `referenteMentorId`: Int? (FK hacia `ReferenteTecnico`)  
- Relaciones:  
  - `referenteLider`: ReferenteTecnico (1)  
  - `referenteMentor`: ReferenteTecnico (1)  
  - `interacciones`: Interaccion[] (1 a muchos)  
- `createdAt`: DateTime  
- `updatedAt`: DateTime  

### ReferenteTecnico

- `id`: Int (PK, autoincrement)  
- `nombre_y_apellido`: String  
- Relaciones:  
  - `liderTalentos`: Talento[] (uno a muchos)  
  - `mentorTalentos`: Talento[] (uno a muchos)  
- `createdAt`: DateTime  
- `updatedAt`: DateTime  

### Interaccion

- `id`: Int (PK, autoincrement)  
- `talentoId`: Int (FK hacia Talento)  
- `tipo_de_interaccion`: String  
- `detalle`: String  
- `estado`: Enum (INICIADA, EN_PROGRESO, FINALIZADA)  
- `fecha`: DateTime  
- `fecha_de_modificacion`: DateTime  
- Relación:  
  - `talento`: Talento (muchos a 1)  

---

## Autenticación

El proyecto incluye autenticación básica:

1. **Registro**: El usuario se registra con email, nombre, apellido y contraseña.  
2. **Login**: Se obtiene un token JWT que se envía en el header `Authorization: Bearer <token>` para acceder a rutas protegidas.  

---

## Rutas API

### Talentos

- `GET /api/talents` → Listar todos los talentos  
- `GET /api/talents/[id]` → Obtener talento por ID  
- `POST /api/talents` → Crear nuevo talento  
- `PUT /api/talents/[id]` → Actualizar talento  
- `DELETE /api/talents/[id]` → Eliminar talento  

### Referentes Técnicos

- `GET /api/referentes` → Listar todos los referentes  
- `POST /api/referentes` → Crear referente  
- `GET /api/referentes/[id]` → Obtener referente por ID  
- `PUT /api/referentes/[id]` → Actualizar referente  
- `DELETE /api/referentes/[id]` → Eliminar referente  

### Interacciones

- `GET /api/interacciones` → Listar interacciones  
- `POST /api/interacciones` → Crear interacción  
- `PUT /api/interacciones/[id]` → Actualizar interacción  
- `DELETE /api/interacciones/[id]` → Eliminar interacción  

### Usuarios

- `GET /api/users` → Listar todos los usuarios  
- `GET /api/users/[id]` → Obtener usuario por ID  
- `POST /api/users` → Crear usuario (requiere token admin)  
- `PUT /api/users/[id]` → Actualizar usuario (requiere token admin)  
- `DELETE /api/users/[id]` → Eliminar usuario (requiere token admin)  

### Autenticación

- `POST /api/auth/register` → Registro de usuario  
  - Body: `{ email, firstName, lastName, password }`  
  - Retorna token JWT y datos del usuario (sin password)  

- `POST /api/auth/login` → Login de usuario  
  - Body: `{ email, password }`  
  - Retorna token JWT en caso de credenciales correctas  

> El token JWT obtenido al logearse se debe enviar en el header `Authorization: Bearer <token>` para acceder a rutas protegidas.

---

## Frontend

- UI construida con **shadcn/ui**: tablas, formularios, modales, toasts.  
- Funcionalidades: listar, crear, editar y eliminar talentos.  
- Paginación y filtrado soportado mediante query params (`?page=2&sort=asc`).  
- Validaciones en frontend reflejan las del backend con tipado estricto.  

---

## Base de datos y Seed

- Base de datos: **PostgreSQL**  
- Conexión mediante **Prisma**.  
- Archivo de seed (`prisma/seed.ts`) inicializa:  
  - Usuarios  
  - Talentos  
  - Referentes técnicos  
  - Interacciones  

- Prisma maneja transacciones y relaciones para evitar inconsistencias.  
- Uso de `select` y `include` para consultas eficientes.  

---

## Instalación y ejecución

```bash
# Instalar dependencias
pnpm install

# Levantar base de datos con Docker Compose
docker compose up -d

# Generar cliente Prisma
pnpm prisma generate

# Ejecutar migraciones
pnpm prisma db push

# Cargar datos iniciales
pnpm prisma db seed

# Levantar aplicación
pnpm dev

# Ejecutar tests con coverage
pnpm run test -- --coverage