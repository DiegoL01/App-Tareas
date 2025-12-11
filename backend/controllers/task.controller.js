
export class TaskControllers {
    constructor(taskService){
        this.taskService = taskService;
    }

    async createTaskController (req, res) {
        const response = await this.taskService.createTaskService(req);
        return res.status(response.statusCode).json(response)
    }
    async updateTaskController (req, res) {
        const response = await this.taskService.updateTaskService(req);
        return res.status(response.statusCode).json(response)
    }
    async getTasksAllController (req, res) {
        const response = await this.taskService.getTasksAllService(req);
        return res.status(response.statusCode).json(response)
    }
    async getTaskByIdController (req, res) {
        const response = await this.taskService.getTaskByIdService(req);
        return res.status(response.statusCode).json(response)
    }
    async deleteTaskController (req, res) {
        const response = await this.taskService.deleteTaskService(req);
        return res.status(response.statusCode).json(response)
    }
    
}