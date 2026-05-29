import { useGetReviewsQuery } from "../../../redux/apis/review.api";
import { Review } from "../../../models/review";
import ReviewForm from "./ReviewForm";

const WriterFeedbackComponent = () => {
  const { data: feedbackData = [], isLoading } = useGetReviewsQuery({});
  if (isLoading) return <div className="py-10 text-center text-slate-400">Loading reviews...</div>;

  return (
    <section className="story-section">
      <div className="story-page-shell">
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
          <h2 className="story-section-heading">What Our Writers Say</h2>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {feedbackData.map((writer: Review) => (
            <div key={writer._id ?? writer.name} className="motion-card-subtle story-panel rounded-lg p-6">
              <div className="mb-4 flex items-center">
                <img className="h-12 w-12 rounded-full object-cover" src={writer.imgSrc} alt={writer.name} />
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-slate-200">{writer.name}</h4>
                  <p className="text-sm text-slate-500">{writer.role}</p>
                </div>
              </div>
              <p className="text-slate-400 italic">"{writer.feedback}"</p>
            </div>
          ))}
        </div>
        <ReviewForm />
      </div>
    </section>
  );
};

export default WriterFeedbackComponent;
