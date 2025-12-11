import React, { useEffect, useMemo, useRef, useState } from "react";
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
  const { state: { tasks }, dispatch } = useTasks();
  const router = useRouter();
  const task = tasks.find((t) => t.id === id);

  const normalizedStart = useMemo(() => {
    if (!task?.startTime) return null;
    return task.startTime instanceof Date ? task.startTime : new Date(task.startTime as Date);
  }, [task?.startTime]);

  const normalizedEnd = useMemo(() => {
    if (!task?.endTime) return null;
    return task.endTime instanceof Date ? task.endTime : new Date(task.endTime as Date);
  }, [task?.endTime]);

  const isRunning = !!(normalizedStart && !normalizedEnd);
  const isCompleted = !!task?.completed;
  const isPaused = !isRunning && !isCompleted && (task?.tiempoPausa ?? 0) > 0;
  const lastSessionTime = task?.lastSessionTime ?? 0;

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // FIX: Estado que se actualiza cada 100ms mientras corre
  const [now, setNow] = useState<number>(Date.now());

  useEffect(() => {
    // Limpiar intervalo anterior
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (isRunning) {
      // Actualizar cada 100ms para que el contador se vea fluido
      intervalRef.current = setInterval(() => {
        setNow(Date.now()); // Actualizar con timestamp actual
      }, 100);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, normalizedStart?.getTime()]); // Dependencia del timestamp de inicio

  if (!task) {
    return (
      <View className="p-4">
        <Text className="text-center text-gray-500">Tarea no encontrada</Text>
      </View>
    );
  }

  // FIX: Calcular con now que se actualiza cada 100ms
  const elapsedMs = useMemo(() => {
    const baseTime = task?.tiempoPausa ?? 0;
    if (!normalizedStart) return baseTime;
    // Usar el estado 'now' que se actualiza constantemente
    return baseTime + (now - normalizedStart.getTime());
  }, [task?.tiempoPausa, normalizedStart, now]); // 'now' fuerza recálculo en cada tick

  const handleStart = () => {
    if (normalizedStart) return;
    dispatch({ 
      type: "EDIT_TASK", 
      payload: { 
        id, 
        startTime: new Date(), 
        endTime: undefined, 
        completed: false,
        tiempoPausa: isCompleted ? 0 : (task?.tiempoPausa ?? 0),
      } 
    });
  };

  const handlePause = () => {
    if (!normalizedStart) return;
    const added = Date.now() - normalizedStart.getTime();
    const newElapsed = (task?.tiempoPausa ?? 0) + added;
    dispatch({ 
      type: "EDIT_TASK", 
      payload: { 
        id, 
        startTime: undefined, 
        endTime: new Date(), 
        tiempoPausa: newElapsed,
        completed: false 
      } 
    });
  };

  const handleResume = () => {
    if (normalizedStart) return;
    dispatch({ 
      type: "EDIT_TASK", 
      payload: { 
        id, 
        startTime: new Date(), 
        endTime: undefined, 
        completed: false 
      } 
    });
  };

  const handleRestart = () => {
    if (!isCompleted) return;
    dispatch({ 
      type: "EDIT_TASK", 
      payload: { 
        id, 
        startTime: new Date(), 
        endTime: undefined, 
        tiempoPausa: 0,
        completed: false,
      } 
    });
  };

  const handleFinish = () => {
    const nowDate = new Date();
    let finalTime = task?.tiempoPausa ?? 0;
    if (normalizedStart) {
      finalTime += nowDate.getTime() - normalizedStart.getTime();
    }
    dispatch({ 
      type: "EDIT_TASK", 
      payload: { 
        id, 
        startTime: undefined,
        endTime: nowDate, 
        tiempoPausa: 0,
        completed: true,
        lastSessionTime: finalTime
      } 
    });
    router.push("/(tabs)/Home");
  };

  const showStart = !normalizedStart && !isCompleted && !isPaused;
  const showPause = isRunning;
  const showResume = isPaused;

  return (
    <View className="p-4">
      {/* Task info */}
      <View className="bg-white rounded p-4 mb-4">
        <Text className="text-xl font-semibold mb-2">{task.title}</Text>
        {task.description ? <Text className="text-gray-600 mb-2">{task.description}</Text> : null}
        <Text className="text-sm text-gray-500">
          Estado: {isCompleted ? "Completada" : isRunning ? "En progreso" : isPaused ? "Pausado" : "Pendiente"}
        </Text>
      </View>

      {/* Timer */}
      <View className="bg-white rounded p-4 mb-4">
        <Text className="text-sm text-gray-500 mb-2">Contador</Text>
        <Text className="text-2xl font-mono mb-4">{formatDuration(elapsedMs)}</Text>

        {lastSessionTime > 0 && (
          <View className="bg-gray-100 rounded p-3 mb-4 items-center">
            <Text className="text-sm text-gray-600 mb-1">Última sesión</Text>
            <Text className="text-lg font-mono font-semibold text-gray-800">
              {formatDuration(lastSessionTime)}
            </Text>
          </View>
        )}

        {/* Button group */}
        <View className="space-y-3">
          {isCompleted && (
            <TouchableOpacity 
              onPress={handleRestart} 
              className="bg-purple-600 py-3 rounded mb-2"
              activeOpacity={0.7}
            >
              <Text className="text-center text-white font-semibold">Iniciar nueva sesión</Text>
            </TouchableOpacity>
          )}

          {showStart && (
            <TouchableOpacity 
              onPress={handleStart} 
              className="bg-blue-600 py-3 rounded mb-2"
              activeOpacity={0.7}
            >
              <Text className="text-center text-white font-semibold">Iniciar contador</Text>
            </TouchableOpacity>
          )}

          {showPause && (
            <TouchableOpacity 
              onPress={handlePause} 
              className="bg-yellow-500 py-3 rounded mb-2"
              activeOpacity={0.7}
            >
              <Text className="text-center text-white font-semibold">Pausar</Text>
            </TouchableOpacity>
          )}

          {showResume && (
            <TouchableOpacity 
              onPress={handleResume} 
              className="bg-green-600 py-3 rounded mb-2"
              activeOpacity={0.7}
            >
              <Text className="text-center text-white font-semibold">Reanudar</Text>
            </TouchableOpacity>
          )}

          {!isCompleted && (
            <TouchableOpacity 
              onPress={handleFinish} 
              className={`py-3 rounded mb-2 ${
                isRunning ? 'bg-red-600' : 'bg-gray-400 opacity-50'
              }`}
              disabled={!isRunning}
              activeOpacity={0.7}
            >
              <Text className="text-center text-white font-semibold">Finalizar tarea</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Back button */}
      <TouchableOpacity 
        onPress={() => router.back()} 
        className="bg-gray-200 py-3 rounded"
        activeOpacity={0.7}
      >
        <Text className="text-center">Volver</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ReadTask;