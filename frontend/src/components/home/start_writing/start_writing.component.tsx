import React from "react";
import aiWriter from "../../../assets/aiwriter.webp";
import { Link } from "react-router-dom";

const StartWritingComponent = () => {
  return (
    <section className="mb-24 mx-5">
      <div className="motion-card-subtle relative group max-w-6xl mx-auto overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #f5ead6 0%, #ede0c4 50%, #f5ead6 100%)',
          border: '1px solid #d4b896',
          borderRadius: '1.5rem',
          boxShadow: '0 8px 40px rgba(44,24,16,0.15), 0 2px 8px rgba(44,24,16,0.1), inset 0 1px 0 rgba(255,255,255,0.7)',
        }}>

        {/* Top border accent line */}
        <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-[1.5rem]"
          style={{ background: 'linear-gradient(90deg, transparent, #c9a227, #d4b896, #c9a227, transparent)' }} />

        {/* Warm amber glow top-right */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full -z-10 pointer-events-none transition-opacity duration-500 group-hover:opacity-100 opacity-60"
          style={{ background: 'radial-gradient(circle, rgba(201,162,39,0.15) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        {/* Crimson glow bottom-left */}
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full -z-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(139,26,26,0.08) 0%, transparent 70%)', filter: 'blur(50px)' }} />

        {/* Corner ornament */}
        <div className="absolute top-4 right-6 pointer-events-none opacity-15" style={{ width: 60, height: 60 }}>
          <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'scaleX(-1)' }}>
            <path d="M4 4 Q4 30 30 30" stroke="#8b5e3c" strokeWidth="1" fill="none"/>
            <path d="M4 4 Q30 4 30 30" stroke="#8b5e3c" strokeWidth="1" fill="none"/>
            <circle cx="4" cy="4" r="2.5" fill="#c9a227"/>
          </svg>
        </div>

        <div className="px-8 py-16 sm:px-12 lg:px-24 flex flex-col md:flex-row items-center justify-between gap-16">
          <div className="flex-1 text-center md:text-left">
            {/* Ornamental label */}
            <div className="inline-flex items-center gap-2 mb-4" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: '#8b5e3c', fontSize: '0.8rem', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              <span style={{ color: '#c9a227' }}>✦</span>
              Begin Your Tale
              <span style={{ color: '#c9a227' }}>✦</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#2c1810' }}>
              Ready to <br className="hidden md:block" /> Start Writing?
            </h2>
            <p className="text-lg md:text-xl mb-10 leading-relaxed max-w-lg mx-auto md:mx-0"
              style={{ fontFamily: "'EB Garamond', Georgia, serif", color: '#5c3d2e', letterSpacing: '0.01em' }}>
              Join thousands of writers who are already creating amazing content
              with our AI-powered platform.
            </p>
            <Link to="/stories">
              <button className="parchment-btn-primary motion-cta inline-flex items-center justify-center gap-3 text-lg px-10 py-4 cursor-pointer">
                GET STARTED FREE
                <i className="motion-icon fa-solid fa-feather-pointed text-base" style={{ color: '#f5ead6' }}></i>
              </button>
            </Link>
          </div>

          <div className="flex-1 flex justify-center md:justify-end">
            <div className="relative">
              <div className="absolute inset-0 rounded-full -z-10 pointer-events-none opacity-50 group-hover:opacity-80 transition-opacity duration-700"
                style={{ background: 'radial-gradient(circle, rgba(201,162,39,0.2) 0%, transparent 70%)', filter: 'blur(40px)' }} />
              <img
                src={aiWriter}
                alt="Writing Illustration"
                className="motion-image w-full max-w-sm lg:max-w-md object-contain"
                style={{ filter: 'drop-shadow(0 20px 40px rgba(44,24,16,0.2)) sepia(0.1)' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StartWritingComponent;

