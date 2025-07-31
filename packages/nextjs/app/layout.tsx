import { ReactNode } from "react";
import "../styles/globals.css";

export const metadata = {
  title: "DevMatch3",
  description: "3D Character Platform with Chat",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/fonts/Press_Start_2P/PressStart2P-Regular.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  );
}
