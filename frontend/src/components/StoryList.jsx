// 1. Add the import statement at the absolute top of the file:
import SkeletonCard from "../components/SkeletonCard"; // Adjust dot paths depending on your folder layout

// 2. Locate your layout grid inside the return statement and structure it like this:
<div 
  role="status" 
  aria-busy={isLoading} // Connects your true active API loading state boolean variable here
  aria-label="Loading stories"
  className="w-full"
>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    {/* CONDITIONAL PATH 1: Render 6 glowing skeleton placeholders while the API fetch is running */}
    {isLoading && 
      Array.from({ length: 6 }).map((_, index) => (
        <SkeletonCard key={`story-skeleton-${index}`} />
      ))
    }

    {/* CONDITIONAL PATH 2: Swap smoothly to real content assets once the network request finishes */}
    {!isLoading && stories && stories.map((story) => (
      <StoryCard key={story._id || story.id} story={story} />
    ))
    }
  </div>
</div>
