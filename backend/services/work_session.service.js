import { WorkSession } from "../models/Entity/WorkSession.js";
import { Task } from "../models/Entity/Task.js";
import { Op } from "sequelize";

export class WorkSessionService {
  async startWorkSessionService(req) {
    try {
      const { taskId, startTime, notes } = req.body;
      const userId = req.userId;

      console.log(
        `▶️  Iniciando sesión de trabajo para usuario: ${userId}, tarea: ${taskId}`
      );

      // Validaciones básicas
      if (!taskId) {
        return {
          success: false,
          statusCode: 400,
          message: "El ID de la tarea es requerido",
          result: null,
        };
      }

      if (!userId) {
        return {
          success: false,
          statusCode: 401,
          message: "Usuario no autenticado",
          result: null,
        };
      }

      const task = await Task.findOne({
        where: {
          id: taskId,
          user_id: userId,
        },
      });

      if (!task) {
        return {
          success: false,
          statusCode: 404,
          message: "Tarea no encontrada o no pertenece al usuario",
          result: null,
        };
      }

      if (task.status === "completed") {
        return {
          success: false,
          statusCode: 400,
          message: "No se puede iniciar sesión en una tarea completada",
          result: null,
        };
      }

      const activeSession = await WorkSession.findOne({
        where: {
          task_id: taskId,
          end_time: null, // Sesión sin terminar
        },
      });

      if (activeSession) {
        return {
          success: false,
          statusCode: 409,
          message: "Ya existe una sesión activa para esta tarea",
          result: {
            activeSessionId: activeSession.id,
            startedAt: activeSession.start_time,
          },
        };
      }

      const userActiveSessions = await this.getUserActiveSessions(userId);

      if (userActiveSessions.length > 0) {
        // Opción: Pausar automáticamente sesiones activas
        const autoPause = req.body.autoPauseOtherSessions || false;

        if (autoPause) {
          await this.pauseAllUserSessions(userId);
          console.log(
            `⏸️  Pausadas ${userActiveSessions.length} sesiones activas del usuario`
          );
        } else {
          return {
            success: false,
            statusCode: 409,
            message: `Tienes ${userActiveSessions.length} sesión(es) activa(s) en otras tareas`,
            result: {
              activeSessions: userActiveSessions.map((s) => ({
                sessionId: s.id,
                taskId: s.task_id,
                taskTitle: s.task?.title,
                startedAt: s.start_time,
              })),
            },
          };
        }
      }

      // 5. Crear la nueva sesión de trabajo
      const sessionData = {
        task_id: taskId,
        start_time: startTime || new Date(),
        notes: notes || null,
        is_manual: !!req.body.isManual,
      };

      const workSession = await WorkSession.create(sessionData);
      console.log(
        `✅ Sesión iniciada - ID: ${workSession.id}, Tarea: "${task.title}"`
      );

      // 6. Actualizar el estado de la tarea si es necesario
      if (task.status !== "active") {
        await task.update({ status: "active" });
        console.log(`🔄 Tarea actualizada a estado: active`);
      }

      // 7. Incluir información de la tarea en la respuesta
      const sessionWithTask = await WorkSession.findOne({
        where: { id: workSession.id },
        include: [
          {
            association: "task",
            attributes: ["id", "title", "status"],
          },
        ],
      });

      return {
        success: true,
        statusCode: 201,
        message: "Sesión de trabajo iniciada exitosamente",
        result: sessionWithTask,
      };
    } catch (error) {
      console.error("❌ Error en startWorkSessionService:", error);
      return {
        success: false,
        statusCode: 500,
        message: "Error al iniciar sesión de trabajo",
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      };
    }
  }

  // Método auxiliar: Obtener sesiones activas del usuario
  async getUserActiveSessions(userId) {
    try {
      const activeSessions = await WorkSession.findAll({
        where: {
          end_time: null, // Sesiones sin terminar
        },
        include: [
          {
            association: "task",
            attributes: ["id", "title", "user_id"],
            where: { user_id: userId },
          },
        ],
      });

      return activeSessions;
    } catch (error) {
      console.error("Error en getUserActiveSessions:", error);
      return [];
    }
  }

