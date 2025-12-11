import jwt from "jsonwebtoken";
import { globalEnv } from "../config/configEnv.js";

export const createToken = ( gmail ) => {
    
    const secretKey = globalEnv.KEY_JWT;

    if (!secretKey) {
        throw new Error('No se encontro el valor de la clave del token');
    }

    const token = jwt.sign(
        {gmail},
        secretKey,
        {expiresIn: '30d'}
      );

    return token;
}