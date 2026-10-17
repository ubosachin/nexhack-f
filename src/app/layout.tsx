import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "NEXHACK | The Next Generation of Student Tech Community",
    template: "%s | NEXHACK",
  },
  description:
    "Build. Hack. Learn. Connect. NEXHACK brings students, developers, creators, and innovators together through national hackathons, technical workshops, knowledge sessions, and community experiences.",
  keywords: [
    "NEXHACK",
    "hackathons",
    "student hackathon",
    "college hackathon",
    "school hackathon",
    "coding competitions",
    "student tech community",
    "technology workshops",
    "student innovation",
    "developer community",
    "coding sprints",
    "AI hackathons",
    "web development competitions",
  ],
  authors: [{ name: "NEXHACK Community", url: "https://nexhack.in" }],
  creator: "NEXHACK",
  publisher: "NEXHACK",
  metadataBase: new URL("https://nexhack.in"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "NEXHACK | Build the Future. Hack What's Next.",
    description:
      "A student-driven technology community organizing hackathons, technical workshops, knowledge sessions, and innovation challenges across schools and colleges.",
    url: "https://nexhack.in",
    siteName: "NEXHACK",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://nexhack.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "NEXHACK Student Tech Community & Hackathons",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NEXHACK | Student Tech Community & Hackathons",
    description: "Build. Hack. Learn. Connect. Join the premier student technology ecosystem.",
    creator: "@nexhack_in",
    images: ["https://nexhack.in/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Schema.org structured data for organization
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "NEXHACK",
    url: "https://nexhack.in",
    logo: "https://nexhack.in/logo-icon.png",
    description:
      "Student-driven technology community organizing national hackathons, technical workshops, knowledge sessions, and innovation experiences.",
    foundingDate: "2024",
    email: "hello@nexhack.in",
    sameAs: [
      "https://x.com/nexhack_in",
      "https://www.linkedin.com/company/nexhack-in",
      "https://www.instagram.com/nexhack.in/",
      "https://github.com/nexhack-tech",
    ],
    knowsAbout: [
      "Hackathons",
      "Student Innovation",
      "Artificial Intelligence",
      "Web Development",
      "Software Engineering",
      "Open Source",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "NEXHACK",
    url: "https://nexhack.in",
    description: "The Next Generation Student Tech Community & National Hackathons",
    publisher: {
      "@type": "Organization",
      name: "NEXHACK",
    },
  };

  return (
    <html lang="en" className={`${jakarta.variable} ${jetbrainsMono.variable} scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="min-h-screen bg-white text-[#0A0F1D] font-sans antialiased selection:bg-blue-600 selection:text-white">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
