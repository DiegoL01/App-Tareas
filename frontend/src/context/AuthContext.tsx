import { createContext, useReducer, useEffect, useCallback } from "react";
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
  initializing: true, // Comienza en true hasta que se cargue el token
  error: null,
};

export const AuthContext = createContext<{
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
} | null>(null);

//--------REDUCER
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

// ----------PROVIDER 
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

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

  // accione saisncronas para el login y el registro

const login = async (email: string, password: string) => {
    const API_URL = "http://192.168.106.197:3000/api/auth/login"; 
    
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
            let errorData;
            let errorMessage = "Error de conexión con el servidor.";

            try {
                errorData = await res.json(); 
                
                errorMessage = errorData.message || errorMessage; 
                
                if (errorData.statusCode >= 500) {
                    errorMessage = `Error del servidor `;
                }
                 if (errorData.statusCode >= 400 && errorData.statusCode < 500) {
                    errorMessage = `CREDENCIALES INVALIDAS: Por favor verifica tu email y contraseña.`;
                }

            } catch (e) {
                errorMessage = `Error ${res.status}: Respuesta del servidor no válida.`;
            }
            
            throw new Error(errorMessage);
        }

        const data = await res.json();
        
        if (data.success === false) {
             throw new Error(data.message || "Error de credenciales (backend).");
        }
        
        if (!data.result || !data.token) {
            throw new Error("Respuesta de éxito del servidor incompleta (faltan user o token).");
        }

        await saveAuthData(data.result, data.token);

        dispatch({
            type: "LOGIN_SUCCESS",
            payload: { user: data.result, token: data.token },
        });

    } catch (error: any) {
       let errorMessage = error.message;

        if (error.message.includes("fetch") || error.message.includes("Network request failed")) {
            errorMessage = "No se pudo conectar al servidor. Verifica la IP, el Firewall y que el servidor esté corriendo.";
        }
        
        console.error("Error en login:", error);
        dispatch({ type: "SET_ERROR", payload: errorMessage });
    } finally {
        dispatch({ type: "SET_LOADING", payload: false });
    }
};

  const register = async (name: string, email: string, password: string) => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      const res = await fetch("http://192.168.106.197:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Error al registrarse");
      }
      await login(email, password);
    } catch (error: any) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  };

  const logout = useCallback(async () => {
    try {
      await clearAuthData();
      dispatch({ type: 'LOGOUT' });
      
    } catch (error) {
      console.error('Error durante logout:', error);
      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
