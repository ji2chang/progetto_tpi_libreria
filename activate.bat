@echo off
echo Avvio libreria fullstack...
echo.

REM Tutte le cartelle sono allo stesso livello
start "Backend" cmd /k "cd . && call .venv\Scripts\activate && python backend\app.py"
timeout /t 3 /nobreak >nul
start "Frontend" cmd /k "cd frontend && npm run dev"