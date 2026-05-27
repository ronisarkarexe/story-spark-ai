import BlogPage from "@/app/blogs/blogPage";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import BackToTop from "../components/ui/backtotop";

export const metadata = {
  title: 'DSA Blogs & Guides | Learn Data Structures and Algorithms Effectively',
  description:
    'Explore beginner-friendly blogs on Data Structures and Algorithms (DSA) covering Python, Java, C++, Web Development, Machine Learning, and more. Learn, practice, and master DSA through curated insights.',
  keywords: [
    'are data structures and algorithms different for different languages',
    'are data structures and algorithms important',
    'are data structures and algorithms hard',
    'are data structures and algorithms important for data science',
    'are data structures and algorithms important for machine learning',
    'is data structures and algorithms important for web developers',
    'is data structures and algorithms same for all languages',
    'what are data structures and algorithms in python',
    'what are data structures and algorithms used for',
    'what are data structures and algorithms in java',
    'what are data structures and algorithms in c++',
    'is leetcode data structures and algorithms worth it',
    'is learning data structures and algorithms worth it',
    'where can i learn data structures and algorithms for free',
    'how can i learn data structures and algorithms',
    'do i need to learn data structures and algorithms for web development',
    'do i need to learn data structures and algorithms for machine learning',
    'difference between data structures and algorithms',
    'when to learn data structures and algorithms',
    'is it hard to learn data structures and algorithms',
    'can i learn data structures and algorithms in python',
    'can i learn data structures and algorithms in java',
    'DSA blog for beginners',
    'learn DSA with examples',
    'best blogs on algorithms and data structures'
  ],
  robots: "index, follow",
};

const page = () => {
  return (
    <>
      <Navbar/>
      <BlogPage/>
      <BackToTop/>
      <Footer/>
    </>
  );
};

export default page;