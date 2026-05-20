import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import Content from "@/app/blogs/Content/dsaWebDev/content";

export const metadata = {
  title: "Is Data Structures and Algorithms Important for Web Developers?",
  description:
    "Discover how DSA can elevate your web development skills. Learn when and why understanding data structures and algorithms matters for frontend and backend web devs.",
  keywords: [
    "Data Structures",
    "Algorithms",
    "Web Development",
    "Frontend",
    "Backend",
    "DSA for Web Developers",
    "React",
    "JavaScript",
    "Performance Optimization",
    "Coding Interview Preparation",
  ],
  authors: [{ name: "Sohan Rout", url: "https://www.linkedin.com/in/sohan-rout" }],
  openGraph: {
    title: "Is Data Structures and Algorithms Important for Web Developers?",
    description:
      "Explore how learning DSA can boost your efficiency, optimize performance, and prepare you for tech interviews—even as a web developer.",
    url: "./blog/dsaWebDev.png",
    siteName: "DSA Visualizer",
    locale: "en_IN",
    type: "article",
    images: [
      {
        url: "./blog/dsaWebDev.png", // Replace with actual OG image
        width: 1200,
        height: 630,
        alt: "DSA for Web Developers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Is DSA Important for Web Developers?",
    description:
      "Think DSA is only for competitive programming? Think again. Here's how it benefits modern web developers.",
    images: ["./blog/dsaWebDev.png"],
  },
  category: "Technology",
  publishedTime: "2024-05-15T08:00:00Z",
  robots: "index, follow",
};

const page = () => {
  return(
    <main className="bg-white dark:bg-surface-950">
      <Navbar/>
      <Content/>
      <Footer/>
    </main>
  );
}

export default page;