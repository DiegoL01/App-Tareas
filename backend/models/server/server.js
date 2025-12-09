import express from "express";
import { createRoutes } from "../../routes/index.js";
import { inicializarModelos } from "../Entity/index.js";

export class ServerClass {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.ConfigureMiddleware();
    this.ConfigureRoutes();
    this.initDB();
  }

  ConfigureMiddleware() {
    this.app.use(express.json()); // Para parsear JSON en las requests
  }

  ConfigureRoutes() {
    this.app.use("/api", createRoutes()); // Monta las rutas bajo /api
  }

  initDB() {
    inicializarModelos();
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`Servidor corriendo en http://localhost:${this.port}`);
    });
  }
}
