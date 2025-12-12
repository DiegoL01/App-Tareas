// src/config/env.js (o .ts si usas TypeScript)
import Constants from 'expo-constants';

// Obtén todas las variables de entorno
export const env = Constants.expoConfig?.extra || {};

// O accede a variables específicas
export const DOMAIN_URL = env.DOMAIN_URL || "http://localhost:3000";

// Función para verificar que las variables están cargadas
export const checkEnv = () => {
  console.log('🔧 Variables de entorno cargadas:');
  console.log('DOMAIN_URL:', DOMAIN_URL);
  
  if (!DOMAIN_URL || DOMAIN_URL === "http://localhost:3000") {
    console.warn('⚠️  ADVERTENCIA: DOMAIN_URL está usando el valor por defecto');
  }
};

// Para uso en toda la app
export default {
  DOMAIN_URL,
  API_URL: `${DOMAIN_URL}/api`, // Si necesitas la URL de la API
  checkEnv,
};