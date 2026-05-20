import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import Content from "@/app/blogs/Content/dsaDifferent/content";

export const metadata = {
  title: "Are Data Structures and Algorithms Different for Different Languages?",
  description:
    "Uncover the truth behind language-specific implementations of DSA. Learn how data structures and algorithms vary in syntax, performance, and usage across programming languages.",
  keywords: [
    "Data Structures",
    "Algorithms",
    "Programming Languages",
    "JavaScript",
    "Python",
    "C++",
    "Java",
    "Language Comparison DSA",
    "Coding Interview",
    "Performance Optimization",
    "Backend vs Frontend DSA"
  ],
  authors: [{ name: "Sohan Rout", url: "https://www.linkedin.com/in/sohan-rout" }],
  openGraph: {
    title: "Are Data Structures and Algorithms Different for Different Languages?",
    description:
      "Explore how DSA implementations differ across languages like Python, JavaScript, Java, and C++. From syntax to performance, understand what's universal and what's not.",
    url: "./blogs/Content/dsaDifferent",
    siteName: "DSA Visualizer",
    locale: "en_IN",
    type: "article",
    images: [
      {
        url: "./blog/dsaDifferent.png",
        width: 1200,
        height: 630,
        alt: "How DSA changes across languages",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Are Data Structures and Algorithms Different for Different Languages?",
    description:
      "Do arrays, stacks, or recursion work the same in Python and C++? Learn how the core DSA concepts stay the same—but their implementation varies.",
    images: ["./blog/dsaDifferent.png"],
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