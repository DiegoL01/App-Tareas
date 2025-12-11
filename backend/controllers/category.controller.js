
export class CategoryControllers {
    constructor(categoryService){
        this.categoryService = categoryService;
    }

    async createCategoryController (req, res) {
        const response = await this.categoryService.createCategoryService(req);
        return res.status(response.statusCode).json(response)
    }

    async deleteCategoryController (req, res) {
        const response = await this.categoryService.deleteCategoryService(req);
        return res.status(response.statusCode).json(response)
    }

}