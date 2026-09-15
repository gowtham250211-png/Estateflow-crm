EstateFlow — Real Estate Sales CRM

A full-stack Real Estate CRM designed for sales teams to manage leads, track the sales pipeline, monitor property availability, and securely book property units.

EstateFlow supports Admin and Sales Employee roles with a focus on a simple sales workflow, responsive UI, and reliable booking management.

✨ Key Features
Lead Management
Create and edit leads
Search leads by name, phone, or email
View detailed lead information
Assign leads to sales employees
Track lead stages
Add sales notes
Schedule follow-up dates
Lead Stages
New → Contacted → Site Visit → Interested → Negotiation → Booked
                                                             
                         └──────────────→ Lost
Property Management

Properties are organized as:

Project → Building → Unit

Each unit contains:

Unit number
Property type
Price
Availability status
Booking Management
Connect a lead with a property unit
Check unit availability before booking
Create bookings
Automatically mark the unit as booked
Update the lead stage to BOOKED
Prevent simultaneous bookings for the same unit
Dashboard

The dashboard provides a sales overview with:

Total leads
Follow-ups
Site visits
Lead pipeline
Total bookings
Available units
Property availability
Recent bookings
Authentication

Two user roles are supported:

Role	Access
Admin	Manage leads, employees, properties and bookings
Sales Employee	Manage leads, notes, follow-ups and bookings
🏗️ Key Architectural Decisions
1. Preventing Double Booking

Decision: Property units are locked using PESSIMISTIC_WRITE during the booking transaction.

Why: Two sales employees could attempt to book the same unit at the same time. Application-level availability checks alone can result in a race condition. Database-level locking ensures that only one booking succeeds.

A second booking attempt receives:

HTTP 409 Conflict

with an appropriate error message.

2. Project → Building → Unit Structure

Decision: Property inventory is modeled using three levels:

Project
   └── Building
         └── Unit

Why: This reflects the structure of real estate projects and makes it easy for sales employees to navigate from a project to a specific available unit.

3. Role-Based Access Control

Decision: JWT authentication is combined with Spring Security roles.

Roles:

ADMIN
SALES_EMPLOYEE

Why: Admins and sales employees have different responsibilities. Role-based authorization prevents users from accessing functionality outside their responsibilities.

4. Consolidated Dashboard API

Decision: Dashboard metrics are provided through a single:

GET /api/dashboard

endpoint.

Why: The dashboard requires several related metrics. Combining them into one API response reduces unnecessary frontend requests and simplifies dashboard state management.

5. Separate Lead Notes

Decision: Lead notes are stored in a separate lead_notes table.

Why: A lead can have multiple interactions with the sales team. Keeping notes separately provides a simple history of customer communication rather than overwriting previous notes.

🛠️ Tech Stack
Layer	Technology
Frontend	React 18, Vite
Styling	Tailwind CSS
HTTP Client	Axios
Routing	React Router
Backend	Java 21, Spring Boot
ORM	Spring Data JPA / Hibernate
Security	Spring Security + JWT
Database	PostgreSQL
Frontend Deployment	Vercel
Backend Deployment	Render
Database Hosting	Neon PostgreSQL
🗄️ Database Overview

The application uses PostgreSQL with the following core entities:

Table	Purpose
users	Admin and Sales Employee accounts
leads	Customer lead information and sales stage
lead_notes	Lead communication history
projects	Real estate projects
buildings	Buildings within projects
units	Individual property units
bookings	Confirmed property reservations
Entity Relationships

This will look far cleaner on GitHub than the giant box diagram.

🔌 API Overview
Authentication
Method	Endpoint	Description
POST	/api/auth/login	Authenticate user and return JWT
Leads
Method	Endpoint	Description
GET	/api/leads	Get leads
GET	/api/leads/{id}	Get lead details
POST	/api/leads	Create lead
PUT	/api/leads/{id}	Update lead
POST	/api/leads/{id}/notes	Add lead note
Properties
Method	Endpoint	Description
GET	/api/projects	Get projects
GET	/api/projects/{id}/buildings	Get project buildings
GET	/api/buildings/{id}/units	Get building units
Bookings
Method	Endpoint	Description
GET	/api/bookings	Get bookings
POST	/api/bookings	Create booking
Dashboard
Method	Endpoint	Description
GET	/api/dashboard	Get dashboard sales metrics
🔐 Booking Flow

The booking process follows this flow:

Select Lead
     ↓
Select Project
     ↓
Select Building
     ↓
Select Unit
     ↓
Check Unit Availability
     ↓
Lock Unit
     ↓
Create Booking
     ↓
Unit → BOOKED
     ↓
Lead → BOOKED

If another employee has already booked the unit:

Booking Request
      ↓
Unit Locked
      ↓
Unit Already BOOKED
      ↓
409 Conflict
      ↓
Show "Unit is no longer available"
📁 Project Structure
EstateFlow/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   └── App.jsx
│   └── package.json
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       └── java/
│   │           └── com/estateflow/
│   │               ├── controller/
│   │               ├── service/
│   │               ├── repository/
│   │               ├── entity/
│   │               ├── dto/
│   │               ├── security/
│   │               ├── exception/
│   │               └── enums/
│   └── pom.xml
│
└── README.md
🚀 Setup
Backend
cd backend

./mvnw spring-boot:run

Configure the PostgreSQL database and JWT secret in the application environment.

Frontend
cd frontend

npm install

npm run dev
🌐 Deployment
Frontend

Vercel

https://your-estateflow.vercel.app
Backend

Render

https://your-estateflow-api.onrender.com
Database

PostgreSQL / Neon

👤 Demo Accounts
Admin
Email: admin@estateflow.com
Role: ADMIN
Sales Employee
Email: sales@estateflow.com
Role: SALES_EMPLOYEE

Demo passwords are provided through the application setup/environment configuration.

📸 Screenshots
Dashboard

Add dashboard screenshot here.

Lead Management

Add lead management screenshot here.

Property Inventory

Add property/unit screenshot here.

Booking

Add booking screenshot here.

🎯 Design Goals

EstateFlow was designed around three main principles:

Simple sales workflow — quickly move from lead → property → booking.
Clear inventory visibility — sales employees can easily identify available and booked units.
Reliable reservations — database-level locking prevents conflicting unit bookings.
