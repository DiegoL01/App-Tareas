import express from "express";
import { createRoutes } from "../../routes/index.js";
import { inicializarModelos } from "../Entity/index.js";
import cors from 'cors';
export class ServerClass {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.ConfigureMiddleware();
    this.ConfigureRoutes();
    this.initDB();
  }

  ConfigureMiddleware() {
    this.app.use(express.json()); 
    this.app.use(cors());
  }

  ConfigureRoutes() {
    this.app.use("/api", createRoutes());
  }

  initDB() {
    inicializarModelos();
  }

  start() {
    this.app.listen(this.port,'0.0.0.0',() => {
      console.log(`Servidor corriendo en http://localhost:${this.port}`);
    });
  }
}
