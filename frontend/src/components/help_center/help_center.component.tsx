import { useMemo, useState } from "react";
import HelpHero from "./help_hero/help_hero.component";
import HelpSidebar from "./help_sidebar/help_sidebar.component";
import HelpCategories from "./help_categories/help_categories.component";
import FAQAccordion from "./faq_accordion/faq_accordion.component";
import Troubleshoot from "./troubleshoot/troubleshoot.component";
import SetupGuide from "./setup_guide/setup_guide.component";
import SupportLinks from "./support_links/support_links.component";
import {
  FAQ_ITEMS,
  HELP_CATEGORIES,
  SETUP_STEPS,
  SUPPORT_LINKS,
  TROUBLESHOOT_ITEMS,
  matchesSearch,
} from "./help_center.utils";

const HelpCenterComponent = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = useMemo(
    () =>
      HELP_CATEGORIES.filter((category) =>
        matchesSearch(searchQuery, [
          category.title,
          category.description,
          ...category.keywords,
        ])
      ),
    [searchQuery]
  );

  const filteredFaqs = useMemo(
    () =>
      FAQ_ITEMS.filter((faq) =>
        matchesSearch(searchQuery, [
          faq.question,
          faq.answer,
          ...faq.keywords,
        ])
      ),
    [searchQuery]
  );

  const filteredTroubleshoot = useMemo(
    () =>
      TROUBLESHOOT_ITEMS.filter((item) =>
        matchesSearch(searchQuery, [
          item.title,
          item.symptoms,
          item.solution,
          ...item.keywords,
        ])
      ),
    [searchQuery]
  );

  const resultCount = useMemo(() => {
    if (!searchQuery.trim()) return undefined;
    return (
      filteredCategories.length +
      filteredFaqs.length +
      filteredTroubleshoot.length
    );
  }, [searchQuery, filteredCategories, filteredFaqs, filteredTroubleshoot]);

  return (
    <div className="min-h-screen bg-white text-slate-900 transition-colors duration-300 dark:bg-slate-900 dark:text-white">
      <HelpHero
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        resultCount={resultCount}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <HelpSidebar />

          <main className="flex-1 min-w-0 space-y-20">
            <HelpCategories categories={filteredCategories} />
            <FAQAccordion items={filteredFaqs} />
            <Troubleshoot items={filteredTroubleshoot} />
            {!searchQuery.trim() && <SetupGuide steps={SETUP_STEPS} />}
            {!searchQuery.trim() && <SupportLinks links={SUPPORT_LINKS} />}
          </main>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterComponent;