  // Método auxiliar: Pausar todas las sesiones del usuario
  async pauseAllUserSessions(userId) {
    try {
      const activeSessions = await this.getUserActiveSessions(userId);

      const now = new Date();
      let pausedCount = 0;

      for (const session of activeSessions) {
        await session.update({
          end_time: now,
        });
        pausedCount++;
      }

      console.log(`⏸️  Pausadas ${pausedCount} sesiones activas`);
      return pausedCount;
    } catch (error) {
      console.error("Error en pauseAllUserSessions:", error);
      return 0;
    }
  }

  // Método complementario: Detener sesión
  async stopWorkSessionService(req) {
    try {
      const { sessionId, endTime, notes } = req.body;
      const userId = req.userId;

      console.log(
        `⏹️  Deteniendo sesión: ${sessionId} para usuario: ${userId}`
      );

      // Validaciones
      if (!sessionId) {
        return {
          success: false,
          statusCode: 400,
          message: "El ID de la sesión es requerido",
          result: null,
        };
      }

      // Buscar la sesión con su tarea para verificar propiedad
      const workSession = await WorkSession.findOne({
        where: { id: sessionId },
        include: [
          {
            association: "task",
            attributes: ["id", "title", "user_id"],
          },
        ],
      });

      if (!workSession) {
        return {
          success: false,
          statusCode: 404,
          message: "Sesión no encontrada",
          result: null,
        };
      }

      // Verificar que la tarea pertenece al usuario
      if (workSession.task.user_id !== userId) {
        return {
          success: false,
          statusCode: 403,
          message: "No tienes permiso para detener esta sesión",
          result: null,
        };
      }

      // Verificar que la sesión no esté ya detenida
      if (workSession.end_time) {
        return {
          success: false,
          statusCode: 400,
          message: "Esta sesión ya ha sido detenida",
          result: workSession,
        };
      }

      // Actualizar la sesión
      const updateData = {
        end_time: endTime || new Date(),
      };

      if (notes !== undefined) {
        updateData.notes = notes;
      }

      await workSession.update(updateData);

      // El hook beforeSave calculará automáticamente la duración
      console.log(
        `✅ Sesión detenida - Duración: ${workSession.duration} segundos`
      );

      // Actualizar duración total de la tarea
      await this.updateTaskTotalDuration(workSession.task_id);

      return {
        success: true,
        statusCode: 200,
        message: "Sesión detenida exitosamente",
        result: workSession,
      };
    } catch (error) {
      console.error("❌ Error en stopWorkSessionService:", error);
      return {
        success: false,
        statusCode: 500,
        message: "Error al detener sesión de trabajo",
        error: error.message,
      };
    }
  }

  // Método auxiliar: Actualizar duración total de la tarea
  async updateTaskTotalDuration(taskId) {
    try {
      const totalDuration = await WorkSession.sum("duration", {
        where: { task_id: taskId },
      });

      await Task.update(
        { duration: totalDuration || 0 },
        { where: { id: taskId } }
      );

      console.log(
        `📊 Tarea ${taskId} - Duración total actualizada: ${totalDuration} segundos`
      );
      return totalDuration;
    } catch (error) {
      console.error("Error en updateTaskTotalDuration:", error);
    }
  }

  // Método para obtener sesiones activas actuales
  async getActiveSessionsService(req) {
    try {
      const userId = req.userId;

      const activeSessions = await WorkSession.findAll({
        where: { end_time: null },
        include: [
          {
            association: "task",
            attributes: ["id", "title", "status", "user_id"],
            where: { user_id: userId },
            include: [
              {
                association: "category",
                attributes: ["id", "name", "color"],
              },
            ],
          },
        ],
        order: [["start_time", "DESC"]],
      });

      return {
        success: true,
        statusCode: 200,
        message: "Sesiones activas obtenidas",
        result: activeSessions,
        count: activeSessions.length,
      };
    } catch (error) {
      console.error("❌ Error en getActiveSessionsService:", error);
      return {
        success: false,
        statusCode: 500,
        message: "Error al obtener sesiones activas",
        error: error.message,
      };
    }
  }
}
