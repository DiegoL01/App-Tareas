import { createContext, useContext, useReducer } from "react";
import { type Task } from "./../types/TaskType";

type State = {
  tasks: Task[];
};

type Action = { type: string; payload?: any };

type TaskContextType = {
  state: State;
  dispatch: React.Dispatch<Action>;
} | null;

const inicialState: State = {
  tasks: [
     {
    id: "1",
    title: "Sample Task",
    description: "This is a sample task",
    startTime: undefined,
    endTime: undefined,
    completed : false,
  },
   {
    id: "2",
    title: "Sample Task 2",
    description: "This is a sample task 2",
    startTime: null,
    endTime: null,
    completed : false,
  },
   {
    id: "3",
    title: "Sample Task 3",
    description: "This is a sample task 3",
    startTime: null,
    endTime: null,
    completed : false,
  }
  ] as Task[],
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const taskReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TASK":
      return {
        ...state,
        tasks: [...state.tasks, action.payload as Task],
      };
    case "REMOVE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((task: Task) => task.id !== action.payload as string),
      };
    case "EDIT_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task: Task) =>
          task.id === action.payload.id ? { ...task, ...action.payload } : task
        ),
      };
    default:
      return state;
  }
};

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(taskReducer, inicialState);

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks , no puede usarse fuera de TaskProvider");
  }
  return context;
};

export default TaskContext;