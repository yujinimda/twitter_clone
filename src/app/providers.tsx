// src/app/providers.tsx
"use client";

import { ReactNode } from "react";
import { RecoilRoot } from "recoil";
import { AuthContextProvider } from "@/context/AuthContext";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <RecoilRoot>
      <AuthContextProvider>
        {children}
      </AuthContextProvider>
    </RecoilRoot>
  );
}
