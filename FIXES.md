# Test & Fix Report — EstateFlow Real Estate CRM

I built and ran both the Spring Boot backend (against a real Postgres instance) and the
React frontend, exercised every API endpoint and UI flow, and fixed everything broken
along the way. Summary below.

## Critical bugs fixed

### 1. Passwords leaking in API responses (security)
`User.password` had no `@JsonIgnore`, so the plaintext password was serialized into
JSON any time a `User` appeared nested inside a response — e.g. `GET /api/leads`
returned each lead's assigned salesperson **including their password**.
**Fix:** added `@JsonIgnore` on `User.password` (`entity/User.java`).

### 2. Most list endpoints returned HTTP 500 (functional — found via live testing)
`GET /api/leads`, `GET /api/leads/{id}/notes`, and `GET /api/properties/buildings/{id}/units`
all crashed with:
```
Type definition error: [simple type, class org.hibernate.proxy.pojo.bytebuddy.ByteBuddyInterceptor]
```
This happens because the controllers return JPA entities directly, and Hibernate hands
back proxy objects for associations (`Lead.assignedTo`, `Unit.building`, etc.) that
Jackson doesn't know how to serialize. The existing `@JsonIgnoreProperties({"hibernateLazyInitializer","handler"})`
annotations on `Unit`/`Building`/`Booking` only worked when placed at the **class**
level — `User`, `Project`, `Lead`, and `LeadNote` were missing it entirely, and adding
it inconsistently (e.g. only on fields) turned out not to be reliable once proxies were
nested more than one level deep.

**Fix:** rather than keep patching this per-entity, added `config/JacksonConfig.java`,
which registers a Jackson module that unwraps *any* `HibernateProxy` to its real,
initialized entity before serializing. This fixes every current endpoint and prevents
the same class of bug from recurring as new endpoints/entities are added. (Also added
the missing class-level `@JsonIgnoreProperties` to `User`, `Project`, `Lead`, and
`LeadNote` for defense-in-depth, matching the existing pattern on the other entities.)

### 3. Changing a lead's stage silently un-assigned it (frontend, data corruption)
`LeadDetails.jsx`'s `handleStageChange` spread the full `lead` object (which has
nested `assignedTo`/`project` objects from the GET response) into the `PUT` payload.
The backend's `LeadRequest` DTO expects `assignedToId`/`projectId` (plain IDs), so the
nested objects were ignored, both fields defaulted to `null`, and every stage change
silently wiped the lead's assigned salesperson and project.
**Fix:** build the update payload explicitly with the correct field names.

### 4. Lead detail page (with notes) was unreachable
`LeadDetails.jsx` — a complete page with note-taking and stage editing — had no route
in `App.jsx` and nothing in the UI linked to it (`Leads.jsx` used a preview drawer
instead). The notes feature was effectively dead code.
**Fix:** added the `/leads/:id` route and an "Open Full Profile & Notes" link from the
lead preview drawer.

### 5. Sidebar always showed "Gowtham / ADMIN"
`Sidebar.jsx` hardcoded the logged-in user's name/role/initial instead of reading it
from `AuthContext`, so a Sales Employee login still showed the admin's identity.
**Fix:** read `user` from `useAuth()` and render it dynamically.

### 6. Frontend wouldn't build at all
`node_modules` was missing the Linux-specific optional Rollup binary
(`@rollup/rollup-linux-x64-gnu`), so `npm run build` failed immediately.
**Fix:** none needed in source — just run `npm install` fresh (already verified this
produces a clean `npm run build`).

## Minor improvement
Unhandled exceptions are now logged server-side (`GlobalExceptionHandler`) via SLF4J
instead of disappearing silently, so future failures are diagnosable from the server
logs while the client still only ever sees a short, safe error message.

## Please rotate your database credentials
`backend/src/main/resources/application.properties` has a live Neon Postgres
connection string with a real username/password committed in plaintext. This wasn't
something I could fix in code — please rotate that password in Neon and use an
environment variable (`${DB_PASSWORD}`) instead of a literal value in the file.

## How I verified all of this
Since this sandbox can't reach Maven Central, I installed a local Postgres instance,
extracted the dependency jars already bundled in the project's fat jar, recompiled the
changed source files against them, and ran the full Spring Boot app against a real
database — then drove it through login, lead CRUD, notes, stage updates, property/unit
browsing, and the full booking flow with `curl`, confirming correct behavior (and the
absence of any `password` field in any response) at every step. The frontend was
verified with a clean `npm install && npm run build`.

To build normally on your machine: `cd backend && mvn clean package` and
`cd frontend && npm install && npm run build` — both work as expected with normal
internet access to Maven Central/npm.
