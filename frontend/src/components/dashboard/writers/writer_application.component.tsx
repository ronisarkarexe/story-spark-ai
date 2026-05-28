import { useState } from "react";
import {
  useGetAllWriterApplicationsQuery,
  useUpdateWriterApplicationStatusMutation,
} from "../../../redux/apis/writer_application.api";
import LoadingAnimation from "../../loading/loading.component";
import toast, { Toaster } from "react-hot-toast";

type WriterApplication = {
  _id: string;
  status: "pending" | "approved" | "rejected";
  portfolioLink: string;
  reason: string;
  createdAt: string;
  user?: {
    name?: string;
    email?: string;
    profile?: { avatar?: string };
  };
};

const WriterApplicationComponent = () => {
  const { data, isLoading, refetch } = useGetAllWriterApplicationsQuery(undefined);
  const [updateStatus, { isLoading: isUpdating }] = useUpdateWriterApplicationStatusMutation();
  const [processingId, setProcessingId] = useState<string | null>(null);

  if (isLoading) {
    return <LoadingAnimation />;
  }

  const handleAction = async (id: string, status: "approved" | "rejected") => {
    setProcessingId(id);
    try {
      await updateStatus({ id, status }).unwrap();
      toast.success(`Application ${status} successfully.`);
      refetch();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update application status";
      toast.error(message);
    } finally {
      setProcessingId(null);
    }
  };

  const applications = (data?.data ?? []) as WriterApplication[];
  const pendingApps = applications.filter((app) => app.status === "pending");
  const processedApps = applications.filter((app) => app.status !== "pending");

  return (
    <div className="space-y-8">
      <Toaster position="top-right" reverseOrder={false} />
      
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Writer Applications</h2>
        <p className="text-slate-600 dark:text-slate-400">Review and manage user requests to become writers.</p>
      </div>

      {/* Pending Applications */}
      <div className="bg-slate-50 border border-slate-200 dark:bg-white/[0.02] dark:border-white/[0.06] rounded-xl overflow-hidden shadow-lg">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-white/[0.06] bg-blue-50/70 dark:bg-blue-500/10">
          <h3 className="text-xl font-semibold text-slate-800 dark:text-white">
            Pending Review ({pendingApps.length})
          </h3>
        </div>
        
        {pendingApps.length === 0 ? (
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700/30 text-slate-400 dark:text-slate-500 mb-4">
              <i className="fas fa-inbox text-2xl"></i>
            </div>
            <p className="text-slate-600 dark:text-slate-400">No pending applications.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-white/[0.06]">
            {pendingApps.map((app) => (
              <div key={app._id} className="p-6 transition hover:bg-slate-100/50 dark:hover:bg-white/[0.02] flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <img 
                      src={app.user?.profile?.avatar || `https://ui-avatars.com/api/?name=${app.user?.name}&background=random`} 
                      alt={app.user?.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="text-lg font-bold text-slate-800 dark:text-white">{app.user?.name}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{app.user?.email}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 bg-slate-100 p-4 rounded-lg border border-slate-200 dark:bg-white/[0.02] dark:border-white/[0.06]">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Portfolio Link:</p>
                    <a 
                      href={app.portfolioLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 text-sm break-all flex items-center gap-2 mb-4"
                    >
                      <i className="fas fa-external-link-alt text-xs"></i>
                      {app.portfolioLink}
                    </a>
                    
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Reason for applying:</p>
                    <p className="text-slate-600 dark:text-slate-400 text-sm whitespace-pre-wrap">{app.reason}</p>
                  </div>
                </div>
                
                <div className="flex md:flex-col gap-3 justify-end items-end min-w-[140px]">
                  <p className="text-xs text-slate-500 w-full text-right mb-2">
                    Applied on: <br/>{new Date(app.createdAt).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => handleAction(app._id, "approved")}
                    disabled={isUpdating && processingId === app._id}
                    className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-600 border border-emerald-200 dark:bg-emerald-600/20 dark:hover:bg-emerald-600/30 dark:text-emerald-400 dark:border-emerald-600/30 rounded-lg text-sm font-medium transition w-full disabled:opacity-50"
                  >
                    {isUpdating && processingId === app._id ? "Processing..." : "Approve"}
                  </button>
                  <button
                    onClick={() => handleAction(app._id, "rejected")}
                    disabled={isUpdating && processingId === app._id}
                    className="px-4 py-2 bg-red-50 hover:bg-red-100/80 text-red-600 border border-red-200 dark:bg-red-600/20 dark:hover:bg-red-600/30 dark:text-red-400 dark:border-red-600/30 rounded-lg text-sm font-medium transition w-full disabled:opacity-50"
                  >
                    {isUpdating && processingId === app._id ? "Processing..." : "Reject"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Processed Applications (History) */}
      <div className="bg-slate-50 border border-slate-200 dark:bg-white/[0.02] dark:border-white/[0.06] rounded-xl overflow-hidden shadow-lg mt-8">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-white/[0.06] bg-blue-50/70 dark:bg-blue-500/10">
          <h3 className="text-xl font-semibold text-slate-800 dark:text-white">
            Application History ({processedApps.length})
          </h3>
        </div>
        
        {processedApps.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-slate-500">No history available.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-500 dark:text-slate-400">
              <thead className="text-xs uppercase bg-slate-100 dark:bg-white/[0.03] text-slate-655 dark:text-slate-500">
                <tr>
                  <th scope="col" className="px-6 py-3">Applicant</th>
                  <th scope="col" className="px-6 py-3">Date</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {processedApps.map((app) => (
                  <tr key={app._id} className="border-b border-slate-200 dark:border-white/[0.06] bg-transparent hover:bg-slate-100/50 dark:hover:bg-white/[0.02]">
                    <td className="px-6 py-4 font-medium text-slate-800 dark:text-white whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img 
                          src={app.user?.profile?.avatar || `https://ui-avatars.com/api/?name=${app.user?.name}&background=random`} 
                          alt={app.user?.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm">{app.user?.name}</p>
                          <p className="text-xs text-slate-500">{app.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        app.status === "approved" 
                          ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20" 
                          : "bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20"
                      }`}>
                        {app.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default WriterApplicationComponent;