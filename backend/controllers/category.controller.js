
export class CategoryControllers {
    constructor(categoryService){
        this.categoryService = categoryService;
    }

    async createCategoryController (req, res) {
        const response = await this.categoryService.createCategoryService(req);
        return res.status(response.statusCode).json(response)
    }

    
}