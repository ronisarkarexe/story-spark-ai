import { useGetDashboardAnalysisQuery } from "../../redux/apis/analysis.api";
import TopicsChart from "../chart/dashboard/bar_chart";
import SubscriptionChart from "../chart/dashboard/doughnut_chart";
import PostsPerMonthChart from "../chart/dashboard/line_chart";
import UsersPieChart from "../chart/dashboard/pai_chart";
import LoadingAnimation from "../loading/loading.component";
import { getUserInfo } from "../../services/auth.service";
import { USER_ROLE } from "../../constants/role";

const DashboardComponent = () => {
  const { data, isLoading } = useGetDashboardAnalysisQuery(undefined);
  const userInfo = getUserInfo();
  const role = userInfo?.role;

  if (isLoading) {
    return <LoadingAnimation />;
  }

  // Construct statistics cards dynamically based on user role
  const getStatsCards = () => {
    if (!data) return [];

    if (role === USER_ROLE.ADMIN || role === USER_ROLE.SUPER_ADMIN) {
      return [
        {
          title: "Total Users",
          value: data.users?.total || 0,
          icon: "fa-users",
          gradient: "from-blue-600 to-cyan-500",
          glow: "shadow-blue-500/5 dark:shadow-blue-500/20",
          border: "border-blue-100 dark:border-blue-500/20",
          bg: "bg-blue-50/40 dark:bg-blue-500/10",
          iconBg: "bg-blue-100 dark:bg-blue-500/15",
          iconColor: "text-blue-600 dark:text-blue-400",
          badge: "Active platform",
          badgeColor: "text-blue-600 dark:text-blue-400",
        },
        {
          title: "Total Posts",
          value: data.posts?.total || 0,
          icon: "fa-newspaper",
          gradient: "from-violet-600 to-purple-500",
          glow: "shadow-violet-500/5 dark:shadow-violet-500/20",
          border: "border-violet-100 dark:border-violet-500/20",
          bg: "bg-violet-50/40 dark:bg-violet-500/10",
          iconBg: "bg-violet-100 dark:bg-violet-500/15",
          iconColor: "text-violet-600 dark:text-violet-400",
          badge: "Published content",
          badgeColor: "text-violet-600 dark:text-violet-400",
        },
        {
          title: "Subscriptions",
          value: (data.subscriptionTypes?.pro || 0) + (data.subscriptionTypes?.premium || 0),
          icon: "fa-credit-card",
          gradient: "from-emerald-600 to-teal-500",
          glow: "shadow-emerald-500/5 dark:shadow-emerald-500/20",
          border: "border-emerald-100 dark:border-emerald-500/20",
          bg: "bg-emerald-50/40 dark:bg-emerald-500/10",
          iconBg: "bg-emerald-100 dark:bg-emerald-500/15",
          iconColor: "text-emerald-600 dark:text-emerald-400",
          badge: "Premium tiers",
          badgeColor: "text-emerald-600 dark:text-emerald-400",
        },
        {
          title: "Writer Applications",
          value: data.users?.applyForWriter || 0,
          icon: "fa-pen-nib",
          gradient: "from-amber-500 to-orange-500",
          glow: "shadow-amber-500/5 dark:shadow-amber-500/20",
          border: "border-amber-100 dark:border-amber-500/20",
          bg: "bg-amber-50/40 dark:bg-amber-500/10",
          iconBg: "bg-amber-100 dark:bg-amber-500/15",
          iconColor: "text-amber-600 dark:text-amber-400",
          badge: "Pending review",
          badgeColor: "text-amber-600 dark:text-amber-400",
        },
      ];
    }

    if (role === USER_ROLE.WRITER) {
      return [
        {
          title: "Total Readers of Your Content",
          value: data.writerStats?.totalReaders || 0,
          icon: "fa-eye",
          gradient: "from-blue-600 to-cyan-500",
          glow: "shadow-blue-500/5 dark:shadow-blue-500/20",
          border: "border-blue-100 dark:border-blue-500/20",
          bg: "bg-blue-50/40 dark:bg-blue-500/10",
          iconBg: "bg-blue-100 dark:bg-blue-500/15",
          iconColor: "text-blue-600 dark:text-blue-400",
          badge: "Lifetime views",
          badgeColor: "text-blue-600 dark:text-blue-400",
        },
        {
          title: "Total Posts Published",
          value: data.writerStats?.totalPosts || 0,
          icon: "fa-pencil-alt",
          gradient: "from-violet-600 to-purple-500",
          glow: "shadow-violet-500/5 dark:shadow-violet-500/20",
          border: "border-violet-100 dark:border-violet-500/20",
          bg: "bg-violet-50/40 dark:bg-violet-500/10",
          iconBg: "bg-violet-100 dark:bg-violet-500/15",
          iconColor: "text-violet-600 dark:text-violet-400",
          badge: "Your stories",
          badgeColor: "text-violet-600 dark:text-violet-400",
        },
        {
          title: "Subscription Status",
          value: data.writerStats?.subscriptionStatus || "FREE",
          icon: "fa-credit-card",
          gradient: "from-emerald-600 to-teal-500",
          glow: "shadow-emerald-500/5 dark:shadow-emerald-500/20",
          border: "border-emerald-100 dark:border-emerald-500/20",
          bg: "bg-emerald-50/40 dark:bg-emerald-500/10",
          iconBg: "bg-emerald-100 dark:bg-emerald-500/15",
          iconColor: "text-emerald-600 dark:text-emerald-400",
          badge: "Active Tier",
          badgeColor: "text-emerald-600 dark:text-emerald-400",
          isString: true,
        },
        {
          title: "Writer Status",
          value: data.writerStats?.applicationStatus || "APPROVED",
          icon: "fa-user-check",
          gradient: "from-amber-500 to-orange-500",
          glow: "shadow-amber-500/5 dark:shadow-amber-500/20",
          border: "border-amber-100 dark:border-amber-500/20",
          bg: "bg-amber-50/40 dark:bg-amber-500/10",
          iconBg: "bg-amber-100 dark:bg-amber-500/15",
          iconColor: "text-amber-600 dark:text-amber-400",
          badge: "Role verified",
          badgeColor: "text-amber-600 dark:text-amber-400",
          isString: true,
        },
      ];
    }

    // Default: USER_ROLE.USER
    return [
      {
        title: "Subscription Status",
        value: data.userStats?.subscriptionStatus || "FREE",
        icon: "fa-credit-card",
        gradient: "from-emerald-600 to-teal-500",
        glow: "shadow-emerald-500/5 dark:shadow-emerald-500/20",
        border: "border-emerald-100 dark:border-emerald-500/20",
        bg: "bg-emerald-50/40 dark:bg-emerald-500/10",
        iconBg: "bg-emerald-100 dark:bg-emerald-500/15",
        iconColor: "text-emerald-600 dark:text-emerald-400",
        badge: "Active Tier",
        badgeColor: "text-emerald-600 dark:text-emerald-400",
        isString: true,
      },
      {
        title: "Writer Application Status",
        value: data.userStats?.applicationStatus || "NOT APPLIED",
        icon: "fa-pen-nib",
        gradient: "from-amber-500 to-orange-500",
        glow: "shadow-amber-500/5 dark:shadow-amber-500/20",
        border: "border-amber-100 dark:border-amber-500/20",
        bg: "bg-amber-50/40 dark:bg-amber-500/10",
        iconBg: "bg-amber-100 dark:bg-amber-500/15",
        iconColor: "text-amber-600 dark:text-amber-400",
        badge: "Application Progress",
        badgeColor: "text-amber-600 dark:text-amber-400",
        isString: true,
      },
    ];
  };

  const stats = getStatsCards();

  return (
    <div className="space-y-8">
      {/* HERO SECTION */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-50 via-slate-50 to-blue-50 border border-slate-200 shadow-xl dark:from-[#0f1c3a] dark:via-[#0d1a3a] dark:to-[#111433] dark:border-white/[0.07] p-6 md:p-8">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-blue-600/15 rounded-full blur-[60px]" />
        <div className="absolute bottom-0 left-8 w-48 h-48 bg-indigo-500/10 rounded-full blur-[50px]" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/50 dark:bg-blue-500/10 border border-blue-200/50 dark:border-blue-500/20 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 animate-pulse"></span>
              <span className="text-[10px] uppercase tracking-widest text-blue-600 dark:text-blue-300 font-semibold">
                {role === USER_ROLE.ADMIN || role === USER_ROLE.SUPER_ADMIN
                  ? "Platform Manager Dashboard"
                  : role === USER_ROLE.WRITER
                  ? "Creator Dashboard"
                  : "Member Dashboard"}
              </span>
            </div>

            <h1 className="text-4xl font-black text-slate-800 dark:text-white leading-tight mb-3">
              Welcome Back, {userInfo?.name || "Member"} 👋
            </h1>

            <p className="text-slate-600 dark:text-slate-400 text-base max-w-xl">
              {role === USER_ROLE.ADMIN || role === USER_ROLE.SUPER_ADMIN
                ? "Monitor platform growth, track engagement, and manage your ecosystem through a modern analytics experience."
                : role === USER_ROLE.WRITER
                ? "View your creative reach, write new posts, and customize your workspace using premium AI assistant features."
                : "Explore rich content, upgrade your reading plan, or apply to join our community of writers."}
            </p>
          </div>
        </div>
      </div>

      {/* STATS GRID */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${role === USER_ROLE.USER ? "xl:grid-cols-2" : "xl:grid-cols-4"} gap-5`}>
        {stats.map((item) => (
          <div
            key={item.title}
            className={`rounded-2xl border ${item.border} ${item.bg} p-5 shadow-xl ${item.glow}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${item.iconBg}`}>
                <i className={`fas ${item.icon} ${item.iconColor} text-sm`}></i>
              </div>

              <span className={`text-[10px] ${item.badgeColor}`}>{item.badge}</span>
            </div>

            <p className="text-slate-500 dark:text-slate-400 text-xs mb-2">{item.title}</p>

            <h2 className="text-3xl font-black text-slate-800 dark:text-white">
              {typeof item.value === "number" ? item.value.toLocaleString() : item.value}
            </h2>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {!data && (
        <div className="rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-slate-50/50 dark:bg-white/[0.02] p-20 text-center">
          <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-3">
            Analytics Not Available
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Dashboard insights are currently unavailable.
          </p>
        </div>
      )}

      {/* CHARTS / CONTENT GRID */}
      {data && (
        <div className="mt-8">
          {/* Admin / Super Admin Layout */}
          {(role === USER_ROLE.ADMIN || role === USER_ROLE.SUPER_ADMIN) && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-blue-100 bg-slate-50/50 p-6 dark:border-blue-500/15 dark:bg-white/[0.02]">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Users Distribution</h2>
                <UsersPieChart data={data.users} />
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-slate-50/50 p-6 dark:border-emerald-500/15 dark:bg-white/[0.02]">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Subscription Overview</h2>
                <SubscriptionChart data={data.subscriptionTypes} />
              </div>

              <div className="rounded-2xl border border-violet-100 bg-slate-50/50 p-6 dark:border-violet-500/15 dark:bg-white/[0.02]">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Monthly Posts</h2>
                <PostsPerMonthChart perMonth={data.posts?.perMonth} />
              </div>

              <div className="rounded-2xl border border-amber-100 bg-slate-50/50 p-6 dark:border-amber-500/15 dark:bg-white/[0.02]">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Topics Analytics</h2>
                <TopicsChart topics={data.posts?.topics} />
              </div>
            </div>
          )}

          {/* Writer Layout */}
          {role === USER_ROLE.WRITER && (
            <div className="space-y-6">
              {/* Writer Charts */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-violet-100 bg-slate-50/50 p-6 dark:border-violet-500/15 dark:bg-white/[0.02]">
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Monthly Posts Activity</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Track how many stories you have published month by month.</p>
                  {data.posts?.perMonth && Object.keys(data.posts.perMonth).length > 0 ? (
                    <PostsPerMonthChart perMonth={data.posts.perMonth} />
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-slate-500">No posts written yet. Start your writing journey!</p>
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-amber-100 bg-slate-50/50 p-6 dark:border-amber-500/15 dark:bg-white/[0.02]">
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Topics Analytics</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Explore the frequency of genres and topics you have published.</p>
                  {data.posts?.topics && Object.keys(data.posts.topics).length > 0 ? (
                    <TopicsChart topics={data.posts.topics} />
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-slate-500">No topic data yet. Topics will show here once you publish posts!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Collab Banner */}
              <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 p-8 dark:border-indigo-500/10 dark:from-indigo-500/10 dark:to-purple-500/10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 mb-4 font-bold">
                    <i className="fas fa-users text-xl"></i>
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Real-Time Collab Workspace</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Co-write stories with other authors in real-time! Create or join active collaboration rooms, share live feedback, and brainstorm ideas simultaneously on our interactive writing canvases.
                  </p>
                </div>
                <a
                  href="/collab"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-bold shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] shrink-0"
                >
                  <i className="fas fa-satellite-dish animate-pulse"></i> Open Collab Space
                </a>
              </div>
            </div>
          )}

          {/* Normal User Layout */}
          {role === USER_ROLE.USER && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Creator Card */}
              <div className="rounded-2xl border border-amber-100 bg-slate-50/50 p-8 dark:border-amber-500/10 dark:bg-white/[0.02] flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 mb-4">
                    <i className="fas fa-pen-nib text-xl"></i>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Join our Creator Circle</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                    Have stories you want to share with our global reading community? Apply to become a verified Writer on StorySpark AI to start drafting and publishing your content today!
                  </p>
                </div>
                <a
                  href="/dashboard/profile"
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-lg shadow-amber-500/15 transition-all hover:scale-[1.02]"
                >
                  <i className="fas fa-file-alt"></i> Apply Now
                </a>
              </div>

              {/* Pro Upgrade Card */}
              <div className="rounded-2xl border border-indigo-100 bg-slate-50/50 p-8 dark:border-indigo-500/10 dark:bg-white/[0.02] flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 mb-4">
                    <i className="fas fa-gem text-xl"></i>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Unlock Unlimited Potential</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                    Ready to take your reading and creation to the next tier? Unlock high-capacity premium AI templates, infinite bookmarks, and early access features today.
                  </p>
                </div>
                <a
                  href="/pricing"
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-500/15 transition-all hover:scale-[1.02]"
                >
                  <i className="fas fa-shopping-cart"></i> View Premium Plans
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardComponent;