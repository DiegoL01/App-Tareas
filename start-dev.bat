@echo off
echo Iniciando time.me Application...

REM Iniciar backend
echo Iniciando servidor backend...
start "Backend" cmd /k "cd backend && npm run start"

REM Esperar para que el backend inicie
timeout /t 5 /nobreak

REM Iniciar frontend
echo Iniciando aplicacion movil...
cd frontend
npx expo start