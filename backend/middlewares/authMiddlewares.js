import { User } from "../models/Entity/User.js"
import { check } from "express-validator";
import { validationsErrors } from "./validationErrors.js";
import jwt from 'jsonwebtoken';
import { globalEnv } from "../config/configEnv.js";



export const verifyEmail = async (req, res, next) => {
    const user = await User.findOne({where: { email: req.body.email}});

    if ( !user ) return next()

    return res.status(409).json({
        success: false,
        statusCode:409,
        message: 'Este email ya esta regitrado.'
    });
}

export const verifyToken = ( req, res, next ) => {
    try {
        const token = req.header('token');
        const payload = jwt.verify(token,globalEnv.KEY_JWT);
  
        req.userId = payload.gmail;

        return next()
    } catch (error) {
        return res.status(403).json({
            success:false,
            statusCode:403,
            message: 'No hay token en la peticion'
        })
    }
}



export const validationRegister = [
    verifyEmail,
    check('name','El name es obligatorio').notEmpty(),
    check('name','El name tiene que ser un string').isString(),
    check('email','El email es obligatorio').notEmpty(),
    check('email','El email tiene que ser valido').isEmail(),
    check('password','La contraseña es obligatoria').notEmpty(),
    validationsErrors
];


export const validationLogin = [
    check('email','El email es obligatorio').notEmpty(),
    check('email','El email tiene que ser de tipo string').isString(),
    check('email','El email tiene que ser de tipo string').isEmail(),
    check('password','La contraseña es obligatoria').notEmpty(),
    check('password','La contraseña tiene que tener de 6 a 15 caracteres').isLength({min:6,max:15}),
    validationsErrors
]
