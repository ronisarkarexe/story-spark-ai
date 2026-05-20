import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import Content from "@/app/blogs/Content/timeRequired/content";

export const metadata = {
    title: "Time Required to Learn and Master DSA",
    description:
        "Uncover how much time it takes to learn and master Data Structures and Algorithms (DSA) for web development. Get practical timelines, tips, and strategies for efficient DSA learning.",
    keywords: [
        "Time to Learn DSA",
        "DSA Mastery Timeline",
        "Data Structures",
        "Algorithms",
        "Learning Path",
        "Web Development",
        "Frontend",
        "Backend",
        "DSA Study Plan",
        "Coding Interview Preparation",
    ],
    authors: [{ name: "Sohan Rout", url: "https://www.linkedin.com/in/sohan-rout" }],
    openGraph: {
        title: "Time Required to Learn and Master DSA",
        description:
            "Find out how long it takes to learn and master DSA for web development. Explore realistic timelines, learning strategies, and tips for success.",
        url: "./blog/timeRequired.png",
        siteName: "DSA Visualizer",
        locale: "en_IN",
        type: "article",
        images: [
            {
                url: "./blog/timeRequired.png", // Replace with actual OG image
                width: 1200,
                height: 630,
                alt: "Time Required to Learn DSA",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Time Required to Learn and Master DSA",
        description:
            "How much time does it take to learn DSA? Get timelines, strategies, and tips for mastering Data Structures and Algorithms.",
        images: ["./blog/timeRequired.png"],
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