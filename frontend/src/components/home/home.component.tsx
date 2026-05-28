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
import { isLoggedIn } from "../../services/auth.service";

const HomeComponent = () => {
  const isLogin = isLoggedIn();
  return (
    <>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-10">
        <div className="grid grid-cols-12 items-start gap-8 mb-10">
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
      </div>
      <CommunitySpotlightComponent /> 
      <ResourceComponent />
      <WriterFeedbackComponent />
      <PricingComponent />
      <StartWritingComponent />
    </>
  );
};

export default HomeComponent;
