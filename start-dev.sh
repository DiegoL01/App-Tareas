#!/bin/bash

# =============================================
# Script para iniciar time.me Application
# Inicia backend y frontend automáticamente
# =============================================

echo "Iniciando time.me Application..."
echo "=================================="

if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo " Error: No se encuentran las carpetas 'backend' y 'frontend'"
    echo " Asegúrate de ejecutar este script desde la raíz del proyecto"
    exit 1
fi

# Limpiar pantalla (opcional)
# clear

echo " Directorio actual: $(pwd)"
echo ""

# Función para manejar la salida limpia
cleanup() {
    echo ""
    echo "=================================="
    echo " Deteniendo servicios..."
    
    # Matar procesos relacionados
    pkill -f "node.*backend"
    pkill -f "expo"
    
    echo " Servicios detenidos"
    echo " ¡Hasta pronto!"
    exit 0
}

# Configurar trap para Ctrl+C
trap cleanup SIGINT SIGTERM

# ========== INICIAR BACKEND ==========
echo "🔧 Iniciando servidor backend..."
echo "----------------------------------"

# Navegar a backend y ejecutar en segundo plano
cd backend
npm run start &
BACKEND_PID=$!
cd ..

echo " Backend iniciado (PID: $BACKEND_PID)"
echo " Esperando que el backend esté listo..."

# Esperar 7 segundos para que el backend inicie completamente
for i in {1..7}; do
    echo -n "."
    sleep 1
done
echo ""
echo ""

# Verificar si el backend está corriendo
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo " Error: El backend no se inició correctamente"
    echo " Revisa los logs en la terminal del backend"
    exit 1
fi

# ========== INICIAR FRONTEND ==========
echo " Iniciando aplicación móvil (Expo)..."
echo "----------------------------------"

# Navegar a frontend y ejecutar
cd frontend
echo "Directorio frontend: $(pwd)"
echo ""
echo " Opciones disponibles:"
echo "   • Presiona 'a' para Android Emulator"
echo "   • Presiona 'i' para iOS Simulator (solo Mac)"
echo "   • Escanea el QR con Expo Go en tu teléfono"
echo "   • Presiona 'w' para web"
echo "   • Presiona 'r' para recargar"
echo "   • Presiona 'Ctrl+C' para salir"
echo "----------------------------------"

# Iniciar Expo
npx expo start

# ========== LIMPIEZA AL SALIR ==========
echo ""
cleanup