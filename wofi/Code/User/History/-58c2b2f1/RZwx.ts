// Hook customizado para gerenciar estado
const useAppState = (initialState: AppState) => {
  const [state, setState] = useState<AppState>(initialState);

  const updateState = (updates: Partial<AppState>) => {
    setState(prevState => ({ ...prevState, ...updates }));
  };

  return { state, updateState };
};