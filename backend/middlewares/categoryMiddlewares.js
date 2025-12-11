import { check } from "express-validator";
import { validationsErrors } from "./validationErrors.js";

export const validationsCreateCategory = [
    check('name','El nombre de la categoria es obligatoria').notEmpty(),
    check('name','El nombre de la categoria tiene que ser un String').isString(),
    validationsErrors
]