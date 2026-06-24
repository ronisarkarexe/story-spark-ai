// frontend/src/components/Contributors/Contributors.tsx
import { useState, useEffect } from 'react';
import { FaGithub, FaStar, FaCodeBranch, FaUsers } from 'react-icons/fa';

interface Contributor {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

interface RepoStats {
  stars: number;
  forks: number;
  contributors: number;
}

export const Contributors: React.FC = () => {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [repoStats, setRepoStats] = useState<RepoStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const REPO_OWNER = 'ronisarkarexe';
  const REPO_NAME = 'story-spark-ai';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch contributors
        const contributorsRes = await fetch(
          `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contributors?per_page=100`
        );

        if (!contributorsRes.ok) {
          throw new Error(`GitHub API error: ${contributorsRes.status}`);
        }

        const contributorsData = await contributorsRes.json();
        setContributors(contributorsData);

        // Fetch repo stats
        const repoRes = await fetch(
          `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`
        );

        if (repoRes.ok) {
          const repoData = await repoRes.json();
          setRepoStats({
            stars: repoData.stargazers_count || 0,
            forks: repoData.forks_count || 0,
            contributors: contributorsData.length,
          });
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch contributors');
        console.error('Error fetching contributors:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        <p className="text-lg font-medium">Failed to load contributors</p>
        <p className="text-sm text-gray-500 mt-2">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-300 mb-4 select-none uppercase tracking-wider">
          <FaUsers className="text-sm" />
          Open Source Community
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          GitHub Contributors
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
          Meet the amazing people who have contributed to StorySpark AI
        </p>
      </div>

      {/* Stats Cards */}
      {repoStats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-10">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-yellow-500 mb-1">
              <FaStar className="text-xl" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {repoStats.stars}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Stars</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-blue-500 mb-1">
              <FaCodeBranch className="text-xl" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {repoStats.forks}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Forks</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-green-500 mb-1">
              <FaUsers className="text-xl" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {repoStats.contributors}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Contributors</p>
          </div>
        </div>
      )}

      {/* Contributors Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {contributors.map((contributor) => (
          <a
            key={contributor.id}
            href={contributor.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <img
              src={contributor.avatar_url}
              alt={contributor.login}
              className="w-16 h-16 rounded-full border-2 border-indigo-500/20 group-hover:border-indigo-500 transition-colors"
              loading="lazy"
            />
            <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white text-center truncate w-full">
              {contributor.login}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {contributor.contributions} contributions
            </p>
          </a>
        ))}
      </div>

      {/* View All Link */}
      <div className="text-center mt-10">
        <a
          href={`https://github.com/${REPO_OWNER}/${REPO_NAME}/graphs/contributors`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
        >
          <FaGithub className="text-lg" />
          View All Contributors on GitHub
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  );
};

export default Contributors;