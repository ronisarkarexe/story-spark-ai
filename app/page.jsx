import Navbar from "@/app/components/navbar";
import Hero from "@/app/components/hero";
import ConceptsSection from "@/app/components/ConceptsSection";
import PersonalizedSection from "@/app/components/PersonalizedSection";
import Footer from "@/app/components/footer";
import BottomAd from "./components/ads/bottom";

export const metadata = {
  title: "AlgoBuddy | Visualize & Learn DSA the Smart Way",
  description:
    "Master Data Structures and Algorithms with interactive visualizations. Perfect for students, beginners, and interview prep. Visualize Stack, Queue, Tree, Graph, Sorting & more.",
  keywords: [
    "DSA Visualizer",
    "Algorithm Visualizer",
    "Learn DSA",
    "Practice DSA Problems",
    "DSA Quizzes",
    "Interactive DSA",
    "Sorting Algorithms",
    "Searching Algorithms",
    "Stack",
    "Queue",
    "Tree",
    "Linked List",
    "Heap Sort",
    "Tree Traversal",
    "Linear Search",
    "Bubble Sort",
    "Singly Linked List",
    "Doubly Linked List",
    "Circular Linked List",
    "Data Structures for Beginners",
    "DSA Practice Platform",
    "Quiz for DSA",
    "Algorithm Quiz",
    "Interactive Algorithm Quiz",
    "Learn DSA with Quizzes",
  ],
  robots: "index, follow",
};

export default function Home() {
  return (
    <>
      <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
        <Navbar />
        <div id="hero">
          <Hero />
        </div>
        <PersonalizedSection />
        <ConceptsSection />
        <Footer />
      </div>
    </>
  );
}
