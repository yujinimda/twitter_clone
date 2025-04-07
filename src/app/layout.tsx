"use client";

import MenuList from "../../components/Menu";
import "../../styles/globals.scss";
import { AuthContextProvider } from "@/context/AuthContext";
import Providers from './providers';



export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
      <RecoilRoot>
        <AuthContextProvider>
          {children}
          <MenuList/>
        </AuthContextProvider>
      </RecoilRoot>
      </body>
    </html>
  );
}
