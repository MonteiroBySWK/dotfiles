import { TeamMember } from "@/types";
import { useResource } from "./useResource";

export function useMembers() {
  const {data, loading, error} = useResource<TeamMember[]>("/members", {
    autofetch: true,
  });
}
