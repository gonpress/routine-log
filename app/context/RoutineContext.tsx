import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Routine } from "../types/routine";

interface RoutineContextType {
  routines: Routine[];
  addRoutine: (
    routine: Omit<Routine, "id" | "checkDates" | "isCompleted">
  ) => void;
  checkRoutine: (routineId: string, date: string) => void;
  uncheckRoutine: (routineId: string, date: string) => void;
  deleteRoutine: (routineId: string) => void;
  updateRoutine: (
    routineId: string,
    routineData: Omit<Routine, "id" | "checkDates" | "isCompleted">
  ) => void;
}

const RoutineContext = createContext<RoutineContextType | undefined>(undefined);

export function RoutineProvider({ children }: { children: React.ReactNode }) {
  const [routines, setRoutines] = useState<Routine[]>([]);

  useEffect(() => {
    loadRoutines();
  }, []);

  const loadRoutines = async () => {
    try {
      const storedRoutines = await AsyncStorage.getItem("routines");
      if (storedRoutines) {
        setRoutines(JSON.parse(storedRoutines));
      }
    } catch (error) {
      console.error("Error loading routines:", error);
    }
  };

  const saveRoutines = async (newRoutines: Routine[]) => {
    try {
      await AsyncStorage.setItem("routines", JSON.stringify(newRoutines));
    } catch (error) {
      console.error("Error saving routines:", error);
    }
  };

  const addRoutine = (
    routineData: Omit<Routine, "id" | "checkDates" | "isCompleted">
  ) => {
    const newRoutine: Routine = {
      id: Date.now().toString(),
      checkDates: [],
      isCompleted: false,
      ...routineData,
    };

    const newRoutines = [...routines, newRoutine];
    setRoutines(newRoutines);
    saveRoutines(newRoutines);
  };

  const checkRoutine = (routineId: string, date: string) => {
    const newRoutines = routines.map((routine) => {
      if (routine.id === routineId) {
        const newCheckDates = [...routine.checkDates, date];
        return {
          ...routine,
          checkDates: newCheckDates,
          isCompleted: newCheckDates.length >= 66,
        };
      }
      return routine;
    });

    setRoutines(newRoutines);
    saveRoutines(newRoutines);
  };

  const uncheckRoutine = (routineId: string, date: string) => {
    const newRoutines = routines.map((routine) => {
      if (routine.id === routineId) {
        const newCheckDates = routine.checkDates.filter((d) => d !== date);
        return {
          ...routine,
          checkDates: newCheckDates,
          isCompleted: newCheckDates.length >= 66,
        };
      }
      return routine;
    });

    setRoutines(newRoutines);
    saveRoutines(newRoutines);
  };

  const deleteRoutine = (routineId: string) => {
    const newRoutines = routines.filter((routine) => routine.id !== routineId);
    setRoutines(newRoutines);
    saveRoutines(newRoutines);
  };

  const updateRoutine = (
    routineId: string,
    routineData: Omit<Routine, "id" | "checkDates" | "isCompleted">
  ) => {
    const newRoutines = routines.map((routine) => {
      if (routine.id === routineId) {
        return {
          ...routine,
          ...routineData,
        };
      }
      return routine;
    });

    setRoutines(newRoutines);
    saveRoutines(newRoutines);
  };

  return (
    <RoutineContext.Provider
      value={{
        routines,
        addRoutine,
        checkRoutine,
        uncheckRoutine,
        deleteRoutine,
        updateRoutine,
      }}
    >
      {children}
    </RoutineContext.Provider>
  );
}

export function useRoutines() {
  const context = useContext(RoutineContext);
  if (!context) {
    throw new Error("useRoutines must be used within a RoutineProvider");
  }
  return context;
}
