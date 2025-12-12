import { createContext, useContext, useReducer, useEffect } from "react";
import { type Task } from "./../types/TaskType";
import { useAuth } from "../hooks/useAuth";
import { DOMAIN_URL } from "../config/env";

type BackendTask = {
  id: number;
  title: string;
  description?: string | null;
  status: "pending" | "completed";
  duration: string | number; // en segundos (STRING en el modelo)
  user_id?: number;
  category_id?: number | null;
  created_at?: string;
  updated_at?: string;
  category?: {
    id: number;
    name: string;
    color?: string;
  } | null;
};

type State = {
  tasks: Task[];
  loading: boolean;
  error: string | null;
};

type Action =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_TASKS"; payload: Task[] }
  | { type: "ADD_TASK"; payload: Task }
  | { type: "REMOVE_TASK"; payload: string }
  | { type: "EDIT_TASK"; payload: Partial<Task> & { id: string } }
  | { type: "UPDATE_TASK_DURATION"; payload: { id: string; duration: number } };

type Category = {
  id: number;
  name: string;
  color?: string;
};

type TaskContextType = {
  state: State;
  loadTasks: () => Promise<void>;
  createTask: (task: { title: string; description?: string; category_id?: number }) => Promise<Task | null>;
  updateTask: (id: string, updates: { title?: string; description?: string }) => Promise<boolean>;
  deleteTask: (id: string) => Promise<boolean>;
  pauseTask: (id: string, duration: number) => Promise<boolean>; 
  finishTask: (id: string, duration: number) => Promise<boolean>;
  resumeTask: (id: string) => Promise<boolean>;
  getCategories: () => Promise<Category[]>;
  createCategory: (name: string) => Promise<Category | null>;
  getOrCreateCategory: (name: string) => Promise<Category | null>;
  dispatch: React.Dispatch<Action>;
} | null;

const API_BASE_URL = `${DOMAIN_URL}/api/task`;
const API_CATEGORY_URL = `${DOMAIN_URL}/api/category`;

// Mapear del backend al frontend
const mapBackendToFrontend = (backendTask: BackendTask): Task => {
  const durationSeconds = typeof backendTask.duration === "string" 
    ? parseInt(backendTask.duration) || 0 
    : backendTask.duration || 0;
  const tiempoPausa = durationSeconds * 1000;

  return {
    id: String(backendTask.id),
    title: backendTask.title,
    description: backendTask.description || undefined,
    startTime: null,
    endTime: null,
    tiempoPausa: tiempoPausa > 0 ? tiempoPausa : undefined,
    completed: backendTask.status === "completed",
    lastSessionTime: undefined,
    category_id: backendTask.category_id,  
    category: backendTask.category || undefined, 
  };
};

