import { User } from "firebase/auth"

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
}