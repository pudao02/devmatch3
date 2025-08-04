"use client";

import { ReactNode, useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";

interface ClientThemeProviderProps {
  children: ReactNode;
}

export function ClientThemeProvider({ children }: ClientThemeProviderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render theme provider until client-side hydration is complete
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeProvider attribute="data-theme" defaultTheme="dark">
      {children}
    </ThemeProvider>
  );
}
