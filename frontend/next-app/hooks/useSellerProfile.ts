"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchSellerProfile } from "@/services/seller-profile";
import type { SellerPublicProfile } from "@/types/seller";

type State =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; profile: SellerPublicProfile | null };

export function useSellerProfile(userId: string | undefined) {
  const [state, setState] = useState<State>({ status: "loading" });

  const load = useCallback(async () => {
    setState({ status: "loading" });
    try {
      setState({ status: "ready", profile: await fetchSellerProfile() });
    } catch {
      setState({ status: "error" });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load, userId]);

  return { state, reload: load };
}