export const validateDateOrder = (req, res, next) => {
    const { start_time, end_time } = req.body;

    if (!start_time || !end_time) {
        return res.status(400).json({
            message: "Faltan campos de fecha requeridos: 'start_time' o 'end_time'."
        });
    }

    const startDate = new Date(start_time);
    const endDate = new Date(end_time);


    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return res.status(400).json({
            message: "Formato de fecha inválido. Asegúrese de usar un formato válido "
        });
    }

    if (startDate.getTime() > endDate.getTime()) {
        return res.status(400).json({
            message: "Error de lógica de tiempo: La fecha de inicio ('start_time') no puede ser posterior a la fecha de fin ('end_time')."
        });
    }
    next();
};





