
export const validateTaskStartTime = (req, res, next) => {
    const { start_time } = req.body;

    if (!start_time) {
        return res.status(400).json({
            message: "El campo 'start_time' es obligatorio."
        });
    }

    const inputStartTime = new Date(start_time);
    const now = new Date();

    if (isNaN(inputStartTime.getTime())) {
        return res.status(400).json({
            message: "Formato de fecha de inicio inválido. Asegúrese de usar un formato válido (ej. ISO 8601)."
        });
    }

    if (inputStartTime <= now) {
        return res.status(400).json({
            message: "La fecha de inicio ('start_time') debe ser posterior a la hora actual para una nueva tarea activa."
        });
    }

    next();
};






