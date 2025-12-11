// controllers/worksession.controller.js
export class WorkSessionControllers {
  constructor(workSessionService) {
    this.workSessionService = workSessionService;
  }

  async startWorkSessionController(req, res) {
    try {
      console.log("▶️  Controlador: Iniciando sesión de trabajo");
      console.log("Body:", req.body);
      console.log("UserId:", req.userId);

      const response = await this.workSessionService.startWorkSessionService(req);

      // Manejar conflictos de sesiones activas
      if (response.statusCode === 409 && response.result?.activeSessions) {
        return res.status(409).json({
          ...response,
          requiresAction: true,
          instructions: "Pausa las sesiones activas o envía autoPauseOtherSessions: true"
        });
      }

      return res.status(response.statusCode).json(response);

    } catch (error) {
      console.error("❌ Error en startWorkSessionController:", error);
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  async stopWorkSessionController(req, res) {
    try {
      console.log("⏹️  Controlador: Deteniendo sesión de trabajo");
      
      const response = await this.workSessionService.stopWorkSessionService(req);
      return res.status(response.statusCode).json(response);

    } catch (error) {
      console.error("❌ Error en stopWorkSessionController:", error);
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  async getActiveSessionsController(req, res) {
    try {
      console.log("📊 Controlador: Obteniendo sesiones activas");
      
      const response = await this.workSessionService.getActiveSessionsService(req);
      return res.status(response.statusCode).json(response);

    } catch (error) {
      console.error("❌ Error en getActiveSessionsController:", error);
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }
}