EstateFlow — Real Estate Sales CRM

A full-stack Real Estate CRM designed to help sales teams manage leads, track the sales pipeline, monitor property availability, and securely book property units.

EstateFlow provides role-based access for Admins and Sales Employees, with a focus on simple sales workflows, responsive UI, and reliable unit booking.

Key Architectural Decisions
1. Preventing Double Booking with Database Locking

Decision: Unit booking uses a database-level pessimistic write lock with LockModeType.PESSIMISTIC_WRITE.

Why: Multiple sales employees may attempt to book the same unit at the same time. A simple availability check at the application level can create a race condition. The database lock ensures that only one transaction can reserve the unit, while another attempt receives a clear 409 Conflict response.

2. Project → Building → Unit Property Structure

Decision: Property inventory is organized into three levels: Project → Building → Unit.

Why: This structure reflects how real estate properties are commonly organized and makes it easier for sales employees to find units and check their availability before booking.

3. Role-Based Access Control

Decision: Implemented authentication using JWT with two roles: ADMIN and SALES_EMPLOYEE.

Why: Different users require different levels of access. Admins can manage the overall CRM and assign leads, while Sales Employees can manage leads, follow-ups, and bookings relevant to their sales activities.

4. Consolidated Dashboard API

Decision: Dashboard information is provided through a single /api/dashboard endpoint.

Why: The dashboard needs several related metrics such as lead counts, pipeline stages, follow-ups, property availability, and bookings. Combining these into one API request reduces unnecessary frontend requests and keeps the dashboard responsive.

5. Lead Activity History

Decision: Lead notes are stored as separate records rather than as a single field inside the lead.

Why: Sales interactions can happen multiple times. Keeping notes separately allows the CRM to maintain a simple chronological history of communication and follow-ups.

Tech Stack
Frontend
React 18
Vite
Tailwind CSS
Axios
React Router
Backend
Java 21
Spring Boot 3
Spring Data JPA
Hibernate
Spring Security
JWT
Database
PostgreSQL
Deployment
Vercel — Frontend
Render — Backend
Neon PostgreSQL — Database
Core Features
Lead Management
Create leads
Edit leads
Search leads
View lead details
Assign leads to sales employees
Update lead stages
Add notes
Set follow-up dates
Lead Pipeline
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

          ↘ Lost
Property Management
Project
   │
   ├── Building
   │      │
   │      ├── Unit
   │      ├── Unit
   │      └── Unit
   │
   └── Building
          │
          ├── Unit
          └── Unit

Each unit contains:

Unit number
Property type
Price
Availability status
Booking
Connect a lead with a property unit
Check unit availability
Create booking
Automatically mark the unit as booked
Update the lead stage to BOOKED
Prevent simultaneous bookings of the same unit
Dashboard

The dashboard provides a sales overview including:

Total leads
Follow-ups
Site visits
Lead pipeline
Bookings
Available units
Property availability
Recent bookings
Authentication

Two roles:

ADMIN
SALES_EMPLOYEE
Database Overview
                         ┌──────────────┐
                         │    USERS     │
                         ├──────────────┤
                         │ id           │
                         │ name         │
                         │ email        │
                         │ password     │
                         │ role         │
                         └──────┬───────┘
                                │
                    assigned_to │
                                ▼
                         ┌──────────────┐
                         │    LEADS     │
                         ├──────────────┤
                         │ id           │
                         │ name         │
                         │ phone        │
                         │ email        │
                         │ budget       │
                         │ stage        │
                         │ assigned_to  │
                         │ project_id   │
                         │ follow_up    │
                         └──────┬───────┘
                                │
                         ┌──────┴───────┐
                         │              │
                         ▼              ▼
                  ┌─────────────┐  ┌─────────────┐
                  │ LEAD_NOTES  │  │  BOOKINGS   │
                  ├─────────────┤  ├─────────────┤
                  │ id          │  │ id          │
                  │ lead_id     │  │ lead_id     │
                  │ user_id     │  │ unit_id     │
                  │ note        │  │ booked_by   │
                  │ created_at  │  │ booking_date│
                  └─────────────┘  │ status      │
                                   └──────┬──────┘
                                          │
                                          ▼
                                   ┌─────────────┐
                                   │    UNITS    │
                                   ├─────────────┤
                                   │ id          │
                                   │ building_id │
                                   │ unit_number │
                                   │ type        │
                                   │ price       │
                                   │ status      │
                                   └──────┬──────┘
                                          │
                                          ▼
                                   ┌─────────────┐
                                   │  BUILDINGS  │
                                   ├─────────────┤
                                   │ id          │
                                   │ project_id  │
                                   │ name        │
                                   └──────┬──────┘
                                          │
                                          ▼
                                   ┌─────────────┐
                                   │  PROJECTS   │
                                   ├─────────────┤
                                   │ id          │
                                   │ name        │
                                   │ location    │
                                   │ description │
                                   └─────────────┘
API Overview
Authentication
POST /api/auth/login
Leads
GET    /api/leads
GET    /api/leads/{id}
POST   /api/leads
PUT    /api/leads/{id}
POST   /api/leads/{id}/notes
Properties
GET /api/projects
GET /api/projects/{id}/buildings
GET /api/buildings/{id}/units
Bookings
GET  /api/bookings
POST /api/bookings
Dashboard
GET /api/dashboard
Booking Safety

When a booking request is received:

Booking Request
      ↓
Validate Lead
      ↓
Lock Unit
      ↓
Check Availability
      ↓
   Available?
    /      \
  YES       NO
   ↓         ↓
Create      409
Booking    Conflict
   ↓
Unit → BOOKED
   ↓
Lead → BOOKED
   ↓
Transaction Complete

This ensures that two sales employees cannot successfully reserve the same unit at the same time.

Project Structure
EstateFlow/
│
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── context/
│       ├── hooks/
│       └── App.jsx
│
├── backend/
│   └── src/main/java/
│       └── com/estateflow/
│           ├── controller/
│           ├── service/
│           ├── repository/
│           ├── entity/
│           ├── dto/
│           ├── security/
│           ├── exception/
│           └── enums/
│
└── README.md
Setup
Backend
git clone <repository-url>

cd backend

./mvnw spring-boot:run

Configure PostgreSQL and JWT environment variables in .env / application configuration.

Frontend
cd frontend

npm install

npm run dev
Demo Accounts
Admin
Email: admin@estateflow.com
Role: ADMIN

Sales Employee
Email: sales@estateflow.com
Role: SALES_EMPLOYEE

Passwords are provided separately or through the seeded development database.

Live Application

Frontend: <your-vercel-url>

Backend API: <your-render-url>
