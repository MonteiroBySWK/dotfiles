import { TeamMember } from "@/types";
import { useResource } from "./useResource";

export function useMembers() {
  const { data, loading, error } = useResource<TeamMember[]>("/members", {
    autofetch: true,
  });
}

export function useMember(id: string) {
  const {} = useResource<TeamMember>(`/members/${id}`, { autofetch: true });
}
