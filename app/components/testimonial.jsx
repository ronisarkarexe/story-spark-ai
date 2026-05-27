"use client";
import React, { useState, useEffect, useRef } from "react";
import { IoChatboxEllipses } from "react-icons/io5";
import {
  FaStar,
  FaRegStar,
  FaStarHalfAlt,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { gsap } from "gsap";
import { motion } from "framer-motion";

const TestimonialSection = () => {
  const testimonials = [
    {
      name: "Raman Jaiswal",
      email: "@ramanj001",
      review: `This is something which doesn't need words to explain dayummmmm it is good for beginners like us. This is something which actually needs to be appreciated. The visualizations are incredibly clear and the interactive elements make learning engaging. I've tried several platforms but none compare to the simplicity and effectiveness of this tool.`,
      stars: 5,
    },
    {
      name: "Pratham Batra",
      email: "@Co-founder, Geekroom",
      review: `This is damn impressive seriously, no words. It genuinely feels like a strong alternative to platforms like GeeksforGeeks and W3Schools. Honestly, as a user, this feels even better. Everything is perfect. The only thing I'd love to see next is a custom code feature based on user input. But overall, this is fantastic.`,
      stars: 4,
    },
    {
      name: "Arnav Gupta",
      email: "@Co-founder, Geekroom",
      review: `AlgoBuddy, this could be the upcoming game-changer. When you're stuck on LeetCode or trying to debug your logic, it helps you actually see what your code is doing at each step. Whether you're just starting out or deep into competitive programming, this is something which can make learning DSA so much more intuitive and less frustrating. Well! my opinion says in the future, I'd love to see a built-in compiler or a feature where users can test their own code with custom inputs — that would take it to the next level. But even now, it's incredibly helpful and super polished!”`,
      stars: 4,
    },
    {
      name: "Rahul Yadav",
      email: "@yadav.rahul05",
      review: `AlgoBuddy made understanding complex algorithms incredibly simple. Its intuitive design and step-by-step visuals helped me grasp DSA concepts faster than traditional methods. A must-use tool for learners! The interface might feel a bit cluttered or difficult to navigate for new users but seriously overall it's actually good. I particularly appreciate how it breaks down each step of the algorithms.`,
      stars: 4,
    },
    {
      name: "kartik",
      email: "@kartik2005221",
      review: `This platform made DSA so much easier to grasp. Everything's in one place — topics, visualizations, and practice. It really helped me connect the dots between theory and how things actually work.`,
      stars: 5,
    },
    {
      name: "Vansh Saini",
      email: "@Vanshsaini9311",
      review: `The data structure application website is an excellent platform for both beginners and advanced learners. It offers clear, interactive demonstrations of essential data structures like stacks, queues, trees, and graphs. The real-time visualizations make complex topics easier to understand, and the practical examples enhance learning. The clean, responsive design and user-friendly navigation add to its appeal. Whether you're a student or a developer, this site is a valuable resource for strengthening your understanding of algorithms and data structures.`,
      stars: 5,
    },
    {
      name: "Priya Sharma",
      email: "@priya.s",
      review: `As a visual learner, this tool has been revolutionary for me. Being able to see the algorithms in action with different speeds makes all the difference. The color coding helps distinguish between different operations clearly.`,
      stars: 5,
    },
    {
      name: "Neha Gupta",
      email: "@neha.g",
      review: `The breadth of algorithms covered is impressive. From basic sorting to advanced graph algorithms, everything is presented in an accessible way. The only suggestion I have is to add more real-world application examples for each algorithm.`,
      stars: 4,
    },
    {
      name: "Kshitija Ghan",
      email: "@kshitijaghan24",
      review: `I got to know about Data Visualizer just a few days ago , yet i feel i learned a lot already . Great platform !!!`,
      stars: 5,
    },
  ];

  const [expandedReviews, setExpandedReviews] = useState({});
  const containerRef = useRef(null);
  const innerRef = useRef(null);
  const animationRef = useRef(null);

  const toggleReview = (index) =>
    setExpandedReviews((prev) => ({ ...prev, [index]: !prev[index] }));

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const StarRating = ({ rating }) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }

    return <div className="flex space-x-1">{stars}</div>;
  };

  useEffect(() => {
    if (innerRef.current) {
      animationRef.current = gsap.to(innerRef.current, {
        x: -innerRef.current.scrollWidth / 2,
        repeat: -1,
        duration: 100,
        ease: "linear",
      });
    }
  }, []);

  const handleMouseEnter = () => {
    if (animationRef.current) {
      animationRef.current.pause();
    }
  };

  const handleMouseLeave = () => {
    if (animationRef.current) {
      animationRef.current.resume();
    }
  };

  return (
    <section className="pb-10 bg-udemy-bg dark:bg-udemy-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <span className="flex items-center justify-center gap-2 text-udemy-purple dark:text-udemy-purple-light text-sm font-bold tracking-wider uppercase mb-4">
            <IoChatboxEllipses className="text-xl" />
            Reviews
          </span>
          <h2 className="text-4xl md:text-5xl font-bold font-serif text-udemy-text dark:text-udemy-dark-text mb-4">
            What Our{" "}
            <span className="text-udemy-purple dark:text-udemy-purple-light">
              Users Say
            </span>
          </h2>
          <p className="text-xl text-udemy-muted dark:text-udemy-dark-muted max-w-3xl mx-auto">
            Trusted by students and professionals worldwide
          </p>
        </div>

        {/* Testimonials Grid */}
        <div ref={containerRef} className="overflow-hidden relative">
          <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <motion.div ref={innerRef} className="flex gap-8">
              {[...testimonials, ...testimonials].map((testimonial, index) => (
                <div
                  key={index}
                  className="relative group bg-white dark:bg-udemy-dark-surface rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-udemy-border dark:border-udemy-dark-border w-[350px] max-w-sm flex-shrink-0"
                >
                  {/* Gradient background on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-white dark:from-udemy-purple/10 dark:to-udemy-dark-surface opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300"></div>

                  <div className="relative z-10">
                    {/* Avatar and Info */}
                    <div className="flex items-center mb-6">
                      <div className="w-14 h-14 rounded-full bg-udemy-purple text-white flex items-center justify-center text-xl font-bold mr-4">
                        {getInitials(testimonial.name)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {testimonial.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {testimonial.email}
                        </p>
                      </div>
                    </div>

                    {/* Star Rating */}
                    <div className="mb-4">
                      <StarRating rating={testimonial.stars} />
                    </div>

                    {/* Review Text */}
                    <div className="relative">
                      <p
                        className={`text-gray-600 dark:text-gray-300 mb-4 break-words whitespace-normal ${!expandedReviews[index] && "line-clamp-3"}`}
                      >
                        {testimonial.review}
                      </p>
                      {testimonial.review.length > 150 && (
                        <button
                          onClick={() => toggleReview(index)}
                          className="text-blue-600 dark:text-blue-400 text-sm font-medium flex items-center gap-1 hover:underline"
                        >
                          {expandedReviews[index] ? (
                            <>
                              <span>Show less</span>
                              <FaChevronUp size={12} />
                            </>
                          ) : (
                            <>
                              <span>Read more</span>
                              <FaChevronDown size={12} />
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                      Verified User • {testimonial.stars.toFixed(1)} Rating
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent dark:from-neutral-900 dark:to-transparent pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent dark:from-neutral-900 dark:to-transparent pointer-events-none"></div>
        </div>

        {/* Divider */}
        <div className="mt-10 mx-auto h-[1px] max-w-4xl bg-gradient-to-r rounded-sm from-transparent via-blue-200 dark:via-blue-800 to-transparent"></div>
      </div>
    </section>
  );
};

export default TestimonialSection;
