import { Category } from "../models/Entity/Category.js";

export class CategoryService {
  async createCategoryService(req) {
    try {
        const userId = req.userId;
        const { name } = req.body;
    
        const category = await Category.create(name);
        
        
    } catch (error) {
        
    }
  }
}
