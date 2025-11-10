import { useAuth } from "@/provider/AuthProvider"
import { useRouter } from "next/navigation";

export default function ProtectedClient({children}:{children: React.ReactNode}) {
  const {user, loading, error} = useAuth();
  const router = useRouter();

  return (<>{children}</>)
}