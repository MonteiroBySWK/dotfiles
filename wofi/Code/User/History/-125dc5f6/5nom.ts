// Export specific entity hooks (advanced with services)
export * from './useProjects'
export * from './useTasks' 
export * from './useClients'
export * from './useNotifications'
export * from './useTickets'
export * from './useUsers'

// Export Firebase repository hooks with prefixes to avoid conflicts
export { 
  useRepository,
  useRealtimeData,
  useRealtimeDocument,
  // Repository hooks with different names to avoid conflicts
  useUsers as useFirebaseUsers,
  useProjects as useFirebaseProjects,
  useTasks as useFirebaseTasks,
  useClients as useFirebaseClients,
  useNotifications as useFirebaseNotifications,
  useTickets as useFirebaseTickets,
  // Real-time hooks
  useRealtimeUsers,
  useRealtimeProjects,
  useRealtimeTasks,
  useRealtimeNotifications,
  // Document hooks with different names
  useUser as useFirebaseUser,
  useProject as useFirebaseProject,
  useTask as useFirebaseTask
} from './useFirebase'

// UI hooks
export * from './use-mobile'
export * from './use-modal'