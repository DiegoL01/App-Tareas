import { Router } from "express"
import { createAuthRoutes } from "./auth.routes.js";

export const createRoutes = () => {
    const router = Router();

    router.use('/auth', createAuthRoutes());

    return router;
}