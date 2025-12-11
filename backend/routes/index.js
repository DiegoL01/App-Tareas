import { Router } from "express"
import { createAuthRoutes } from "./auth.routes.js";
import { createTaskRoutes } from "./task.routes.js";
import { verifyToken } from "../middlewares/authMiddlewares.js";
import { createCategoryRoutes } from "./category.routes.js";
import { createWorkSessionRoutes } from "./work_session.routes.js";

export const createRoutes = () => {
    const router = Router();

    router.use('/auth', createAuthRoutes());

    router.use('/task',verifyToken)
    router.use('/task',createTaskRoutes());
    
    router.use('/category',verifyToken);
    router.use('/category',createCategoryRoutes());
    
    router.use('/work-sessions',verifyToken);
    router.use('/work-sessions',createWorkSessionRoutes());
    
    return router;
}