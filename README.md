# 🏢 EstateFlow — Real Estate Sales CRM

A full-stack Real Estate CRM designed for sales teams to manage leads, track the sales pipeline, monitor property availability, and securely book property units.

EstateFlow supports **Admin** and **Sales Employee** roles with a focus on a simple sales workflow, responsive UI, and reliable booking management.

---

## ✨ Key Features

### 👥 Lead Management

- Create and edit leads
- Search leads by name, phone, or email
- View detailed lead information
- Assign leads to sales employees
- Track lead stages
- Add sales notes
- Schedule follow-up dates

### 📊 Lead Pipeline

```text
New
 ↓
Contacted
 ↓
Site Visit
 ↓
Interested
 ↓
Negotiation
 ↓
Booked

 └──────────────→ Lost
```

### 🏢 Property Management

Properties are organized into three levels:

```text
Project
   │
   └── Building
          │
          └── Unit
```

Each unit contains:

- Unit number
- Property type
- Price
- Availability status

### 📋 Booking Management

- Connect a lead with a property unit
- Check unit availability before booking
- Create bookings
- Automatically mark the unit as booked
- Update the lead stage to `BOOKED`
- Prevent simultaneous bookings for the same unit

### 📈 Dashboard

The dashboard provides a sales overview including:

- Total leads
- Follow-ups
- Site visits
- Lead pipeline
- Total bookings
- Available units
- Property availability
- Recent bookings

### 🔐 Authentication

Two user roles are supported:

| Role | Access |
|---|---|
| **Admin** | Manage leads, employees, properties and bookings |
| **Sales Employee** | Manage leads, notes, follow-ups and bookings |

---

# 🏗️ Key Architectural Decisions

## 1. Preventing Double Booking

**Decision:** Property units are locked using `PESSIMISTIC_WRITE` during the booking transaction.

**Why:** Multiple sales employees may attempt to book the same unit at the same time. Application-level availability checks alone can result in a race condition.

Database-level locking ensures that only one booking succeeds.

A second booking attempt receives:

```text
HTTP 409 Conflict
```

with a clear message that the unit is no longer available.

---

## 2. Project → Building → Unit Structure

**Decision:** Property inventory is modeled using three levels:

```text
Project
   │
   └── Building
          │
          └── Unit
```

**Why:** This structure reflects the organization of real estate projects and makes it easier for sales employees to navigate from a project to a specific unit.

---

## 3. Role-Based Access Control

**Decision:** JWT authentication is combined with Spring Security roles.

**Roles:**

```text
ADMIN
SALES_EMPLOYEE
```

**Why:** Admins and sales employees have different responsibilities. Role-based authorization prevents users from accessing functionality outside their responsibilities.

---

## 4. Consolidated Dashboard API

**Decision:** Dashboard information is provided through a single:

```text
GET /api/dashboard
```

endpoint.

**Why:** The dashboard requires several related metrics such as lead counts, pipeline stages, follow-ups, property availability, and bookings. Combining them into one API response reduces unnecessary frontend requests.

---

## 5. Separate Lead Notes

**Decision:** Lead notes are stored as separate records instead of a single field inside the lead.

**Why:** A lead can have multiple interactions with the sales team. Separate notes provide a simple history of customer communication and follow-ups.

---

# 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite |
| Styling | Tailwind CSS |
| HTTP Client | Axios |
| Routing | React Router |
| Backend | Java 21, Spring Boot 3 |
| ORM | Spring Data JPA / Hibernate |
| Security | Spring Security + JWT |
| Database | PostgreSQL |
| Frontend Deployment | Vercel |
| Backend Deployment | Render |
| Database Hosting | Neon PostgreSQL |

---

# 🗄️ Database Overview

The application uses PostgreSQL with the following core entities:

| Table | Purpose |
|---|---|
| `users` | Admin and Sales Employee accounts |
| `leads` | Customer lead information and sales stage |
| `lead_notes` | Lead communication history |
| `projects` | Real estate projects |
| `buildings` | Buildings within projects |
| `units` | Individual property units |
| `bookings` | Confirmed property reservations |

### Entity Relationships

```text
USERS
  │
  ├───────────────┐
  │               │
  ▼               ▼
LEADS          BOOKINGS
  │               │
  ▼               ▼
LEAD_NOTES      UNITS
                  │
                  ▼
              BUILDINGS
                  │
                  ▼
               PROJECTS
```

### Detailed Relationships

```text
USERS
 │
 ├──< LEADS
 │       │
 │       ├──< LEAD_NOTES
 │       │
 │       └──< BOOKINGS
 │
 └──< BOOKINGS


PROJECTS
 │
 └──< BUILDINGS
          │
          └──< UNITS
                   │
                   └──< BOOKINGS
```

### Main Table Structure

#### Users

```text
users
├── id
├── name
├── email
├── password
└── role
```

#### Leads

