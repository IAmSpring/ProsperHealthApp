# Prosper Health

A telehealth platform for supporting individuals with neurodevelopmental conditions like ADHD and Autism.

![Prosper Health App](https://github.com/user-attachments/assets/a7bd95b1-e6e9-4018-9ea1-502e26231b96)

## Tech Stack

- **TypeScript Monorepo**: Single repository for backend and frontend
- **Node.js + Fastify**: Backend API server
- **tRPC**: Type-safe API communication between frontend and backend
- **React**: Frontend UI
- **Supabase**: PostgreSQL database, authentication, and storage
- **Prisma ORM**: Database access via Supabase

## Project Structure

```
prosper/
├── apps/                      # Application packages
│   ├── backend/               # Fastify + tRPC server
│   │   ├── src/
│   │   │   ├── routers/       # tRPC API routers
│   │   │   │   ├── appointment.ts
│   │   │   │   ├── client.ts
│   │   │   │   ├── clinician.ts
│   │   │   │   └── index.ts
│   │   │   ├── index.ts       # Server entry point
│   │   │   └── trpc.ts        # tRPC setup
│   │   ├── .env               # Backend environment variables
│   │   └── package.json
│   └── web/                   # React frontend
│       ├── public/            # Static assets
│       ├── src/
│       │   ├── pages/         # React pages
│       │   │   ├── ClientSignup.tsx
│       │   │   ├── Dashboard.tsx
│       │   │   └── Home.tsx
│       │   ├── utils/
│       │   │   └── trpc.ts    # tRPC client setup
│       │   ├── App.tsx        # React router setup
│       │   ├── index.css      # Global styles
│       │   └── main.tsx       # Entry point
│       ├── index.html         # HTML template
│       ├── vite.config.ts     # Vite configuration
│       └── package.json
├── packages/                  # Shared packages
│   └── db/                    # Database package
│       ├── prisma/            # Prisma configuration
│       │   └── schema.prisma  # Database schema
│       ├── .env               # Database environment variables
│       ├── index.ts           # Database client export
│       ├── seed.ts            # Seed data script
│       └── package.json
├── supabase/                  # Local Supabase configuration
├── .yarnrc.yml                # Yarn configuration
├── package.json               # Root package.json
└── README.md                  # This file
```

## Features

- **Client Onboarding**: Name, Email, Age, Neurotype (Autistic, ADHD, Both)
- **Clinician Dashboard**: View client list and appointment history
- **Appointment Scheduling**: Request and manage appointments
- **Loading States**: Spinner components for all async operations
- **Error Handling**: User-friendly error messages with retry capabilities

## User Experience Features

### Loading States
The application includes loading indicators for all asynchronous operations:
- Spinner component with customizable sizes (small, medium, large)
- Contextual loading messages
- Disabled form controls during submission

### Error Handling
Robust error handling is implemented throughout the application:
- User-friendly error messages
- Retry functionality for failed operations
- Contextual error information

### Responsive Design
The application is fully responsive and works well on:
- Desktop computers
- Tablets
- Mobile devices

## Database Schema

### Client Model
```prisma
model Client {
  id           String        @id @default(cuid())
  name         String
  email        String        @unique
  age          Int
  neurotype    String
  createdAt    DateTime      @default(now())
  appointments Appointment[]
}
```

### Clinician Model
```prisma
model Clinician {
  id           String        @id @default(cuid())
  name         String
  email        String        @unique
  specialty    String
  createdAt    DateTime      @default(now())
  appointments Appointment[]
}
```

### Appointment Model
```prisma
model Appointment {
  id          String     @id @default(cuid())
  date        DateTime
  clientId    String
  clinicianId String
  client      Client     @relation(fields: [clientId], references: [id])
  clinician   Clinician  @relation(fields: [clinicianId], references: [id])
}
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- Yarn (v4+)
- Docker (for local Supabase)

### Setup

1. Install dependencies:
```bash
yarn install
```

2. Start local Supabase:
```bash
supabase start
```

3. Push the database schema:
```bash
yarn db:push
```

4. Seed the database:
```bash
yarn db:seed
```

5. Start the development servers:
```bash
# In one terminal:
yarn dev:backend

# In another terminal:
yarn dev:web
```

6. Open your browser:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/trpc
- Supabase Studio: http://localhost:54323

## API Endpoints

The API uses tRPC for type-safe communication. Main procedures include:

- `client.create`: Add a new client
- `client.list`: List all clients
- `appointment.create`: Schedule a new appointment
- `appointment.listByClientId`: List appointments for a client
- `clinician.list`: List all clinicians

## Development Scripts

- `yarn dev:web`: Start the frontend development server
- `yarn dev:backend`: Start the backend development server
- `yarn build:web`: Build the frontend for production
- `yarn build:backend`: Build the backend for production
- `yarn db:push`: Push the Prisma schema to the database
- `yarn db:seed`: Seed the database with initial data
- `yarn db:generate`: Generate Prisma client
- `yarn db:studio`: Open Supabase Studio 
