import { createContext, useContext, useReducer } from "react";

type User = {
  id: number;
  email: string;
  name: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
};

type Action =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "LOGIN_SUCCESS"; payload: { user: User; token: string } }
  | { type: "REGISTER_SUCCESS"; payload: User }
  | { type: "LOGOUT" }
  | { type: "SET_ERROR"; payload: string | null };

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

 export const AuthContext = createContext<{
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
} | null>(null);
//-------------------- REDUCER --------------------
function authReducer(state: AuthState, action: Action): AuthState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null,
      };

    case "REGISTER_SUCCESS":
      return {
        ...state,
        user: action.payload,
        loading: false,
        error: null,
      };

    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };

    case "LOGOUT":
      return { ...initialState };

    default:
      return state;
  }
}

// -------------------- PROVIDER --------------------
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // ------------ ASYNC ACTIONS --------------

  const login = async (email: string, password: string) => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Error al iniciar sesión");
      }

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { user: data.result, token: data.token },
      });
    } catch (error: any) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  };

  const register = async (name: string, email: string, password: string) => {
    dispatch({ type: "SET_LOADING", payload: true });

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

      dispatch({
        type: "REGISTER_SUCCESS",
        payload: data.result,
      });
    } catch (error: any) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  };

  const logout = () => dispatch({ type: "LOGOUT" });

  return (
    <AuthContext.Provider value={{ state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

