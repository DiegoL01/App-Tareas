import { Router } from "express"
import { createAuthRoutes } from "./auth.routes.js";
import { createTaskRoutes } from "./task.routes.js";
import { verifyToken } from "../middlewares/authMiddlewares.js";
import { createCategoryRoutes } from "./category.routes.js";

export const createRoutes = () => {
    const router = Router();

    router.use('/auth', createAuthRoutes());

    router.use('/task',verifyToken)
    router.use('/task',createTaskRoutes());
    
    router.use('/category',verifyToken);
    router.use('/category',createCategoryRoutes());
    
    return router;
}