import { useMemo } from "react";

interface CarouselImage {
    src: string;
    alt: string;
}

// Decorative placeholder images. Swap these for real story-cover URLs
// or curated assets whenever the project has a source for them.
const CAROUSEL_IMAGES: CarouselImage[] = [
    { src: "https://picsum.photos/seed/story-spark-1/240/160", alt: "" },
    { src: "https://picsum.photos/seed/story-spark-2/240/160", alt: "" },
    { src: "https://picsum.photos/seed/story-spark-3/240/160", alt: "" },
    { src: "https://picsum.photos/seed/story-spark-4/240/160", alt: "" },
    { src: "https://picsum.photos/seed/story-spark-5/240/160", alt: "" },
    { src: "https://picsum.photos/seed/story-spark-6/240/160", alt: "" },
];

const PictureCarouselComponent = () => {
    // Duplicate the list so the marquee loop wraps seamlessly at 50% scroll.
    const trackImages = useMemo(
        () => [...CAROUSEL_IMAGES, ...CAROUSEL_IMAGES],
        []
    );

    return (
        <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                From the Community
            </h3>

            <div className="group relative overflow-hidden rounded-xl">
                {/* Edge fades so the loop point doesn't look abrupt */}
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-white to-transparent dark:from-slate-900" />
                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-white to-transparent dark:from-slate-900" />

                {/* Purely decorative, so it's hidden from assistive tech */}
                <div
                    aria-hidden="true"
                    className="picture-carousel-track flex w-max gap-3 group-hover:[animation-play-state:paused]"
                >
                    {trackImages.map((image, index) => (
                        <img
                            key={`${image.src}-${index}`}
                            src={image.src}
                            alt={image.alt}
                            loading="lazy"
                            className="h-24 w-36 flex-shrink-0 rounded-lg object-cover sm:h-28 sm:w-40"
                        />
                    ))}
                </div>
            </div>

            <style>{`
        .picture-carousel-track {
          animation: picture-carousel-scroll 25s linear infinite;
        }

        @keyframes picture-carousel-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        @media (prefers-reduced-motion: reduce) {
          .picture-carousel-track {
            animation: none;
          }
        }
      `}</style>
        </div>
    );
};

export default PictureCarouselComponent;