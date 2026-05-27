import React from "react";
import { useGetReviewsQuery } from "../../../redux/apis/review.api";
import { Review } from "../../../models/review";

const WriterFeedbackComponent = () => {
  const { data: feedbackData = [], isLoading } =
    useGetReviewsQuery({});

  if (isLoading) {
    return (
      <div className="text-center text-slate-600 dark:text-gray-400 py-10">
        Loading reviews...
      </div>
    );
  }

  return (
    <section className="mb-16 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-gray-300">
            What Our Writers Say
          </h2>

          <p className="mt-4 text-slate-600 dark:text-gray-400 max-w-2xl mx-auto">
            Hear from our community of writers about their experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {feedbackData.map((writer: Review, index: number) => (
            <div
              key={index}
              className="bg-blue-500/10 p-6 rounded-xl transform transition-transform hover:scale-105"
            >
              <div className="flex items-center mb-4">
                <img
                  className="h-12 w-12 rounded-full ring-4 ring-white"
                  src={writer.imgSrc}
                  alt={writer.name}
                />

                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-slate-700 dark:text-gray-400">
                    {writer.name}
                  </h4>

                  <p className="text-sm text-slate-600 dark:text-gray-400">
                    {writer.role}
                  </p>
                </div>
              </div>

              <p className="text-slate-600 dark:text-gray-500 italic">
                &#34;{writer.feedback}&#34;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WriterFeedbackComponent;