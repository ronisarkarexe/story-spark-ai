import Navbar from "@/app/components/navbarinner";
import Footer from "@/app/components/footer";
import BackToTop from "@/app/components/ui/backtotop";
import Breadcrumbs from "@/app/components/ui/Breadcrumbs";

export function createVisualizerPaths(...segments) {
  return [
    { name: "Home", href: "/" },
    { name: "Visualizer", href: "/visualizer" },
    ...segments.map((name, index) => ({
      name,
      href: index === segments.length - 1 ? "" : "/visualizer",
    })),
  ];
}

function VisualizerPageSection({ children, className }) {
  if (!children) {
    return null;
  }

  return <section className={className}>{children}</section>;
}

export default function VisualizerPageLayout({
  paths,
  title,
  headerDescription,
  headerActions,
  animation,
  content,
  code,
  quiz,
  moduleCard,
  exploreOther,
  extraSections = [],
  animationSectionClassName = "px-6",
  contentSectionClassName = "px-6 md:px-12",
  codeSectionClassName = "px-6",
  quizSectionClassName = "px-6",
  moduleSectionClassName = "px-6 md:px-12 my-12",
  exploreSectionClassName = "px-6",
}) {
  return (
    <>
      <Navbar />

      <div className="bg-white pb-16 pt-6 text-[#1a1a1a] dark:bg-[#0f0f0f] dark:text-[#f5f5f5]">
        <section className="px-6 md:px-12">
          <div className="mb-4 mt-2">
            <Breadcrumbs paths={paths} />
          </div>

          <div className="flex flex-col items-center">
            <h1
              className="mb-0 text-center text-4xl font-black text-[#1a1a1a] dark:text-white md:text-5xl"
              style={{
                fontFamily: "'Inter', sans-serif",
                letterSpacing: "-0.03em",
              }}
            >
              {title}
            </h1>

            {headerDescription ? (
              <p className="mt-4 max-w-2xl text-center text-lg text-[#6b7280] dark:text-[#9ca3af]">
                {headerDescription}
              </p>
            ) : null}

            {headerActions ? <div className="mt-4">{headerActions}</div> : null}
          </div>

          <div className="mx-auto my-10 h-px max-w-4xl bg-gradient-to-r from-transparent via-[#d1d7dc] to-transparent dark:via-[#333]" />
        </section>

        <VisualizerPageSection className={animationSectionClassName}>
          {animation}
        </VisualizerPageSection>

        <VisualizerPageSection className={contentSectionClassName}>
          {content}
        </VisualizerPageSection>

        <VisualizerPageSection className={codeSectionClassName}>
          {code}
        </VisualizerPageSection>

        <VisualizerPageSection className={quizSectionClassName}>
          {quiz}
        </VisualizerPageSection>

        {extraSections.map(({ content: extraContent, className }, index) => (
          <VisualizerPageSection
            key={`${title}-extra-section-${index}`}
            className={className}
          >
            {extraContent}
          </VisualizerPageSection>
        ))}

        <VisualizerPageSection className={moduleSectionClassName}>
          {moduleCard}
        </VisualizerPageSection>

        <VisualizerPageSection className={exploreSectionClassName}>
          {exploreOther}
        </VisualizerPageSection>
      </div>

      <BackToTop />
      <Footer />
    </>
  );
}
