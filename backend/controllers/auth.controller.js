export class AuthControllers {
  constructor(authService) {
    this.authService = authService;
  }

  //Controlador de registrarse
  async registerControllers(req, res) {
    const response = await this.authService.registerService(req.body);

    return res.status(response.statusCode).json(response);
  }

  //Controlador de logearse
  async loginControllers(req, res) {
    const response = await this.authService.loginService(req.body);

    return res.status(response.statusCode).json(response);
  }
}
