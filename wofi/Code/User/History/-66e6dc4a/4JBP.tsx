import { useAuth } from "@/provider/AuthProvider"

export default function ProtectedClient({children}:{children: React.ReactNode}) {
  const {user, loading, error} = useAuth();
  return (<>{children}</>)
}