import { sequelize } from "../../config/databaseConection.js";

import { User, configurarRelacionesUser } from "./User.js";
import { Category, configurarRelacionesCategory } from "./Category.js";
import { Task, configurarRelacionesTask } from "./Task.js";

const modelos = {
  User,
  Category,
  Task,
};

export async function inicializarModelos() {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a BD establecida");

    await configurarRelacionesUser();
    await configurarRelacionesCategory();
    await configurarRelacionesTask();

    console.log("✅ Todas las relaciones configuradas");

    const environment = process.env.NODE_ENV || "development";
    
    if (environment === "development") {
      console.log("🔍 Entorno detectado:", environment);
      await sequelize.sync({ alter: true });
      console.log("✅ Modelos sincronizados (alter)");
      } else if (environment === "test") {
        await sequelize.sync({ force: true });
        console.log("✅ Modelos sincronizados (force) para testing");
    }

    return modelos;
  } catch (error) {
    console.error("❌ Error al inicializar modelos:", error);
    throw error;
  }
}

export { User, Category, Task };
export default modelos;
