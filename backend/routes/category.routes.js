import { Router } from "express";
import { CategoryService } from "../services/category.service.js";
import { CategoryControllers } from "../controllers/category.controller.js";

export const createCategoryRoutes = () => {
    const router = Router();

    const categoryService = new CategoryService();
    const categoryController = new CategoryControllers(categoryService)

   /* //Crear categoria
    router.post('/',( req ,res ) => categoryController.createCategoryController(req,res));

    //obtener categorias
    router.get('/')
    
    //Eliminar categoria
    router.delete('/')
*/
    return router;
}