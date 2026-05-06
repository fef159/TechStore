# 🏪 TechStore - Sistema de Gestión de Inventario

Sistema web de gestión de inventario con autenticación JWT, MFA, RBAC y ABAC.

## 🛠️ Tecnologías
- Backend: Python + Flask
- Base de datos: PostgreSQL
- Frontend: React
- Contenedores: Docker + Docker Compose

## ✅ Requisitos
- Docker
- Docker Compose

## 🚀 Instalación

### 1. Clonar el repositorio
git clone [https://github.com/TU_USUARIO/techstore.git](https://github.com/fef159/TechStore.git)
cd techstore

### 2. Levantar Docker
docker-compose up --build -d

### 3. Esperar 15 segundos y ejecutar en orden

#### Insertar roles
docker-compose exec db psql -U techstore_user -d techstore_db -c "INSERT INTO roles (nombre, descripcion) VALUES ('Admin', 'Administrador del sistema'), ('Gerente', 'Gerente de tienda'), ('Empleado', 'Empleado de ventas'), ('Auditor', 'Solo lectura') ON CONFLICT (nombre) DO NOTHING;"

#### Registrar usuarios
curl -X POST http://localhost:5000/api/auth/registro -H "Content-Type: application/json" -d '{"email": "admin@techstore.com", "password": "Admin123!", "nombre_completo": "Administrador", "tienda_id": 1}'

curl -X POST http://localhost:5000/api/auth/registro -H "Content-Type: application/json" -d '{"email": "gerente@techstore.com", "password": "Gerente123!", "nombre_completo": "Gerente Lima", "tienda_id": 1}'

curl -X POST http://localhost:5000/api/auth/registro -H "Content-Type: application/json" -d '{"email": "empleado@techstore.com", "password": "Empleado123!", "nombre_completo": "Empleado Ventas", "tienda_id": 1}'

#### Asignar roles
docker-compose exec db psql -U techstore_user -d techstore_db -c "UPDATE usuario_roles SET rol_id = 1 WHERE usuario_id = 1; UPDATE usuario_roles SET rol_id = 2 WHERE usuario_id = 2; UPDATE usuario_roles SET rol_id = 3 WHERE usuario_id = 3;"

### 4. Abrir navegador
http://localhost:3000

## 👤 Credenciales de prueba
| Rol | Email | Password |
|---|---|---|
| Administrador | admin@techstore.com | Admin123! |
| Gerente | gerente@techstore.com | Gerente123! |
| Empleado | empleado@techstore.com | Empleado123! |

## 🔐 Funcionalidades
- Registro y login con JWT
- Autenticación Multi-Factor (MFA)
- Bloqueo tras 5 intentos fallidos
- RBAC: Control de acceso por roles
- ABAC: Control de acceso por atributos
