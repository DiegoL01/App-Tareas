import { Router } from "express";
import { AuthService } from '../services/auth.service.js';
import { AuthControllers } from "../controllers/auth.controller.js";
import { validationLogin, validationRegister } from "../middlewares/authMiddlewares.js";

export const createAuthRoutes = () => {
    const router = Router();

    const authService = new AuthService();
    const authControllers = new AuthControllers( authService );

    router.post('/register',validationRegister, (req, res) => authControllers.registerControllers(req,res));
    
    router.post('/login', validationLogin, (req, res) => authControllers.loginControllers(req, res));

    return router;
}
