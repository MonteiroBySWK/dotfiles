import { AppState } from "@/types/interfaces";
import { useState } from "react";

// Hook customizado para gerenciar estado
export const useAppState = (initialState: AppState) => {
  const [state, setState] = useState<AppState>(initialState);

  const updateState = (updates: Partial<AppState>) => {
    setState(prevState => ({ ...prevState, ...updates }));
  };

  return { state, updateState };
};