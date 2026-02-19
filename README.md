# Andres Sanchez — IWH I Practicum
## Integración Bot con HubSpot | Universidad ALK

Aplicación Node.js + Express que integra un Custom Object de HubSpot ("Solicitudes Bot Admisiones") para listar y crear registros de aspirantes capturados por el bot IA de admisiones.

---

## Vista del Custom Object en HubSpot

> **Link al list view:**
> https://app.hubspot.com/contacts/51096073/objects/2-57864141/views/all/list

---

## Estructura del Proyecto

```
.
├── public/
│   └── css/
│       └── style.css                 # Estilos globales
├── views/
│   ├── contacts.pug                  # Vista de contactos HubSpot
│   ├── homepage.pug                  # Vista principal con tabla de registros
│   └── updates.pug                   # Formulario para crear nuevos registros
├── .env                              # Variables de entorno (gitignoreado)
├── .gitignore
├── index.js                          # App Express — punto de entrada
├── package.json
└── README.md
```

---

## Requisitos

- Node.js v16 o superior
- Cuenta HubSpot con Private App configurada
- Custom Object "Solicitudes Bot Admisiones" creado en HubSpot

---

## Configuración HubSpot (Pasos manuales)

### 1. Crear el Custom Object

1. Ir a **Settings > Data Management > Custom Objects > Create**
2. Nombre: `Solicitudes Bot Admisiones`
3. Agregar propiedades:
   - `name` — Single-line text (requerido, label "Name")
   - `interest_program` — Single-line text (programa de interés del aspirante)
   - `source_channel` — Enumeration (WhatsApp / Webchat / Landing)
4. Asociar el custom object con Contacts
5. Crear mínimo 3 registros de prueba
6. Copiar el **Object Type ID** de la URL (formato `2-XXXXXXXX`)

### 2. Crear la Private App

1. Ir a **Settings > Integrations > Private Apps**
2. Nombre: `Andres's Practicum Private App`
3. Scopes requeridos:
   - `crm.objects.custom.read`
   - `crm.objects.custom.write`
   - `crm.schemas.custom.read`
   - `crm.schemas.custom.write`
   - `crm.objects.contacts.read`
   - `crm.objects.contacts.write`
4. Copiar el **Access Token** generado

---

## Instalación y Ejecución

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd andres-sanchez-iwh-i-practicum

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env   # o crear .env manualmente
```

Editar `.env`:
```
HUBSPOT_ACCESS_TOKEN=pat-na1-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
CUSTOM_OBJECT_TYPE=2-XXXXXXXX
PORT=3000
```

```bash
# 4. Ejecutar la aplicación
npm start
```

Abrir en el navegador: **http://localhost:3000**

---

## Rutas de la Aplicación

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/` | Lista todos los registros del custom object en una tabla HTML |
| `GET` | `/contacts` | Lista los contactos de HubSpot |
| `GET` | `/update-cobj` | Renderiza el formulario para crear un nuevo registro |
| `POST` | `/update-cobj` | Crea el registro en HubSpot y redirige a `/` |

---

## Stack Tecnológico

| Tecnología | Uso |
|------------|-----|
| Node.js | Runtime |
| Express 4 | Framework web |
| Axios 1 | Cliente HTTP para HubSpot API |
| Pug 3 | Motor de templates (server-side rendering) |
| dotenv | Gestión de variables de entorno |

---

## API HubSpot Utilizada

```
GET  https://api.hubapi.com/crm/v3/objects/{objectType}?properties=name,interest_program,source_channel
POST https://api.hubapi.com/crm/v3/objects/{objectType}
```

Autenticación: `Authorization: Bearer {HUBSPOT_ACCESS_TOKEN}`

---

## Workflow Git

```bash
# Rama de desarrollo
git branch working-branch
git checkout working-branch

# Primer commit (mensaje exacto requerido)
git commit -m "First commit to my Integrating With HubSpot I: Foundations practicum repository."

# Al finalizar, merge a main
git checkout main
git merge working-branch
```
