// routes/worksession.routes.js
import { Router } from "express";
import { WorkSessionService } from "../services/work_session.service.js";
import { WorkSessionControllers } from "../controllers/work_session.controller.js";

export const createWorkSessionRoutes = () => {
  const router = Router();

  const workSessionService = new WorkSessionService();
  const workSessionController = new WorkSessionControllers(workSessionService);

  // Iniciar sesión de trabajo
  router.post("/start", (req, res) =>
    workSessionController.startWorkSessionController(req, res)
  );

  // Detener sesión de trabajo
  router.post("/stop", (req, res) =>
    workSessionController.stopWorkSessionController(req, res)
  );

  // Obtener sesiones activas del usuario
  router.get("/active", (req, res) =>
    workSessionController.getActiveSessionsController(req, res)
  );

  // Obtener historial de sesiones
  router.get("/history", (req, res) =>
    workSessionController.getSessionHistoryController(req, res)
  );

  return router;
};