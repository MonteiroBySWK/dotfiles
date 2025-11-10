import { TeamMember } from "@/types";
import { useResource } from "./createResourceHook";

export function useMembers() {
  const { data, loading, error, functions } = useResource<TeamMember[]>(
    "/members",
    {
      autofetch: true,
    }
  );

  return {
    member: data,
    loading,
    error,
    functions: {
      ...functions,
    },
  };
}

export function useMember(id: string) {
  const { data, loading, error, functions } = useResource<TeamMember>(
    `/members/${id}`,
    {
      autofetch: true,
    }
  );

  return {
    member: data,
    loading,
    error,
    functions: {
      ...functions,
    },
  };
}
