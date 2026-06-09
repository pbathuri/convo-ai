"use client";

import { useEffect } from "react";
import { preloadDidSdk } from "@/lib/did/preload-sdk";

/** Mount once in layout to prefetch D-ID SDK before user opens chat. */
export function DidSdkPreloader() {
  useEffect(() => {
    void preloadDidSdk();
  }, []);
  return null;
}
