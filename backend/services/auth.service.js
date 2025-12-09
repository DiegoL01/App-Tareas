import { User } from "../models/Entity/User.js";
import { createToken } from "../utils/generateJWT.js";

export class AuthService {
  async registerService(data) {
    try {
      const { email, password, name } = data;

      const user = User.build({
        email,
        password,
        name,
      });

      await user.save();

      return {
        success: true,
        result: user,
        statusCode: 201,
        message: "User regristrado exitosamente",
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: "No se ha podido registar al usuario",
        error: error.message,
      };
    }
  }

  async loginService(data) {
    const { email, password } = data;
    try {
      const user = await User.findOne({ where: { email: email } });

      if (!user)
        return {
          success: false,
          message: "Email o contraseña incorrecta",
          statusCode: 400,
        };

      const isValidPassword = await user.comparePassword(password)

      return isValidPassword
        ? {
            message: "Usuario logeado",
            success: true,
            result: user,
            statusCode: 200,
            token: createToken(user.email),
          }
        : {
            success: false,
            statusCode: 400,
            message: "Email o contraseña incorrecta",
          };
    } catch (error) {
      return {
        message: `Ha ocurrido un error en el sevidor en el login : ${error}`,
        statusCode: 500,
      };
    }
  }
}
