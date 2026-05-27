"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";

export default function TutorialOverlay() {
  const [showOverlay, setShowOverlay] = useState(false);
  const [step, setStep] = useState(0);
  const overlayRef = useRef();

  useEffect(() => {
    const seenTutorial = localStorage.getItem("tutorialSeen");

    if (!seenTutorial) {
      setShowOverlay(true);
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: "power2.out" },
      );
    }
  }, []);

  const nextStep = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => {
          localStorage.setItem("tutorialSeen", "true");
          setShowOverlay(false);
        },
      });
    }
  };

  const closeOverlay = () => {
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.in",
      onComplete: () => {
        localStorage.setItem("tutorialSeen", "true");
        setShowOverlay(false);
      },
    });
  };

  if (!showOverlay) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
    >
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center relative">
        <button
          onClick={closeOverlay}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white text-xl"
        >
          ×
        </button>
        {(step === 1 || step === 2) && (
          /* 
            TODO: When tutorial1.mp4 and tutorial2.mp4 are added to the /public/tutorials/ directory, 
            remove this div placeholder and restore the video element below:
            
            <video 
              src={`/tutorials/tutorial${step}.mp4`} 
              autoPlay 
              loop 
              muted 
              className="w-full aspect-video rounded-lg mb-4" 
            /> 
          */
          <div className="w-full aspect-video rounded-lg mb-4 bg-gray-100 dark:bg-surface-800 border border-gray-200 dark:border-surface-700 flex flex-col items-center justify-center">
            <span className="text-gray-500 dark:text-gray-400 font-medium">Video tutorial coming soon</span>
          </div>
        )}
        <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
          {step === 0 && "Welcome to AlgoBuddy!"}
          {step === 1 && "Choose a Data Structure"}
          {step === 2 && "Learn More About Each Structure"}
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          {step === 0 &&
            "Here’s a quick guide to help you get started with visualizing data structures."}
          {step === 1 &&
            "This is the algorithm page where you can choose a data structure and explore related algorithms."}
          {step === 2 &&
            "Click the 'i' button on each data structure card to learn more about it before visualizing."}
        </p>
        {step > 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Step {step}/2
          </p>
        )}
        <div className="flex justify-center gap-3">
          <button
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-xl hover:opacity-90"
            onClick={nextStep}
          >
            {step < 2 ? "Next" : "Finish"}
          </button>
          <button
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-xl hover:opacity-90"
            onClick={closeOverlay}
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}
