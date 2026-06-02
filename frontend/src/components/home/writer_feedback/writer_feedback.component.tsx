import React from "react";
import { Quote } from "lucide-react";
import { useGetReviewsQuery } from "../../../redux/apis/review.api";
import type { Review } from "../../../models/review";
import defaultAvatar from "../../../assets/logoNew.png";
import ImageFallback from "../../ImageFallback";
import ReviewForm from "./ReviewForm";

const WriterFeedbackComponent = () => {
  const { data: feedbackData = [], isLoading } = useGetReviewsQuery({});

  if (isLoading) {
    return (
      <div className="py-10 text-center text-slate-600 dark:text-gray-400">
        Loading reviews...
      </div>
    );
  }

  const featuredReview = feedbackData.length > 0 ? feedbackData[0] : null;

  return (
    <section className="relative overflow-hidden py-20">
      {/* Background Glow Effects */}
      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <span className="inline-flex items-center rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-sm font-medium text-yellow-500">
            ⭐ 4.9/5 Average Rating
          </span>

          <h2 className="mt-6 text-4xl font-bold text-slate-900 dark:text-white">
            What Our Writers Say
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-600 dark:text-gray-400">
            Hear from our growing community of writers and creators who use our
            platform every day.
          </p>
        </div>

        {/* Social Proof Stats */}
        <div className="mb-16 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/50 p-6 text-center backdrop-blur dark:bg-slate-900/50">
            <h3 className="text-3xl font-bold text-blue-500">10K+</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-gray-400">
              Total Writers
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/50 p-6 text-center backdrop-blur dark:bg-slate-900/50">
            <h3 className="text-3xl font-bold text-cyan-500">250K+</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-gray-400">
              Stories Generated
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/50 p-6 text-center backdrop-blur dark:bg-slate-900/50">
            <h3 className="text-3xl font-bold text-purple-500">
              {feedbackData.length}+
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-gray-400">
              Reviews Submitted
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/50 p-6 text-center backdrop-blur dark:bg-slate-900/50">
            <h3 className="text-3xl font-bold text-yellow-500">4.9★</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-gray-400">
              Average Rating
            </p>
          </div>
        </div>

        {/* Featured Testimonial */}
        {featuredReview && (
          <div className="relative mb-16 overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-r from-blue-500/10 via-cyan-500/5 to-purple-500/10 p-8 md:p-10">
            <div className="absolute right-6 top-6 opacity-20">
              <Quote size={80} />
            </div>

            <div className="relative z-10">
              <span className="mb-4 inline-block rounded-full bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-500">
                Featured Testimonial
              </span>

              <p className="mb-8 max-w-4xl text-lg italic leading-relaxed text-slate-700 dark:text-gray-300 md:text-xl">
                "{featuredReview.feedback}"
              </p>

              <div className="flex items-center gap-4">
                <ImageFallback
                  src={
                    featuredReview.imgSrc?.trim()
                      ? featuredReview.imgSrc
                      : defaultAvatar
                  }
                  alt={featuredReview.name}
                  className="h-16 w-16 rounded-full object-cover ring-2 ring-blue-300/30"
                />

                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {featuredReview.name}
                  </h3>

                  <p className="text-slate-600 dark:text-gray-400">
                    {featuredReview.role}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {feedbackData.map((writer: Review, index: number) => {
            const avatarSrc = writer.imgSrc?.trim()
              ? writer.imgSrc
              : defaultAvatar;

            return (
              <div
                key={writer._id ?? writer.name ?? index}
                className="group rounded-2xl border border-white/10 bg-white/60 p-7 backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10 dark:bg-slate-900/60"
              >
                <Quote size={36} className="mb-4 text-blue-400 opacity-60" />

                <p className="mb-6 leading-relaxed text-slate-600 dark:text-gray-400">
                  "{writer.feedback}"
                </p>

                <div className="flex items-center">
                  <ImageFallback
                    className="h-14 w-14 rounded-full object-cover ring-2 ring-blue-300/25"
                    src={avatarSrc}
                    alt={writer.name}
                  />

                  <div className="ml-4">
                    <h4 className="font-semibold text-slate-800 dark:text-white">
                      {writer.name}
                    </h4>

                    <p className="text-sm text-slate-500 dark:text-gray-400">
                      {writer.role}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Review Form Section */}
        <div className="mt-20">
          <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/60 p-8 shadow-xl backdrop-blur dark:bg-slate-900/60 md:p-10">
            <div className="mb-8 text-center">
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                Share Your Experience
              </h3>

              <p className="mt-3 text-slate-600 dark:text-gray-400">
                We'd love to hear your feedback and help inspire future writers.
              </p>
            </div>

            <ReviewForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WriterFeedbackComponent;
