"use client";

import MenuList from "../../components/Menu";
import "../../styles/globals.scss";
import { AuthContextProvider } from "@/context/AuthContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <AuthContextProvider>
          {children}
          <MenuList/>
        </AuthContextProvider>
      </body>
    </html>
  );
}
