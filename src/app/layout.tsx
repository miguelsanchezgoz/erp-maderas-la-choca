import type { Metadata } from "next";
import "./globals.css";
import { RoleProvider } from "@/components/navigation/RoleContext";
import { AppShell } from "@/components/navigation/AppShell";

export const metadata: Metadata = {
  title: "Maderas La Choca ERP/CRM | Villahermosa, Tabasco",
  description:
    "Sistema modular de gestión comercial, aserradero, cubicaje de maderas tropicales y taller de servicios industriales con certificación NOM-144-SEMARNAT.",
  icons: {
    icon: "/logo-la-choca.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased selection:bg-amber-500 selection:text-white">
        <RoleProvider>
          <AppShell>{children}</AppShell>
        </RoleProvider>
      </body>
    </html>
  );
}
