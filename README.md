# DocuParse

## Project Info

DocuParse is a document parsing application that uses AI to extract structured data from PDFs and other documents. It's built with Node.js, Express, and React, and it leverages Google's Document AI for the AI processing. The frontend is built with Vite and React, and it uses shadcn-ui for components and Tailwind CSS for styling. The backend is built with Node.js and Express, and it handles file uploads and API requests. The project is structured to allow for easy development and deployment.

## Project Structure

```
Workspace-DocuParse/
│
├── backend/             # Node.js + Express backend (API, Google Doc AI, etc.)
│   ├── index.js
│   ├── routes/          # Express routes
│   ├── services/        # Backend services
│   ├── node_modules/
│   ├── .env
│   └── package.json
│
├── frontend/            # Vite + React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # React pages
│   │   ├── services/    # Frontend services
│   │   ├── lib/         # Utility libraries
│   │   ├── hooks/       # Custom React hooks
│   │   ├── index.css    # Tailwind CSS entry point
│   │   └── main.tsx     # Main entry point
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── postcss.config.js
│   ├── tsconfig*.json
│   ├── package.json
│   └── node_modules/
│
├── public/          # Shared/static assets
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

## Notes

- All config files for the frontend (Vite, Tailwind, TypeScript, etc.) are in frontend/.
- All config files for the backend (Express, Node.js, etc.) are in backend/.
- Manage backend and frontend dependencies separately.
- Use start-all.bat in the root to run both servers for development.
