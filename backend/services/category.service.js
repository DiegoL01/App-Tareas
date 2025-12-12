import { Category } from "../models/Entity/Category.js";

export class CategoryService {
  async createCategoryService(req) {
    try {
      const { name } = req.body;
      const userId = req.userId;

      const category = await Category.findOne({ 
        where: { 
          name: name.toUpperCase(),
          user_id: userId 
        } 
      });

      if (category) {
        return {
          statusCode: 400,
          message: "Esta categoria ya existe",
        };
      }

      const cat = await Category.create({ 
          name: name.toUpperCase(),
          user_id: userId 
      });

      return {
        statusCode: 201,
        message: "Categoria agregada",
        result: cat,
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: "No se pudo agregar la categoria",
        error: error.message,
      };
    }
  }

  async getCategoriesAllService(req) {
    try {
      const userId = req.userId;

      const categories = await Category.findAll({
        where: {
          user_id: userId,
        },
        order: [["name", "ASC"]],
      });

      return {
        statusCode: 200,
        message: "Categorías obtenidas exitosamente",
        result: categories,
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: "Error al obtener las categorías",
        error: error.message,
      };
    }
  }

  async deleteCategoryService(req) {
    try {
      const { name } = req.params;
      console.log(name)

      const deletedRowCount = await Category.destroy({
        where: { name: name.toUpperCase()},
      });
      console.log(deletedRowCount)
      if (deletedRowCount === 0) {
        return {
          statusCode: 404,
          message: `Categoría con ID ${name} no encontrada.`,
        };
      }
      return {
        statusCode: 200,
        message: `Categoría con ID ${name} eliminada exitosamente.`,
        result: { name: name },
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: "Error al intentar eliminar la categoría.",
        error: error.message,
      };
    }
  }
}
