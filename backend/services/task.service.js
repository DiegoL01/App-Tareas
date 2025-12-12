// services/task.service.js
import { Category } from "../models/Entity/Category.js";
import { Task } from "../models/Entity/Task.js";

export class TaskService {
  async createTaskService(req) {
    try {
      const { title, description, category_id } = req.body;
      const userId = req.userId;
      
      const category = await Category.findOne({
        where: {
          user_id: userId,
          id: category_id,
        },
      });
      
      if (!category) {
        return {
          statusCode: 400,
          message: "Esta categoria no existe",
        };
      }

      const task = await Task.create({
        title: title,
        description: description || null,
        user_id: req.userId,
        category_id: category_id || null,
      });

      return {
        statusCode: 201,
        message: "Tarea añadida",
        result: task,
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: "No se pudo agregar la tarea",
        error: error.message,
      };
    }
  }

  async getTasksAllService(req) {
    try {
      const filters = req.query;

      const whereClause = {};

      whereClause.user_id = req.userId;

      // Aplicar filtros si existen
      if (filters.status) {
        whereClause.status = filters.status;
      }

      if (filters.category_id) {
        whereClause.category_id = Number(filters.category_id);
      }

      const tasks = await Task.findAll({
        where: whereClause,
        order: [["created_at", "DESC"]],
        include: [
          {
            association: "category",
            attributes: ["id", "name"],
          },
        ],
      });

      return {
        statusCode: 200,
        message: "Tareas obtenidas exitosamente",
        result: tasks,
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: "Error al obtener las tareas",
        error: error.message,
      };
    }
  }

  async getTaskByIdService(req) {
    try {
      const { taskId } = req.params;
      const user_id = req.userId;

      const task = await Task.findOne({
        where: {
          id: taskId,
          user_id: user_id,
        },
        include: [
          {
            association: "category",
            attributes: ["id", "name"],
          }
        ],
      });

      if (!task) {
        return {
          statusCode: 404,
          message: "Tarea no encontrada",
          result: null,
        };
      }

      return {
        statusCode: 200,
        message: "Tarea obtenida exitosamente",
        result: task,
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: "Error al obtener la tarea",
        error: error.message,
      };
    }
  }

  async updateTaskService(req) {
    try {
      const updateData = req.body;
      const user_id = req.userId;
      const { taskId } = req.params;

      const task = await Task.findOne({
        where: {
          id: taskId,
          user_id: user_id,
        },
      });

      if (!task) {
        return {
          statusCode: 404,
          message: "Tarea no encontrada",
          result: null,
        };
      }

      console.log(updateData);

      // Actualizar la tarea
      await task.update(updateData);

      console.log(task)

      return {
        statusCode: 200,
        message: "Tarea actualizada exitosamente",
        result: task,
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: "Error al actualizar la tarea",
        error: error.message,
      };
    }
  }

  async deleteTaskService(req) {
    try {
      const { taskId } = req.params;
      const user_id = req.userId;

      const task = await Task.findOne({
        where: {
          id: taskId,
          user_id: user_id,
        },
      });

      if (!task) {
        return {
          statusCode: 404,
          message: "Tarea no encontrada",
          result: null,
        };
      }

      await task.destroy();

      return {
        statusCode: 200,
        message: "Tarea eliminada exitosamente",
        result: { id: taskId },
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: "Error al eliminar la tarea",
        error: error.message,
      };
    }
  }
}
