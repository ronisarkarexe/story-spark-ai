import "./globals.css";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { UserProvider } from "@/app/contexts/UserContext";
import ClientLayoutWrapper from "@/app/components/ui/ClientLayoutWrapper";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const metadata = {
  metadataBase: new URL("https://algobuddy.in"),
  title: "AlgoBuddy | Visualize & Learn DSA the Smart Way",
  description:
    "Master Data Structures and Algorithms with interactive visualizations. Perfect for students, beginners, and interview prep. Visualize Stack, Queue, Tree, Graph, Sorting & more.",
  keywords: [
    "AlgoBuddy",
    "DSA Visualizer",
    "Data Structures and Algorithms",
    "Visual DSA Tool",
    "Learn DSA Online",
    "DSA for Beginners",
    "DSA Practice",
    "Stack Visualizer",
    "Queue Visualizer",
    "Graph Visualizer",
    "Sorting Algorithms",
  ],
  authors: [{ name: "Sohan Rout" }],
  creator: "Sohan Rout",
  publisher: "AlgoBuddy",
  robots: "index, follow",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "AlgoBuddy | Visualize & Learn DSA the Smart Way",
    description:
      "Interactive platform to visualize and learn DSA concepts easily. Great for students and interview preparation.",
    url: "https://algobuddy.in/",
    siteName: "AlgoBuddy",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "AlgoBuddy Preview Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AlgoBuddy | Learn DSA the Smart Way",
    description:
      "Visualize algorithms like Stack, Queue, Graphs, and Sorting in real-time. Learn DSA interactively.",
    images: ["/og.png"],
  },
};

export default async function RootLayout({ children }) {
  // auth is handled client-side via UserContext (Supabase)

  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <meta name="application-name" content="AlgoBuddy" />
        <meta property="og:site_name" content="AlgoBuddy" />
        <link rel="icon" href="/favicon.ico?v=2" />

        {/* Prevent flash: apply saved theme before React hydrates */}
        <Script
          id="theme-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'light';
                  if (theme === 'dark') document.documentElement.classList.add('dark');
                  else document.documentElement.classList.remove('dark');
                } catch(e) {}
              })();
            `,
          }}
        />

        {/* Google Analytics Script */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </head>
      <body className="bg-white text-[var(--udemy-text)] dark:bg-[var(--udemy-dark-bg)] dark:text-[var(--udemy-dark-text)]">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-[var(--color-primary)] focus:text-white focus:rounded-[var(--radius-md)]"
        >
          Skip to content
        </a>
        <UserProvider>
          <ClientLayoutWrapper>
            <div id="main-content">{children}</div>
          </ClientLayoutWrapper>
        </UserProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
