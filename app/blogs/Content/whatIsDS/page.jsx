import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import Content from "@/app/blogs/Content/whatIsDS/content";

export const metadata = {
  title: "What Are Data Structures? A Beginner-Friendly Guide",
  description:
    "Confused by arrays, stacks, or linked lists? This beginner-friendly guide breaks down what data structures are, their types, and why they matter for every aspiring programmer.",
  keywords: [
    "Data Structures",
    "Beginner Programming",
    "DSA",
    "Arrays",
    "Stacks",
    "Linked Lists",
    "Programming Basics",
    "Computer Science",
    "Coding for Beginners",
    "Programming Concepts"
  ],
  authors: [{ name: "Sohan Rout", url: "https://www.linkedin.com/in/sohan-rout" }],
  openGraph: {
    title: "What Are Data Structures? A Beginner-Friendly Guide",
    description:
      "Understand the fundamentals of data structures in simple terms. A must-read guide for anyone new to programming and computer science.",
    url: "./blog/whatIsDS.png",
    siteName: "DSA Visualizer",
    locale: "en_IN",
    type: "article",
    images: [
      {
        url: "./blog/whatIsDS.png", // Replace with actual OG image
        width: 1200,
        height: 630,
        alt: "Beginner’s Guide to Data Structures",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "What Are Data Structures? A Beginner-Friendly Guide",
    description:
      "Kickstart your programming journey by learning what data structures are and how they work. Explained in a simple, visual way.",
    images: ["./blog/whatIsDS.png"],
  },
  category: "Data Structures & Algorithms",
  publishedTime: "2025-05-23T08:00:00Z",
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