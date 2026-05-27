import Navbar from "@/app/components/navbarinner";
import Footer from "@/app/components/footer";
import BackToTop from "@/app/components/ui/backtotop";
import Breadcrumbs from "@/app/components/ui/Breadcrumbs";
import ArticleActions from "@/app/components/ui/ArticleActions";
import ExploreOther from "@/app/components/ui/exploreOther";
import { getGraphRelatedLinks } from "@/app/visualizer/graph/data";

export default function GraphTopicPage({ topic, Animation, startNode }) {
  const paths = [
    { name: "Home", href: "/" },
    { name: "Visualizer", href: "/visualizer" },
    { name: topic.title, href: "" },
  ];

  return (
    <>
      <Navbar />
      <main className="bg-white pt-6 pb-16 text-surface-900 dark:bg-surface-950 dark:text-white">
        <section className="container-app">
          <div className="mb-8 mt-2">
            <Breadcrumbs paths={paths} />
          </div>

          <div className="flex flex-col items-center text-center">
            <p className="mb-3 rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-sm font-semibold uppercase tracking-wide text-primary">
              {topic.category}
            </p>
            <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight md:text-5xl">
              {topic.title}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-surface-600 dark:text-surface-400">
              {topic.description}
            </p>
            <ArticleActions />
          </div>

          <div className="mx-auto my-10 h-px max-w-4xl bg-gradient-to-r from-transparent via-surface-200 to-transparent dark:via-surface-800" />

          <div className="mx-auto w-full grid gap-6 lg:grid-cols-[2fr_320px]">
            <article className="rounded-2xl border border-surface-200 bg-white shadow-card dark:border-surface-800 dark:bg-surface-900">
              <section className="border-b border-surface-100 p-6 dark:border-surface-800">
                <h2 className="mb-4 text-2xl font-bold">Core idea</h2>
                <div className="space-y-3 text-surface-700 dark:text-surface-300">
                  {topic.summary.map((item) => (
                    <p key={item}>{item}</p>
                  ))}
                </div>
              </section>

              <section className="p-6">
                <h2 className="mb-4 text-2xl font-bold">How it works</h2>
                <ol className="space-y-3 pl-5 text-surface-700 marker:text-primary dark:text-surface-300">
                  {topic.steps.map((step) => (
                    <li key={step} className="list-decimal pl-2">
                      {step}
                    </li>
                  ))}
                </ol>
              </section>
            </article>

            <aside className="h-fit rounded-2xl border border-surface-200 bg-surface-50 p-5 dark:border-surface-800 dark:bg-surface-900">
              <h2 className="mb-4 text-xl font-bold">Complexity</h2>
              <div className="space-y-3">
                {topic.complexity.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-sm dark:bg-surface-950"
                  >
                    <span className="text-surface-500 dark:text-surface-400">{item.label}</span>
                    <span className="font-semibold text-surface-900 dark:text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section className="container-app">
          <Animation startNode={startNode} />
        </section>

        <section className="container-app">
          <ExploreOther
            title="Explore graph topics"
            columns="4"
            links={getGraphRelatedLinks(topic.key)}
          />
        </section>
      </main>
      <BackToTop />
      <Footer />
    </>
  );
}