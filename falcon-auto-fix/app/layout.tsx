import type { Metadata } from "next";
import "./globals.css";
import { SiteChrome } from "@/components/SiteChrome";
export const metadata: Metadata = { title: "Falcon Auto Fix | Auto Repair London, Ontario", description: "Auto repairs, diagnostics, maintenance, tires, brakes and oil changes in London, Ontario." };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><SiteChrome>{children}</SiteChrome></body></html>}
