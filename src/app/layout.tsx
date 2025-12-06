import type { Metadata, Viewport } from "next";
import { Inter, Orbitron, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Font configuration per project-rules.md
const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const orbitron = Orbitron({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

// SEO Metadata
export const metadata: Metadata = {
  metadataBase: new URL("https://huynh-nam-portfolio.vercel.app"),
  title: {
    default: "Huỳnh Hoài Nam | AI & Full-stack Engineer Portfolio",
    template: "%s | Huỳnh Hoài Nam Portfolio",
  },
  description: "Interactive 3D portfolio of Huỳnh Hoài Nam - CS Student at Ton Duc Thang University specializing in AI/ML, Full-stack Development, and Computer Vision. Explore my projects in an immersive digital garden experience.",
  keywords: [
    "Huỳnh Hoài Nam",
    "Portfolio",
    "Full-stack Developer",
    "AI Engineer",
    "Machine Learning",
    "Computer Vision",
    "React",
    "Next.js",
    "Three.js",
    "Python",
    "Vietnam Developer",
    "Ho Chi Minh City",
    "Ton Duc Thang University",
  ],
  authors: [{ name: "Huỳnh Hoài Nam", url: "https://github.com/NamJore04" }],
  creator: "Huỳnh Hoài Nam",
  publisher: "Huỳnh Hoài Nam",
  
  // Open Graph for social sharing
  openGraph: {
    type: "website",
    locale: "vi_VN",
    alternateLocale: "en_US",
    url: "https://huynh-nam-portfolio.vercel.app",
    siteName: "The Digital Nexus Garden",
    title: "Huỳnh Hoài Nam | AI & Full-stack Engineer",
    description: "Explore my interactive 3D portfolio featuring AI/ML projects, Full-stack applications, and Computer Vision solutions.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "The Digital Nexus Garden - Portfolio of Huỳnh Hoài Nam",
      },
    ],
  },
  
  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Huỳnh Hoài Nam | AI & Full-stack Engineer",
    description: "Interactive 3D portfolio showcasing AI/ML, Full-stack, and Computer Vision projects",
    images: ["/og-image.png"],
    creator: "@namjore",
  },
  
  // Robots and indexing
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
  
  // Icons
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
  },
  
  // Manifest for PWA
  manifest: "/manifest.json",
  
  // Verification (add your actual verification codes)
  verification: {
    google: "your-google-verification-code",
  },
  
  // Category
  category: "technology",
};

// Viewport configuration
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
    { media: "(prefers-color-scheme: light)", color: "#0f172a" },
  ],
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        {/* Structured Data - Person/Portfolio */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Huỳnh Hoài Nam",
              alternateName: "Nam Jore",
              url: "https://huynh-nam-portfolio.vercel.app",
              image: "/avatar.png",
              jobTitle: "AI & Full-stack Engineer",
              worksFor: {
                "@type": "EducationalOrganization",
                name: "Ton Duc Thang University",
              },
              alumniOf: {
                "@type": "EducationalOrganization",
                name: "Ton Duc Thang University",
              },
              sameAs: [
                "https://github.com/NamJore04",
                "https://linkedin.com/in/jore-nam-943a02236",
              ],
              knowsAbout: [
                "Artificial Intelligence",
                "Machine Learning",
                "Full-stack Development",
                "Computer Vision",
                "React",
                "Python",
                "Next.js",
              ],
            }),
          }}
        />
        
        {/* Preconnect to external resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS prefetch for performance */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </head>
      <body
        className={`${inter.variable} ${orbitron.variable} ${jetbrainsMono.variable} antialiased bg-[#0f172a] text-white`}
      >
        {children}
      </body>
    </html>
  );
}
