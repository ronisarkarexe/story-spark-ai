
# TODO

- [x] Inspect existing Trending Topics implementation in `frontend/src/components/home/trending_topic/trending_topic.component.tsx`.
- [x] Replace previous `topicsData` chip layout with a new `trendingTopics` array containing 8 topics.
- [x] Implement responsive grid (2/3/4 columns) with Tailwind hover + transition effects.
- [x] Ensure dark mode support via `dark:` classes.
- [ ] Verify there are no build/runtime errors (run frontend typecheck/build or dev check).
- [ ] Run quick manual UI verification on homepage.

---

## Fix: stories.view.component.tsx — resolve merge corruption (conflict resolution)

- [x] Analyze current corrupted file with circular self-import and duplicated code
- [x] Write clean presentation component with proper imports
- [x] Define `IStories` interface
- [x] Implement story display + 3 action buttons (Alternate Endings, Export PDF, Reset)
- [x] Verify imports/exports match parent component `stories.component.tsx`
- [x] Verify no stale `StoriesViewComponentPlaceholder` references exist elsewhere
- [x] Resolved circular self-import (`StoriesViewComponent` importing itself)
- [x] Removed all merge-conflict garbage (duplicate `useState`, `useForm`, `StoriesViewComponent`, `TemplateSelectionScreen`, etc.)
- [x] Correctly exports `IStories` interface + `StoriesViewComponent` default export
- [x] Parent `stories.component.tsx` import is fully compatible
- [x] No stale `StoriesViewComponentPlaceholder` references remain in the codebase
- [ ] Run `npm install` in `frontend/` and verify no build errors


