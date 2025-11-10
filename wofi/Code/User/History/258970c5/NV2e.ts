import { useMemo } from "react";
import { MOBILE_BREAKPOINT } from "../constants";

export function useMobile() {
  return useMemo(
    () => typeof window !== "undefined" && window.innerWidth < MOBILE_BREAKPOINT,
    []
  );
}