```text
leads
├── id
├── name
├── phone
├── email
├── budget
├── stage
├── assigned_to
├── project_id
├── follow_up_date
└── created_at
```

#### Lead Notes

```text
lead_notes
├── id
├── lead_id
├── user_id
├── note
└── created_at
```

#### Projects

```text
projects
├── id
├── name
├── location
└── description
```

#### Buildings

```text
buildings
├── id
├── project_id
└── name
```

#### Units

```text
units
├── id
├── building_id
├── unit_number
├── type
├── price
└── status
```

#### Bookings

```text
bookings
├── id
├── lead_id
├── unit_id
├── booked_by
├── booking_date
└── status
```

---

# 🔌 API Overview

## Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Authenticate user and return JWT |

## Leads

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/leads` | Get all accessible leads |
| `GET` | `/api/leads/{id}` | Get lead details |
| `POST` | `/api/leads` | Create a lead |
| `PUT` | `/api/leads/{id}` | Update a lead |
| `POST` | `/api/leads/{id}/notes` | Add a note |

## Properties

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/projects` | Get projects |
| `GET` | `/api/projects/{id}/buildings` | Get project buildings |
| `GET` | `/api/buildings/{id}/units` | Get building units |

## Bookings

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/bookings` | Get bookings |
| `POST` | `/api/bookings` | Create a booking |

## Dashboard

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/dashboard` | Get dashboard sales metrics |

---

# 🔐 Booking Flow

The booking process follows this flow:

```text
Select Lead
     │
     ▼
Select Project
     │
     ▼
Select Building
     │
     ▼
Select Unit
     │
     ▼
Check Availability
     │
     ▼
Lock Unit
     │
     ▼
Create Booking
     │
     ├───────────────┐
     ▼               ▼
Unit → BOOKED    Lead → BOOKED
```

### Concurrent Booking Protection

If another employee has already booked the selected unit:

```text
Booking Request
      │
      ▼
  Lock Unit
      │
      ▼
Check Availability
      │
      ▼
Already BOOKED
      │
      ▼
409 Conflict
      │
      ▼
"Unit is no longer available"
```

This prevents two sales employees from successfully reserving the same unit.

---

# 📁 Project Structure

```text
EstateFlow/
│
├── frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   ├── Loading.jsx
│   │   │   └── EmptyState.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Leads.jsx
│   │   │   ├── LeadDetails.jsx
│   │   │   ├── Properties.jsx
│   │   │   └── Bookings.jsx
│   │   │
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── leadService.js
│   │   │   ├── propertyService.js
│   │   │   └── bookingService.js
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── backend/
│   │
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/estateflow/
│   │       │       ├── controller/
│   │       │       ├── service/
│   │       │       ├── repository/
│   │       │       ├── entity/
│   │       │       ├── dto/
│   │       │       ├── security/
│   │       │       ├── exception/
│   │       │       └── enums/
│   │       │
│   │       └── resources/
│   │           └── application.properties
│   │
│   └── pom.xml
│
└── README.md
```

---

# 🚀 Setup

## Prerequisites

- Java 21
- Node.js 18+
- PostgreSQL
- Maven

## Backend

```bash
cd backend

./mvnw spring-boot:run
```

Configure the PostgreSQL database and JWT secret in your application environment.

Example:

```properties
spring.datasource.url=YOUR_DATABASE_URL
spring.datasource.username=YOUR_DATABASE_USERNAME
spring.datasource.password=YOUR_DATABASE_PASSWORD

jwt.secret=YOUR_JWT_SECRET
```

## Frontend

```bash
cd frontend

npm install

npm run dev
```

The frontend will run locally using the Vite development server.

---

# 👤 Demo Accounts

### Admin

```text
Email: admin@estateflow.com
Role: ADMIN
```

### Sales Employee

```text
Email: sales@estateflow.com
Role: SALES_EMPLOYEE
```

> Demo passwords are provided through the application's development configuration.

---

# 🌐 Live Application

### Frontend

[EstateFlow Live Application](YOUR_VERCEL_URL)

### Backend API

[EstateFlow Backend API](YOUR_RENDER_URL)

---

# 📸 Screenshots

## Dashboard

_Add dashboard screenshot here._

## Lead Management

_Add lead management screenshot here._

## Property Inventory

_Add property/unit screenshot here._

## Booking

_Add booking screenshot here._

---

# 🎯 Design Goals

EstateFlow was designed around three main principles:

### Simple Sales Workflow

Quickly move from:

```text
Lead → Property → Booking
```

### Clear Inventory Visibility

Sales employees can easily identify available and booked units.

### Reliable Reservations

Database-level locking prevents conflicting unit bookings when multiple employees attempt to reserve the same unit.

---

# 📌 Future Improvements

Possible future improvements include:

- Advanced sales reports
- Email/SMS follow-up reminders
- Customer document management
- Payment tracking
- Advanced analytics
- Automated lead assignment

---

## 📄 License

This project was developed as a technical assessment project.
