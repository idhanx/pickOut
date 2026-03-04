# PickOut — System Architecture

> **PickOut** is a full-stack placement hub that matches students to job requirements based on their skills. It uses **skill-based eligibility matching** — students register their skills, recruiters post requirements with required skills, and the system automatically finds matches.

---

## High-Level Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                            │
│                                                                      │
│   React 19  ·  Lucide Icons  ·  Vanilla CSS                         │
│   Port 3000                                                          │
│                                                                      │
│   ┌────────────┐ ┌────────────┐ ┌──────────────┐ ┌───────────────┐  │
│   │ LoginPage  │ │  Student   │ │ Requirement  │ │  Eligibility  │  │
│   │            │ │  Manager   │ │   Manager    │ │   Checker     │  │
│   └────────────┘ └────────────┘ └──────────────┘ └───────────────┘  │
│          │              │               │                │           │
│          └──────────────┴───────────────┴────────────────┘           │
│                              │                                       │
│                    ┌─────────▼─────────┐                             │
│                    │   api.js (fetch)   │                             │
│                    │  AuthContext.js    │                             │
│                    └─────────┬─────────┘                             │
└──────────────────────────────┼───────────────────────────────────────┘
                               │  REST API (JSON)
                               │  http://localhost:7090/api/*
┌──────────────────────────────┼───────────────────────────────────────┐
│                         SERVER (JVM)                                 │
│                                                                      │
│   Spring Boot 2.7.18  ·  Java 11  ·  Maven                          │
│   Port 7090                                                          │
│                                                                      │
│   ┌─────────────────────── CONTROLLER LAYER ──────────────────────┐  │
│   │  AuthController   StudentController   RequirementController  │  │
│   │  /api/auth/*      /api/students/*     /api/requirements/*    │  │
│   │                                       SkillController        │  │
│   │                                       /api/skills/*          │  │
│   └───────────────────────────┬───────────────────────────────────┘  │
│                               │                                      │
│   ┌─────────────────────── SERVICE LAYER ─────────────────────────┐  │
│   │           StudentService       RequirementService            │  │
│   │         (CRUD + skill linking) (CRUD + eligibility matching) │  │
│   └───────────────────────────┬───────────────────────────────────┘  │
│                               │                                      │
│   ┌─────────────────────── REPOSITORY LAYER ──────────────────────┐  │
│   │  StudentRepository  SkillRepository  RequirementsRepository  │  │
│   │  UserRepository     (Spring Data JPA / JpaRepository)        │  │
│   └───────────────────────────┬───────────────────────────────────┘  │
│                               │                                      │
│   ┌─────────────────────── CONFIG ────────────────────────────────┐  │
│   │  SecurityConfig (BCrypt, CORS, CSRF disabled, permitAll)     │  │
│   └───────────────────────────┬───────────────────────────────────┘  │
└──────────────────────────────┼───────────────────────────────────────┘
                               │  JDBC (Hibernate ORM)
┌──────────────────────────────┼───────────────────────────────────────┐
│                         DATABASE                                     │
│                                                                      │
│   PostgreSQL  ·  Port 5432  ·  DB: requirement_finder                │
│                                                                      │
│   Tables: student, skill, requirement, app_user,                     │
│           student_skills (join), requirement_skills (join)            │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Database ER Diagram

```
┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│     STUDENT      │       │    SKILL         │       │   REQUIREMENT    │
├──────────────────┤       ├──────────────────┤       ├──────────────────┤
│ id (PK)          │       │ id (PK)          │       │ id (PK)          │
│ name             │       │ name (UNIQUE)    │       │ title            │
│ department       │       └────────┬─────────┘       │ description      │
│ email            │                │                  │ status (OPEN/    │
│ phone            │                │                  │         CLOSED)  │
└────────┬─────────┘                │                  │ student_id (FK)──┼──→ STUDENT
         │                          │                  └────────┬─────────┘
         │         ┌────────────────┴────────────────┐          │
         │         │                                 │          │
    ┌────▼─────────▼───┐                  ┌──────────▼──────────▼──┐
    │  STUDENT_SKILLS   │                  │  REQUIREMENT_SKILLS    │
    │  (Join Table)     │                  │  (Join Table)          │
    ├───────────────────┤                  ├────────────────────────┤
    │ student_id (FK)   │                  │ requirement_id (FK)    │
    │ skill_id (FK)     │                  │ skill_id (FK)          │
    └───────────────────┘                  └────────────────────────┘

┌──────────────────┐
│    APP_USER      │
├──────────────────┤
│ id (PK)          │
│ username (UNIQUE)│
│ email (UNIQUE)   │
│ password (BCrypt)│
│ role (USER)      │
└──────────────────┘
```

---

## API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint              | Description                    |
|--------|-----------------------|--------------------------------|
| POST   | `/api/auth/register`  | Register new user              |
| POST   | `/api/auth/login`     | Login with username & password |

### Skills (`/api/skills`)
| Method | Endpoint          | Description      |
|--------|-------------------|------------------|
| GET    | `/api/skills`     | Get all skills   |
| POST   | `/api/skills`     | Create a skill   |
| GET    | `/api/skills/{id}`| Get skill by ID  |
| DELETE | `/api/skills/{id}`| Delete a skill   |

### Students (`/api/students`)
| Method | Endpoint              | Description           |
|--------|-----------------------|-----------------------|
| GET    | `/api/students`       | Get all students      |
| POST   | `/api/students`       | Create new student    |
| GET    | `/api/students/{id}`  | Get student by ID     |
| PUT    | `/api/students/{id}`  | Update student        |
| DELETE | `/api/students/{id}`  | Delete student        |

### Requirements (`/api/requirements`)
| Method | Endpoint                                         | Description                         |
|--------|--------------------------------------------------|-------------------------------------|
| GET    | `/api/requirements`                              | Get all requirements                |
| GET    | `/api/requirements/open`                         | Get only open requirements          |
| GET    | `/api/requirements/{id}`                         | Get requirement by ID               |
| POST   | `/api/requirements/{studentId}`                  | Create requirement (by student)     |
| PUT    | `/api/requirements/close/{id}`                   | Close a requirement                 |
| GET    | `/api/requirements/check/{studentId}/{reqId}`    | Check if student is eligible        |
| GET    | `/api/requirements/eligible-students/{reqId}`    | Find all eligible students          |
| GET    | `/api/requirements/eligible-for/{studentId}`     | Find requirements student qualifies |

---

## Core Business Logic — Eligibility Matching

The heart of PickOut is the **skill-based matching engine** inside `RequirementService`:

```
Student has:    {Java, React, SQL}
Requirement needs: {Java, SQL}

Match?  student.skills ⊇ requirement.requiredSkills  →  ✅ Eligible
```

1. **Check Eligibility** — `student.getSkills().containsAll(requirement.getRequiredSkills())`
2. **Find Eligible Students** — Filters all students whose skill set is a superset of the requirement's skill set (excluding the requirement poster)
3. **Find Eligible Requirements** — Filters all open requirements whose required skills are a subset of the student's skills (excluding own posts)

---

## Request Flow

```
 User Action                 Frontend                    Backend                    Database
 ───────────                 ────────                    ───────                    ────────
 Click "Login"         →    LoginPage.js            →   AuthController             →  app_user
                             ↓                           /api/auth/login
                         AuthContext stores              BCrypt.matches()
                         user in localStorage            returns user JSON
                              │
 View Students         →    StudentManager.js       →   StudentController           →  student
                                                         /api/students                  + student_skills
                                                         ↓
                                                        StudentService
                                                         (links skills via
                                                          SkillRepository)
                              │
 Post Requirement      →    RequirementManager.js   →   RequirementController       →  requirement
                                                         /api/requirements/{id}         + requirement_skills
                                                         ↓
                                                        RequirementService
                                                         (resolves skills,
                                                          sets status=OPEN)
                              │
 Check Eligibility     →    EligibilityChecker.js   →   RequirementController
                                                         /api/requirements/check/
                                                         ↓
                                                        RequirementService
                                                         .checkEligibility()
                                                         student.skills ⊇ req.skills?
```

---

## Authentication Flow

```
┌─────────┐     POST /api/auth/register     ┌──────────────┐     BCrypt.encode()     ┌────────┐
│  React  │ ──────────────────────────────→  │AuthController│ ──────────────────────→ │  DB    │
│ (Login  │                                  │              │                          │app_user│
│  Page)  │     POST /api/auth/login         │  checks:     │     BCrypt.matches()    │        │
│         │ ──────────────────────────────→  │  - exists?   │ ←──────────────────────  │        │
│         │ ←───── { user JSON } ──────────  │  - password? │                          │        │
│         │                                  └──────────────┘                          └────────┘
│         │
│ AuthContext.js stores user in localStorage
│ isAuthenticated → shows Dashboard
└─────────┘
```

> **Note:** This uses session-less auth (no JWT). The frontend stores user info in `localStorage` and the backend currently permits all API routes (`permitAll()`).

---

## Security Configuration

- **Password hashing**: BCrypt via `PasswordEncoder` bean
- **CORS**: Allows `http://localhost:3000` (React dev server)
- **CSRF**: Disabled (API-only backend)
- **Authorization**: All routes are currently `permitAll()` — no token-based protection yet
- **Form login / HTTP Basic**: Both disabled

---

## Project Structure

```
PickOut/
├── pickout/                          ← Root of the application
│   ├── pom.xml                       ← Maven config (Spring Boot 2.7.18, Java 11)
│   ├── run.sh                        ← One-command startup (backend + frontend)
│   ├── mvnw / mvnw.cmd              ← Maven wrapper
│   ├── ARCHITECTURE.md               ← This document
│   │
│   ├── src/main/java/com/example/PickOut/
│   │   ├── PickOutApplication.java   ← Spring Boot entry point
│   │   ├── Config/
│   │   │   └── SecurityConfig.java   ← Security, CORS, BCrypt beans
│   │   ├── Controller/
│   │   │   ├── AuthController.java   ← Login & Register endpoints
│   │   │   ├── StudentController.java
│   │   │   ├── RequirementController.java
│   │   │   └── SkillController.java
│   │   ├── Model/
│   │   │   ├── User.java             ← Auth user entity
│   │   │   ├── Student.java          ← Student with ManyToMany skills
│   │   │   ├── Requirement.java      ← Requirement with ManyToMany skills
│   │   │   └── Skill.java            ← Skill entity (unique name)
│   │   ├── Repository/
│   │   │   ├── UserRepository.java
│   │   │   ├── StudentRepository.java
│   │   │   ├── SkillRepository.java
│   │   │   └── RequirementsRepository.java
│   │   └── Service/
│   │       ├── StudentService.java   ← CRUD + skill resolution
│   │       └── RequirementService.java ← CRUD + eligibility matching
│   │
│   ├── src/main/resources/
│   │   └── application.properties    ← DB config (PostgreSQL, port 7090)
│   │
│   ├── src/test/java/com/example/PickOut/
│   │   └── PickOutApplicationTests.java
│   │
│   └── Frontend/                     ← React application
│       ├── package.json              ← React 19, Lucide, Axios
│       ├── public/
│       └── src/
│           ├── App.js                ← Main app with sidebar navigation
│           ├── App.css               ← Premium dark theme styling
│           ├── index.js              ← React entry point
│           ├── context/
│           │   └── AuthContext.js     ← Auth state (localStorage)
│           ├── services/
│           │   └── api.js            ← REST API client (fetch-based)
│           └── components/
│               ├── LoginPage.js      ← Login/Register UI
│               ├── SkillManager.js   ← Skill CRUD
│               ├── StudentManager.js ← Student CRUD with skill assignment
│               ├── RequirementManager.js ← Requirement CRUD
│               └── EligibilityChecker.js ← Skill-match checker
│
├── .git/                             ← Git repository
├── .gitignore
├── .gitattributes
└── LICENSE
```

---

## Tech Stack Summary

| Layer      | Technology                         | Version   |
|------------|------------------------------------|-----------|
| Frontend   | React (CRA)                        | 19.2.4    |
| Icons      | Lucide React                       | 0.564     |
| HTTP Client| Fetch API (custom wrapper)         | Native    |
| Backend    | Spring Boot                        | 2.7.18    |
| Language   | Java                               | 11        |
| Build      | Maven (with wrapper)               | —         |
| ORM        | Hibernate (Spring Data JPA)        | —         |
| Security   | Spring Security + BCrypt           | —         |
| Database   | PostgreSQL                         | —         |
| Deployment | Local (`run.sh` starts both)       | —         |

---

## How to Run

```bash
cd pickout/
./run.sh
# Backend starts on http://localhost:7090
# Frontend starts on http://localhost:3000
```

Or run individually:
```bash
# Backend
cd pickout/
./mvnw spring-boot:run

# Frontend (separate terminal)
cd pickout/Frontend/
npm start
```
