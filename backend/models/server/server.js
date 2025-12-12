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
    this.app.use(cors({
      origin: [
        'http://localhost:8081', // Expo Web
        'http://localhost:19006', // Expo DevTools
        'exp://192.168.1.100:19000', // Expo Go con IP
        /\.exp\.expo\.io$/, // URLs de Expo
      ]
    }));

  }

  ConfigureRoutes() {
    this.app.use("/api", createRoutes());
  }

  initDB() {
    inicializarModelos();
  }

  start() {
    this.app.listen(this.port, '0.0.0.0', () => {
      console.log(`Servidor corriendo en http://localhost:${this.port}`);
    });
  }
}
