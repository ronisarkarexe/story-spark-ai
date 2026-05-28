import { Link } from "react-router-dom";

const resources = [
  { title: "AI Writing Assistant", description: "Generate ideas and improve drafts with AI.", linkText: "Learn more", link: "/writing-assistant" },
  { title: "Writing Templates", description: "Use curated templates for different writing goals.", linkText: "Browse templates", link: "/templates" },
  { title: "Writing Community", description: "Collaborate with other writers and share feedback.", linkText: "Join now", link: "/community" },
];

const ResourceComponent = () => (
  <section className="story-section">
    <div className="story-page-shell">
      <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
        <h2 className="story-section-heading">Writing Tools &amp; Resources</h2>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {resources.map((resource) => (
          <div key={resource.title} className="motion-card-subtle story-panel group flex h-full flex-col rounded-lg p-6">
            <h3 className="mb-3 text-xl font-bold text-slate-100">{resource.title}</h3>
            <p className="mb-6 flex-grow leading-relaxed text-slate-400">{resource.description}</p>
            <Link to={resource.link} className="inline-flex items-center font-semibold text-blue-300 transition-colors hover:text-blue-200">
              {resource.linkText}
            </Link>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ResourceComponent;
