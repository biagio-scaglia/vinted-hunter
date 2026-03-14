@echo off
echo Starting Vinted Hunter Backend...
start cmd /k "venv\Scripts\activate && python -m backend.main"

echo Starting Vinted Hunter Frontend...
start cmd /k "cd frontend && npm run dev"

echo Both services are starting! 
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:8000
pause
