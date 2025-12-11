import React, { useEffect, useMemo, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTasks } from "../context/TaskContext";
import { useRouter } from "expo-router";
type Props = {
  id: string;
  onDone?: () => void;
};

function formatDuration(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

const ReadTask = ({ id, onDone }: Props) => {
  const { state, dispatch } = useTasks();
  const task = state.tasks.find((t) => t.id === id);
  const router = useRouter();

  const normalizedStart = useMemo(() => {
    if (!task?.startTime) return null;
    return task.startTime instanceof Date ? task.startTime : new Date(task.startTime as Date);
  }, [task?.startTime]);

  const normalizedEnd = useMemo(() => {
    if (!task?.endTime) return null;
    return task.endTime instanceof Date ? task.endTime : new Date(task.endTime as Date);
  }, [task?.endTime]);

  const isRunning = !!(normalizedStart && !normalizedEnd);

  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, [isRunning]);

  if (!task) {
    return (
      <View className="p-4">
        <Text className="text-center text-gray-500">Tarea no encontrada</Text>
      </View>
    );
  }

  const elapsedMs = (() => {
    if (normalizedEnd) {
      // finished: elapsedBefore already stored + difference between end and start (if start existed)
      if (normalizedStart) return (task?.tiempoPausa ?? 0) + (normalizedEnd.getTime() - normalizedStart.getTime());
      return task?.tiempoPausa ?? 0;
    }
    if (normalizedStart) {
      return (task?.tiempoPausa ?? 0) + (now.getTime() - normalizedStart.getTime());
    }
    return task?.tiempoPausa ?? 0;
  })();

  const handleStart = () => {
    if (normalizedStart) return; 
    dispatch({ type: "EDIT_TASK", payload: { id, startTime: new Date(), endTime: undefined, completed: false } });
  };

  const handlePause = () => {
    if (!normalizedStart) return;
    const nowDate = new Date();
    const added = nowDate.getTime() - normalizedStart.getTime();
    const newElapsed = (task?.tiempoPausa ?? 0) + added;
    dispatch({ type: "EDIT_TASK", payload: { id, startTime: undefined, tiempoPausa: newElapsed } });
  };

  const handleResume = () => {
    if (normalizedStart) return;
    dispatch({ type: "EDIT_TASK", payload: { id, startTime: new Date(), endTime: undefined, completed: false } });
  };

  const handleFinish = () => {
    const nowDate = new Date();
    if (normalizedStart) {
      const added = nowDate.getTime() - normalizedStart.getTime();
      const newElapsed = (task?.tiempoPausa ?? 0) + added;
      dispatch({ type: "EDIT_TASK", payload: { id, endTime: nowDate, tiempoPausa: newElapsed, startTime: undefined, completed: true } });
    } else {
      dispatch({ type: "EDIT_TASK", payload: { id, endTime: nowDate, completed: true } });
    }
    if (onDone) onDone();
  };

  return (
    <View className="p-4">
      <View className="bg-white rounded p-4 mb-4">
        <Text className="text-xl font-semibold mb-2">{task.title}</Text>
        {task.description ? <Text className="text-gray-600 mb-2">{task.description}</Text> : null}
        <Text className="text-sm text-gray-500">Estado: {task.completed ? "Completada" : isRunning ? "En progreso" : "Pendiente"}</Text>
      </View>

      <View className="bg-white rounded p-4 mb-4">
        <Text className="text-sm text-gray-500 mb-2">Contador</Text>
        <Text className="text-2xl font-mono mb-4">{formatDuration(elapsedMs)}</Text>



        {(!normalizedStart && (task?.tiempoPausa ?? 0) === 0 && !task?.completed) ? (
          <TouchableOpacity onPress={handleStart} className="bg-blue-600 py-3 rounded mb-2">
            <Text className="text-center text-white font-semibold">Iniciar contador</Text>
          </TouchableOpacity>
        ) : null}

        {normalizedStart ? (
          <TouchableOpacity onPress={handlePause} className="bg-yellow-500 py-3 rounded mb-2">
            <Text className="text-center text-white font-semibold">Pausar</Text>
          </TouchableOpacity>
        ) : (task?.tiempoPausa ?? 0) > 0 && !task?.completed ? (
          <TouchableOpacity onPress={handleResume} className="bg-green-600 py-3 rounded mb-2">
            <Text className="text-center text-white font-semibold">Reanudar</Text>
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity onPress={handleFinish} className="bg-red-600 py-3 rounded mb-2">
          <Text className="text-center text-white font-semibold">Finalizar tarea</Text>
        </TouchableOpacity>
      </View>


      <TouchableOpacity onPress={() => {
        router.back();
      }} className="bg-gray-200 py-3 rounded">
        <Text className="text-center">Volver</Text>
      </TouchableOpacity>

    </View>
  );
};

export default ReadTask;
