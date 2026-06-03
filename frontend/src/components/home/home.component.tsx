import { useEffect } from "react";
import { motion } from "framer-motion";
import CommunitySpotlightComponent from "./community_spotlight/community_spotlight.component";
import FeatureComponent from "./feature/feature.component";
import LatestPostsComponent from "./latest_posts/latest_posts.component";
import FeatureProfileComponent from "./feature_profile/feature_profile.component";
import TrendingTopicComponent from "./trending_topic/trending_topic.component";
import RecommendedWritersComponent from "./recommended_writers/recommended_writers.component";
import ResourceComponent from "./resources/resources.component";
import PricingComponent from "./pricing/pricing.component";
import WriterFeedbackComponent from "./writer_feedback/writer_feedback.component";
import StartWritingComponent from "./start_writing/start_writing.component";
import PersonalizedRecommendationsComponent from "./personalized_recommendations/personalized_recommendations.component";
import { isLoggedIn } from "../../services/auth.service";
import BackToTop from "../ScrollToTopButton";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const HomeComponent = () => {
  const isLogin = isLoggedIn();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <motion.div
      className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 w-full box-border overflow-x-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 w-full box-border">
        <div className="grid grid-cols-12 items-start gap-6 lg:gap-8 w-full box-border">
          <motion.main
            variants={itemVariants}
            className="col-span-12 lg:col-span-8 min-w-0 w-full box-border space-y-8 sm:space-y-12"
          >
            <FeatureComponent />
            <LatestPostsComponent />
          </motion.main>

          <motion.aside
            variants={itemVariants}
            className="col-span-12 lg:col-span-4 min-w-0 w-full box-border"
          >
            <div className="space-y-6 lg:sticky lg:top-24 w-full box-border">
              {isLogin && <FeatureProfileComponent />}
              {isLogin && <PersonalizedRecommendationsComponent />}
              <TrendingTopicComponent />
              <RecommendedWritersComponent />
            </div>
          </motion.aside>
        </div>
      </div>

      <motion.div variants={itemVariants}>
        <CommunitySpotlightComponent />
      </motion.div>
      <motion.div variants={itemVariants}>
        <ResourceComponent />
      </motion.div>
      <motion.div variants={itemVariants}>
        <WriterFeedbackComponent />
      </motion.div>
      <motion.div variants={itemVariants}>
        <PricingComponent />
      </motion.div>
      <motion.div variants={itemVariants}>
        <StartWritingComponent />
      </motion.div>
      
      <BackToTop />
    </motion.div>
  );
};

export default HomeComponent;
