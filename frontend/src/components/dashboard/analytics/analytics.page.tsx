import { useGetDashboardAnalysisQuery } from "../../../redux/apis/analysis.api";
import DashboardAnalysisHeader from "../dashboard_analysis_header";
import LoadingAnimation from "../../loading/loading.component";
import TopicsChart from "../../chart/dashboard/bar_chart";
import SubscriptionChart from "../../chart/dashboard/doughnut_chart";
import PostsPerMonthChart from "../../chart/dashboard/line_chart";
import UsersPieChart from "../../chart/dashboard/pai_chart";

const AnalyticsPage = () => {
  const { data, isLoading } = useGetDashboardAnalysisQuery(undefined);

  if (isLoading) return <LoadingAnimation />;

  if (!data) {
    return (
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl p-20 text-center shadow-2xl">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-500/8 border border-blue-500/15">
          <i className="fas fa-chart-line text-3xl text-blue-400"></i>
        </div>
        <h2 className="text-3xl font-black text-white mb-3 tracking-tight">
          Analytics Not Available
        </h2>
        <p className="mx-auto max-w-xl text-slate-400 leading-relaxed">
          Dashboard insights are currently unavailable. Once data becomes
          available, charts and platform analytics will automatically appear
          here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Analysis Header — stat cards */}
      <DashboardAnalysisHeader data={data} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {[
          {
            title: "Users Distribution",
            subtitle: "Active vs inactive breakdown",
            icon: "fa-users",
            iconColor: "text-blue-400",
            iconBg: "bg-blue-500/10",
            border: "border-blue-500/15",
            chart: <UsersPieChart data={data.users} />,
          },
          {
            title: "Subscription Overview",
            subtitle: "Free, Pro & Premium tiers",
            icon: "fa-credit-card",
            iconColor: "text-emerald-400",
            iconBg: "bg-emerald-500/10",
            border: "border-emerald-500/15",
            chart: <SubscriptionChart data={data.subscriptionTypes} />,
          },
          {
            title: "Monthly Posts",
            subtitle: "Publication trends over time",
            icon: "fa-chart-line",
            iconColor: "text-violet-400",
            iconBg: "bg-violet-500/10",
            border: "border-violet-500/15",
            chart: <PostsPerMonthChart perMonth={data.posts.perMonth} />,
          },
          {
            title: "Topics Analytics",
            subtitle: "Content distribution by category",
            icon: "fa-tags",
            iconColor: "text-amber-400",
            iconBg: "bg-amber-500/10",
            border: "border-amber-500/15",
            chart: <TopicsChart topics={data.posts.topics} />,
          },
        ].map((card) => (
          <div
            key={card.title}
            className={`group rounded-2xl border ${card.border} bg-white/[0.02] backdrop-blur-xl p-6 shadow-xl hover:bg-white/[0.03] transition-all duration-300`}
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className={`flex items-center justify-center w-9 h-9 rounded-xl ${card.iconBg} border border-white/[0.06]`}
              >
                <i className={`fas ${card.icon} ${card.iconColor} text-sm`}></i>
              </div>
              <div>
                <h2 className="text-base font-bold text-white leading-none mb-0.5">
                  {card.title}
                </h2>
                <p className="text-[11px] text-slate-500">{card.subtitle}</p>
              </div>
            </div>
            {card.chart}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsPage;
