import { Router } from "express";
import { TaskService } from "../services/task.service.js";
import { TaskControllers } from "../controllers/task.controller.js";
import { createTaskValidation } from "../middlewares/taskMiddlewares.js";

export const createTaskRoutes = () => {
    const router = Router();

    const taskService = new TaskService();
    const taskControllers = new TaskControllers( taskService );

    router.post('/',createTaskValidation,(req ,res) => taskControllers.createTaskController(req,res));

    router.get('/',(req,res) => taskControllers.getTasksAllController(req,res));

    router.patch('/:taskId',(req,res) => taskControllers.updateTaskController(req,res));

    router.delete('/:taskId',(req,res) => taskControllers.deleteTaskController(req,res));

    router.get('/:taskId',(req,res) => taskControllers.getTaskByIdController(req,res));

    return router;
}