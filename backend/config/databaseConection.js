import { Sequelize } from 'sequelize';
import { globalEnv } from './configEnv.js';

// Configuración de la conexión
export const sequelize = new Sequelize(
  globalEnv.DB_NAME || 'bibliotecadb',
  globalEnv.DB_USER || 'root',
  globalEnv.DB_PASSWORD || 'root',
  {
    host: globalEnv.DB_HOST || 'localhost',
    port: globalEnv.DB_PORT || 3306,
    dialect: 'mysql', // o 'postgres', 'sqlite', etc.
    logging: globalEnv.DB_LOGGING || console.log,
    define: {
      timestamps: true, // Sequelize agrega createdAt y updatedAt por defecto
    }
  }
);

// Prueba de conexión
sequelize.authenticate()
  .then(() => {
    console.log('Conexión establecida correctamente.');
  })
  .catch(err => {
    console.error('No se pudo conectar a la base de datos:', err);
  });

