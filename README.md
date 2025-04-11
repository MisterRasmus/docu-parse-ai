# DocuParse Monorepo

## Project Info

**URL**: https://lovable.dev/projects/5e5ef42d-e549-46d9-a62c-8aa192b8c720

## Project Structure

```
Workspace-DocuParse/
│
├── backend/         # Node.js + Express backend (API, Google Doc AI, etc.)
│   ├── index.js
│   ├── routes/
│   ├── services/
│   ├── .env
│   └── package.json
│
├── frontend/        # Vite + React frontend
│   ├── src/
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── postcss.config.js
│   ├── tsconfig*.json
│   ├── package.json
│   └── node_modules/
│
├── docs/            # Documentation and planning
├── public/          # Shared/static assets (if any)
├── testdata/        # Test files (if any)
├── start-all.bat    # Script to start both backend and frontend servers
├── .gitignore
└── README.md
```

## Getting Started

### 1. Install Dependencies

Install backend and frontend dependencies separately:

```sh
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

### 2. Start Development Servers

You can start backend and frontend independently, or both together using the batch script.

**Start backend only:**
```sh
cd backend
npm start
```

**Start frontend only:**
```sh
cd frontend
npm start
```

**Start both backend and frontend together (from project root):**
```sh
start-all.bat
```
This will open two new terminal windows, one for the backend and one for the frontend.

### 3. Access the App

- Frontend: http://localhost:8080 (default Vite port)
- Backend API: http://localhost:3001 (default Express port)

## Technologies Used

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Node.js + Express

## Deployment

See [Lovable Project](https://lovable.dev/projects/5e5ef42d-e549-46d9-a62c-8aa192b8c720) for deployment and publishing instructions.

## Notes

- All config files for the frontend (Vite, Tailwind, TypeScript, etc.) are now in frontend/.
- Manage backend and frontend dependencies separately.
- Use start-all.bat in the root to run both servers for development.
