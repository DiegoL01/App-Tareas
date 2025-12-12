import { createContext, useReducer, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type User = {
  id: number;
  email: string;
  name: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  loading: boolean;
  initializing: boolean; // Para saber si está cargando el token guardado
  error: string | null;
};

type Action =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_INITIALIZING"; payload: boolean }
  | { type: "LOGIN_SUCCESS"; payload: { user: User; token: string } }
  | { type: "REGISTER_SUCCESS"; payload: User }
  | { type: "LOGOUT" }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "RESTORE_SESSION"; payload: { user: User; token: string } };

const STORAGE_KEYS = {
  TOKEN: "@auth_token",
  USER: "@auth_user",
};

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  initializing: true, // Empieza como true para cargar el token guardado
  error: null,
};

export const AuthContext = createContext<{
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
} | null>(null);

//-------------------- REDUCER --------------------
function authReducer(state: AuthState, action: Action): AuthState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "SET_INITIALIZING":
      return { ...state, initializing: action.payload };

    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        initializing: false,
        error: null,
      };

    case "REGISTER_SUCCESS":
      return {
        ...state,
        user: action.payload,
        loading: false,
        error: null,
      };

    case "RESTORE_SESSION":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        initializing: false,
        error: null,
      };

    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false, initializing: false };

    case "LOGOUT":
      return { ...initialState, initializing: false };

    default:
      return state;
  }
}

// -------------------- PROVIDER --------------------
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Cargar token y usuario guardados al iniciar la app
  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const [token, userString] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.USER),
      ]);

      if (token && userString) {
        const user = JSON.parse(userString);
        dispatch({
          type: "RESTORE_SESSION",
          payload: { user, token },
        });
      } else {
        dispatch({ type: "SET_INITIALIZING", payload: false });
      }
    } catch (error) {
      console.error("Error al cargar sesión guardada:", error);
      dispatch({ type: "SET_INITIALIZING", payload: false });
    }
  };

  // Guardar token y usuario en AsyncStorage
  const saveAuthData = async (user: User, token: string) => {
    try {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token),
        AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user)),
      ]);
    } catch (error) {
      console.error("Error al guardar datos de autenticación:", error);
    }
  };

  // Eliminar token y usuario de AsyncStorage
  const clearAuthData = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.TOKEN),
        AsyncStorage.removeItem(STORAGE_KEYS.USER),
      ]);
    } catch (error) {
      console.error("Error al eliminar datos de autenticación:", error);
    }
  };

  // ------------ ASYNC ACTIONS --------------

  const login = async (email: string, password: string) => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // Verificar si la respuesta es OK antes de parsear JSON
      if (!res.ok) {
        // Intentar obtener el mensaje de error del servidor
        let errorMessage = `Error ${res.status}: ${res.statusText}`;
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // Si no se puede parsear, usar el mensaje por defecto
        }
        throw new Error(errorMessage);
      }

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Error al iniciar sesión");
      }

      if (!data.result || !data.token) {
        throw new Error("Respuesta del servidor inválida");
      }

      // Guardar en AsyncStorage
      await saveAuthData(data.result, data.token);

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { user: data.result, token: data.token },
      });
    } catch (error: any) {
      // Manejar diferentes tipos de errores
      let errorMessage = "Error desconocido";

      if (error.message) {
        errorMessage = error.message;
      } else if (error.name === "TypeError" && error.message.includes("fetch")) {
        errorMessage =
          "No se pudo conectar al servidor. Verifica tu conexión a internet y que el servidor esté corriendo.";
      } else if (error.name === "NetworkError") {
        errorMessage = "Error de red. Verifica tu conexión.";
      }

      console.error("Error en login:", error);
      dispatch({ type: "SET_ERROR", payload: errorMessage });
    }
  };

  const register = async (name: string, email: string, password: string) => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Error al registrarse");
      }
      // Después de registrarse, hacer login automáticamente
      await login(email, password);
    } catch (error: any) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  };

  const logout = async () => {
    // Limpiar AsyncStorage
    await clearAuthData();
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider value={{ state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
