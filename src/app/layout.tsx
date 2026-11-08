import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const metadata: Metadata = {
  metadataBase: new URL("https://clinichub.agency"),
  title: "Clinic Hub Agency — الوكالة الرائدة في تصميمات وإعلانات العيادات والمراكز الطبية",
  description:
    "تصميم روشتات فاخرة، هويات بصرية، إعلانات وبوستات مخصصة للأطباء والمراكز الطبية، وإدارة حملات إعلانية ممولة لجلب الحجوزات الطبية على واتساب.",
  keywords: [
    "تصميم روشتات",
    "إعلانات عيادات",
    "تسويق طبي",
    "تصميم عيادة",
    "Clinic Hub",
    "روشتة طبية",
    "سوشيال ميديا عيادات",
  ],
  authors: [{ name: "Clinic Hub Agency" }],
  creator: "Clinic Hub Agency",
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: "https://clinichub.agency",
    siteName: "Clinic Hub Agency",
    title: "Clinic Hub Agency — تسويق طبي وتصميمات فاخرة للعيادات",
    description:
      "تصميم روشتات، هويات بصرية، وبوستات ممولة للعيادات والمراكز الطبية لزيادة الحجوزات الطبية مباشرة.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@500;600;700;800;900&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-ink font-body text-paper antialiased selection:bg-gold selection:text-black">
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  );
}