const initialState: State = {
  tasks: [],
  loading: false,
  error: null,
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const taskReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_TASKS":
      return { ...state, tasks: action.payload, error: null };
    case "ADD_TASK":
      return {
        ...state,
        tasks: [...state.tasks, action.payload as Task],
        error: null,
      };
    case "REMOVE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((task: Task) => task.id !== action.payload),
        error: null,
      };
    case "EDIT_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task: Task) =>
          task.id === action.payload.id ? { ...task, ...action.payload } : task
        ),
        error: null,
      };
    case "UPDATE_TASK_DURATION":
      return {
        ...state,
        tasks: state.tasks.map((task: Task) =>
          task.id === action.payload.id
            ? { ...task, tiempoPausa: action.payload.duration }
            : task
        ),
        error: null,
      };
    default:
      return state;
  }
};

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);
  const { state: authState } = useAuth();

  // Helper para hacer requests con autenticación
  const apiRequest = async (
    endpoint: string,
    options: RequestInit = {},
    baseUrl: string = API_BASE_URL
  ): Promise<any> => {
    const token = authState.token;
    if (!token) {
      throw new Error("No hay token de autenticación");
    }
console.log("Haciendo petición a:", `${baseUrl}${endpoint}`);
    const response = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "token": `${token}`, 
        ...options.headers,
      },
    });
    if (!response.body && response.ok) {
      return { result: [] }; 
    }
    const data = await response.json();

    if (!response.ok || !data.statusCode || data.statusCode >= 400) {
      throw new Error(data.message || "Error en la petición");
    }

    return data;
  };

  // Cargar todas las tareas
  const loadTasks = async () => {
    if (!authState.token) {
      return;
    }

    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      const data = await apiRequest("", {
        method: "GET",
      })
      console.log("Datos de tareas recibidos:", data);
      const tasks = (data.result || []).map(mapBackendToFrontend);
      dispatch({ type: "SET_TASKS", payload: tasks });
    } catch (error: any) {
      dispatch({ type: "SET_ERROR", payload: error.message });
      console.error("Error al cargar tareas:", error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Crear una nueva tarea
  const createTask = async (
    task: { title: string; description?: string; category_id?: number }
  ): Promise<Task | null> => {
    if (!authState.token) {
      throw new Error("No hay token de autenticación");
    }

    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      const data = await apiRequest("", {
        method: "POST",
        body: JSON.stringify({
          title: task.title,
          description: task.description || null,
          category_id: task.category_id || null,
        }),
      });

      const newTask = mapBackendToFrontend(data.result);
      dispatch({ type: "ADD_TASK", payload: newTask });
      return newTask;
    } catch (error: any) {
      dispatch({ type: "SET_ERROR", payload: error.message });
      console.error("Error al crear tarea:", error);
      return null;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Actualizar título/descripción de una tarea
  const updateTask = async (
    id: string,
    updates: { title?: string; description?: string }
  ): Promise<boolean> => {
    if (!authState.token) {
      throw new Error("No hay token de autenticación");
    }

    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      await apiRequest(`/${id}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      });

      dispatch({ type: "EDIT_TASK", payload: { id, ...updates } });
      return true;
    } catch (error: any) {
      dispatch({ type: "SET_ERROR", payload: error.message });
      console.error("Error al actualizar tarea:", error);
      return false;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Eliminar una tarea
  const deleteTask = async (id: string): Promise<boolean> => {
    if (!authState.token) {
      throw new Error("No hay token de autenticación");
    }

    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      await apiRequest(`/${id}`, {
        method: "DELETE",
      });

      dispatch({ type: "REMOVE_TASK", payload: id });
      return true;
    } catch (error: any) {
      dispatch({ type: "SET_ERROR", payload: error.message });
      console.error("Error al eliminar tarea:", error);
      return false;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Pausar tarea: envía id y duration (en segundos)
  const pauseTask = async (id: string, duration: number): Promise<boolean> => {
    if (!authState.token) {
      throw new Error("No hay token de autenticación");
    }

    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      const durationSeconds = Math.floor(duration / 1000); 
      await apiRequest(`/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          duration: String(durationSeconds), 
        }),
      });

      // Actualizar el estado local
      dispatch({ type: "UPDATE_TASK_DURATION", payload: { id, duration } });
      return true;
    } catch (error: any) {
      dispatch({ type: "SET_ERROR", payload: error.message });
      console.error("Error al pausar tarea:", error);
      return false;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Finalizar tarea: envía id y duration (en segundos), marca como completed
  const finishTask = async (id: string, duration: number): Promise<boolean> => {
    if (!authState.token) {
      throw new Error("No hay token de autenticación");
    }

    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      const durationSeconds = Math.floor(duration / 1000); 
      await apiRequest(`/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          duration: String(durationSeconds),
          status: "completed",
        }),
      });

      // Actualizar el estado local
      dispatch({
        type: "EDIT_TASK",
        payload: {
          id,
          tiempoPausa: duration,
          completed: true,
          startTime: null,
          endTime: null,
        },
      });
      return true;
    } catch (error: any) {
      dispatch({ type: "SET_ERROR", payload: error.message });
      console.error("Error al finalizar tarea:", error);
      return false;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const resumeTask = async (id: string): Promise<boolean> => {
    const task = state.tasks.find((t) => t.id === id);
    if (!task) {
      dispatch({ type: "SET_ERROR", payload: "Tarea no encontrada" });
      return false;
    }

   
    dispatch({
      type: "EDIT_TASK",
      payload: {
        id,
        startTime: new Date(),
        endTime: null,
        completed: false,
      },
    });

    return true;
  };

  // Obtener todas las categorías del usuario
  const getCategories = async (): Promise<Category[]> => {
    if (!authState.token) {
      throw new Error("No hay token de autenticación");
    }

    try {
      const data = await apiRequest("", {}, API_CATEGORY_URL);
      if (data.result && Array.isArray(data.result)) {
        return data.result.map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          color: cat.color,
        }));
      }
      return [];
    } catch (error: any) {
      console.error("Error al obtener categorías:", error);
      return [];
    }
  };

  // Crear una nueva categoría
  const createCategory = async (name: string): Promise<Category | null> => {
    if (!authState.token) {
      throw new Error("No hay token de autenticación");
    }

    try {
      const data = await apiRequest("", {
        method: "POST",
        body: JSON.stringify({ name }),
      }, API_CATEGORY_URL);

      return {
        id: data.result.id,
        name: data.result.name,
        color: data.result.color,
      };
    } catch (error: any) {
      console.error("Error al crear categoría:", error);
      // Si la categoría ya existe, intentar obtenerla
      if (error.message.includes("ya existe")) {
        return null;
      }
      throw error;
    }
  };

  // Obtener o crear una categoría
  const getOrCreateCategory = async (name: string): Promise<Category | null> => {
    try {
      // Intentar crear la categoría
      const category = await createCategory(name);
      if (category) {
        return category;
      }
      // Si ya existe, buscar en las categorías existentes
      const categories = await getCategories();
      const existingCategory = categories.find(
        (cat) => cat.name.toUpperCase() === name.toUpperCase()
      );
      return existingCategory || null;
    } catch (error: any) {
      console.error("Error al obtener o crear categoría:", error);
      // Si el error es que ya existe, intentar obtenerla
      if (error.message.includes("ya existe")) {
        const categories = await getCategories();
        const existingCategory = categories.find(
          (cat) => cat.name.toUpperCase() === name.toUpperCase()
        );
        return existingCategory || null;
      }
      return null;
    }
  };

  // Cargar tareas cuando el usuario se autentica
  useEffect(() => {
    if (authState.token && authState.user) {
      loadTasks();
    } else {
      // Limpiar tareas cuando el usuario cierra sesión
      dispatch({ type: "SET_TASKS", payload: [] });
    }
  }, [authState.token, authState.user]);

  return (
    <TaskContext.Provider
      value={{
        state,
        loadTasks,
        createTask,
        updateTask,
        deleteTask,
        pauseTask,
        finishTask,
        resumeTask,
        getCategories,
        createCategory,
        getOrCreateCategory,
        dispatch,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks no puede usarse fuera de TaskProvider");
  }
  return context;
};

export default TaskContext;
