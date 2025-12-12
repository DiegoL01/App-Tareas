export type Task = {
    id: string;
    title: string;
    description?: string;
    startTime: Date | null;
    endTime: Date | null;
    // Tiempo acumulado en ms antes de la última pause/resume
    tiempoPausa?: number;
    completed?: boolean;
    lastSessionTime?: number;
    category_id?: number | null;
    category?: {
        id: number;
        name: string;
        color?: string;
    } | null;

}