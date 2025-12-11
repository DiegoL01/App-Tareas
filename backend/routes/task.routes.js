import { Router } from "express";
import { TaskService } from "../services/task.service.js";
import { TaskControllers } from "../controllers/task.controller.js";
import { validateTaskStartTime } from "../middlewares/taskMiddlewares.js";

export const createTaskRoutes = () => {
    const router = Router();

    const taskService = new TaskService();
    const taskControllers = new TaskControllers( taskService );

    //craer una tarea 
    router.post('/',validateTaskStartTime,(req ,res) => taskControllers.createTaskController(req,res));

    //obtener todas las tareas (se puede filtar)
    router.get('/',(req,res) => taskControllers.getTasksAllController(req,res));

    //actualizar la tarea 
    router.patch('/:taskId',(req,res) => taskControllers.updateTaskController(req,res));

    //Eliminar la tarea 
    router.delete('/:taskId',(req,res) => taskControllers.deleteTaskController(req,res));

    //Obtener tarea por id
    router.get('/:taskId',(req,res) => taskControllers.getTaskByIdController(req,res));

    return router;
}