import MenuList from "../../components/Menu";
import "../../styles/globals.scss";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        {children}
        <MenuList/>
      </body>
    </html>
  );
}
