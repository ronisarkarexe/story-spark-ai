import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDebounced } from "../../../hooks/global";
import { Post } from "../../../models/post";
import { useGetMyPublishedStoriesQuery } from "../../../redux/apis/post.api";
import PaginationComponent from "../../pagination/pagination.component";

const PAGE_SIZE = 6;

const stripMarkup = (content: string) =>
  content
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const formatDate = (dateString?: string) => {
  if (!dateString) return "Not available";

  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getExcerpt = (post: Post) => {
  const text = stripMarkup(post.content || "");

  if (!text) return "No excerpt available for this story yet.";
  return text.length > 160 ? `${text.slice(0, 160)}...` : text;
};

const PublishedStoriesComponent: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(PAGE_SIZE);

  const debounceTerm = useDebounced({
    searchQuery: searchTerm,
    daley: 500,
  });

  const query = useMemo(() => {
    const params: Record<string, string | number> = {
      page,
      limit: size,
    };

    if (debounceTerm) {
      params.searchTerm = debounceTerm;
    }

    return params;
  }, [debounceTerm, page, size]);

  const { data, isError, isLoading } = useGetMyPublishedStoriesQuery(query);
  const stories = data?.posts || [];
  const totalStories = data?.meta?.total || 0;

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const onPaginationChange = (nextPage: number, pageSize: number) => {
    setPage(nextPage);
    setSize(pageSize);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm dark:border-white/[0.07] dark:bg-white/[0.03] md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-300">
            Creator Library
          </p>
          <h2 className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            Published Stories
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
            Review every story you have published from one dashboard view.
          </p>
        </div>

        <Link
          to="/story-workspace"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-500"
        >
          <i className="fas fa-pen-nib text-xs"></i>
          Write Story
        </Link>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/[0.07] dark:bg-[#0a1020] md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            {totalStories.toLocaleString()} published{" "}
            {totalStories === 1 ? "story" : "stories"}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sorted by latest published date.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <input
            className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-white"
            placeholder="Search your stories..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400"></i>
        </div>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="h-56 animate-pulse rounded-xl border border-slate-200 bg-slate-100 dark:border-white/[0.06] dark:bg-white/[0.04]"
            />
          ))}
        </div>
      )}

      {isError && !isLoading && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-8 text-center dark:border-rose-500/20 dark:bg-rose-500/10">
          <h3 className="text-lg font-bold text-rose-700 dark:text-rose-300">
            Unable to load published stories
          </h3>
          <p className="mt-2 text-sm text-rose-600 dark:text-rose-200">
            Please refresh the page or try again in a moment.
          </p>
        </div>
      )}

      {!isLoading && !isError && stories.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm dark:border-white/[0.07] dark:bg-[#0a1020]">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
            <i className="fas fa-book-open"></i>
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            No published stories found
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-600 dark:text-slate-400">
            Publish a story and it will appear here automatically.
          </p>
        </div>
      )}

      {!isLoading && !isError && stories.length > 0 && (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {stories.map((story) => (
            <article
              key={story._id}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-white/[0.07] dark:bg-[#0a1020]"
            >
              <div className="flex flex-col sm:flex-row">
                <button
                  type="button"
                  onClick={() => navigate(`/post/${story._id}`)}
                  className="h-48 w-full overflow-hidden bg-slate-100 text-left dark:bg-white/[0.04] sm:h-auto sm:w-44 sm:flex-shrink-0"
                >
                  <img
                    src={story.imageURL}
                    alt={story.title}
                    className="h-full w-full object-cover transition duration-300 hover:scale-105"
                  />
                </button>

                <div className="flex min-w-0 flex-1 flex-col p-5">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                      {story.tag}
                    </span>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                      Published
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate(`/post/${story._id}`)}
                    className="text-left"
                  >
                    <h3 className="line-clamp-2 text-lg font-black text-slate-900 transition hover:text-blue-600 dark:text-white dark:hover:text-blue-300">
                      {story.title}
                    </h3>
                  </button>

                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    {getExcerpt(story)}
                  </p>

                  <div className="mt-5 grid grid-cols-3 gap-3 border-t border-slate-100 pt-4 text-center dark:border-white/[0.07]">
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {story.viewsCount}
                      </p>
                      <p className="text-[10px] uppercase tracking-wider text-slate-500">
                        Views
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {story.likesCount}
                      </p>
                      <p className="text-[10px] uppercase tracking-wider text-slate-500">
                        Likes
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {formatDate(story.publishedAt || story.createdAt)}
                      </p>
                      <p className="text-[10px] uppercase tracking-wider text-slate-500">
                        Published
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {data?.meta && data.meta.total > size && (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-white/[0.07] dark:bg-[#0a1020]">
          <PaginationComponent
            current={page}
            pageSize={size}
            total={data.meta.total}
            onChange={onPaginationChange}
          />
        </div>
      )}
    </div>
  );
};

export default PublishedStoriesComponent;
