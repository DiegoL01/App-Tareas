import { check } from "express-validator";
import { validationsErrors } from "./validationErrors.js";

export const createTaskValidation = [
    check('title','El titulo es obligatorio').notEmpty(),
    validationsErrors
]