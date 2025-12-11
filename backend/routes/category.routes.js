import { Router } from "express";
import { CategoryService } from "../services/category.service.js";
import { CategoryControllers } from "../controllers/category.controller.js";
import { validationsCreateCategory } from "../middlewares/categoryMiddlewares.js";

export const createCategoryRoutes = () => {
    const router = Router();

    const categoryService = new CategoryService();
    const categoryController = new CategoryControllers(categoryService)

    //Crear categoria
    router.post('/',validationsCreateCategory,( req ,res ) => categoryController.createCategoryController(req,res));

    //Eliminar categoria
    router.delete('/:name',( req ,res ) => categoryController.deleteCategoryController(req,res));

    return router;
}