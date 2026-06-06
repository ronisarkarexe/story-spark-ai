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
import Contactus from "../contactus/contactus";
import PersonalizedRecommendationsComponent from "./personalized_recommendations/personalized_recommendations.component";
import { isLoggedIn } from "../../services/auth.service";
import BackToTop from "../ScrollToTopButton";

const HomeComponent = () => {
  const isLogin = isLoggedIn();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 w-full box-border overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-12 items-start gap-6 py-8 sm:py-12 lg:gap-8 lg:py-16 w-full box-border">
        
        <main className="col-span-12 lg:col-span-8 min-w-0 w-full box-border space-y-8 sm:space-y-12">
          <FeatureComponent />
          <LatestPostsComponent />
        </main>

        <aside className="col-span-12 lg:col-span-4 min-w-0 w-full box-border">
          <div className="space-y-6 lg:sticky lg:top-24 w-full box-border">
            {isLogin && <FeatureProfileComponent />}
            {isLogin && <PersonalizedRecommendationsComponent />}
            <TrendingTopicComponent />
            <RecommendedWritersComponent />
          </div>
        </aside>

    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-10">
        <div className="grid grid-cols-12 items-start gap-8 mb-10">
          <motion.div variants={itemVariants} className="col-span-12 lg:col-span-8 min-w-0 flex flex-col gap-8">
            <FeatureComponent />
            <LatestPostsComponent />
          </motion.div>
          <motion.div variants={itemVariants} className="col-span-12 lg:col-span-4 min-w-0">
            <div className="sticky top-24 flex flex-col gap-6">
              {isLogin && <FeatureProfileComponent />}
              {isLogin && <PersonalizedRecommendationsComponent />}
              <TrendingTopicComponent />
              <RecommendedWritersComponent />
            </div>
          </motion.div>
        </div>
      </div>
      <motion.div variants={itemVariants}><CommunitySpotlightComponent /></motion.div> 
      <motion.div variants={itemVariants}><ResourceComponent /></motion.div>
      <motion.div variants={itemVariants}><WriterFeedbackComponent /></motion.div>
      <motion.div variants={itemVariants}><PricingComponent /></motion.div>
      <motion.div variants={itemVariants}><StartWritingComponent /></motion.div>
      <BackToTop />
    </div>
    </motion.div>
  );
};

export default HomeComponent;
