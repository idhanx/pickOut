# PickOut

**PickOut** is a modern SaaS platform designed to streamline student registry, skill tracking, and eligibility management for university placements and technical evaluations. 

Developed by **Dhanush**, PickOut bridges the gap between raw student data and actionable placement insights through an intuitive, data-driven dashboard.

## Key Features

- **Skill Manager**: Easily add and manage university-wide technical skills.
- **Student Registry**: Maintain detailed profiles of students, including their departments, contact information, and specific skill sets.
- **Requirement Manager**: Create and track academic and placement requirements seamlessly.
- **Eligibility Checker**: Cross-reference student profiles against requirements to instantly determine placement eligibility.

## Technologies Used

- **Frontend**: React.js with a modern, glassmorphic dark-mode UI.
- **Styling**: Pure CSS with advanced variables, CSS Grid, Flexbox, and backdrop-filter techniques for a premium look.
- **Backend Integration**: RESTful API communication via Axios.

## Getting Started

### Prerequisites

- **Java 11** (OpenJDK)
- **Node.js** (v16+)
- **PostgreSQL** running locally with a database named `requirement_finder`

### Quick Start (Recommended)

Run both backend and frontend with a single command:

```bash
./run.sh
```

This starts:
- **Backend** → `http://localhost:7090` (Spring Boot + PostgreSQL)
- **Frontend** → `http://localhost:3000` (React)

Press `Ctrl+C` to stop both servers.

### Manual Start

**Backend (Spring Boot):**
```bash
./mvnw spring-boot:run
```

**Frontend (React):**
```bash
cd Frontend
npx react-scripts start
```

### Database Configuration

Update `src/main/resources/application.properties` with your PostgreSQL credentials:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/requirement_finder
spring.datasource.username=postgres
spring.datasource.password=YourPasswordHere
```

---
*Built with passion by Dhanush.*
