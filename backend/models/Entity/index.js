import { sequelize } from "../../config/databaseConection.js";

// Importar todos los modelos y sus funciones de configuración
import { User, configurarRelacionesUser } from "./User.js";
import { Category, configurarRelacionesCategory } from "./Category.js";
import { Task, configurarRelacionesTask } from "./Task.js";
import { WorkSession, configurarRelacionesWorkSession } from "./WorkSession.js";
// Objeto con todos los modelos para fácil acceso
const modelos = {
  User,
  Category,
  Task,
  WorkSession,
};

// Función principal para inicializar todo
export async function inicializarModelos() {
  try {
    // 1. Autenticar conexión a la base de datos
    await sequelize.authenticate();
    console.log("✅ Conexión a BD establecida");

    // 2. Configurar todas las relaciones (en orden adecuado)
    await configurarRelacionesUser();
    await configurarRelacionesCategory();
    await configurarRelacionesTask();
    await configurarRelacionesWorkSession();

    console.log("✅ Todas las relaciones configuradas");

    // 3. Sincronizar modelos con la base de datos (solo en desarrollo)
  /*  const environment = process.env.NODE_ENV || "development";
    console.log("🔍 Entorno detectado:", environment);

   if (environment === "development") {
      await sequelize.sync({ alter: true });
      console.log("✅ Modelos sincronizados (alter)");
    } else if (environment === "test") {
      await sequelize.sync({ force: true });
      console.log("✅ Modelos sincronizados (force) para testing");
    }
*/
    return modelos;
  } catch (error) {
    console.error("❌ Error al inicializar modelos:", error);
    throw error;
  }
}

// Exportar los modelos por si se necesitan individualmente
export { User, Category, Task, WorkSession };
export default modelos;
