@echo off
REM Starts backend and frontend servers in separate terminals

start cmd /k "cd backend && npm start"
start cmd /k "cd frontend && npm start"