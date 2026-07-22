import type { Metadata } from "next";
import "./globals.css";
import { SiteChrome } from "@/components/SiteChrome";
export const metadata: Metadata = { title: "Falcon Auto Fix | Quality Service. Keeping You on the Road.", description: "Falcon Auto Fix in London, Ontario — repairs, diagnostics, maintenance, tires, brakes, oil changes and more.", icons:{icon:"/falcon-logo.jpg"} };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><SiteChrome>{children}</SiteChrome></body></html>}
