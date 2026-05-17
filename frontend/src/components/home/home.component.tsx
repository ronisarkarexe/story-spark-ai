import FeatureComponent from "./feature/feature.component";
import LatestPostsComponent from "./latest_posts/latest_posts.component";
import FeatureProfileComponent from "./feature_profile/feature_profile.component";
import TrendingTopicComponent from "./trending_topic/trending_topic.component";
import RecommendedWritersComponent from "./recommended_writers/recommended_writers.component";
import ResourceComponent from "./resources/resources.component";
import PricingComponent from "./pricing/pricing.component";
import WriterFeedbackComponent from "./writer_feedback/writer_feedback.component";
import StartWritingComponent from "./start_writing/start_writing.component";
import { isLoggedIn } from "../../services/auth.service";

const HomeComponent = () => {
  const isLogin = isLoggedIn();
  return (
    <div className="relative bg-slate-950 pb-16">
      <div className="grid grid-cols-12 items-start gap-8 px-4 sm:px-6 mb-10 pt-4">
        <div className="col-span-12 lg:col-span-8 min-w-0">
          <FeatureComponent />
          <LatestPostsComponent />
        </div>
        <div className="col-span-12 lg:col-span-4 min-w-0">
          <div className="sticky top-24 space-y-6">
            {isLogin && <FeatureProfileComponent />}
            <TrendingTopicComponent />
            <RecommendedWritersComponent />
          </div>
        </div>
      </div>
      <ResourceComponent />
      <WriterFeedbackComponent />
      <PricingComponent />
      <StartWritingComponent />
    </div>
  );
};

export default HomeComponent;
