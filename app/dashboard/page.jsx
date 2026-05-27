"use client";
import Navbar from "@/app/components/navbar";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/app/contexts/UserContext";
import Link from "next/link";
import ActivityDashboard from "@/app/components/dashboard/ActivityDashboard";
import Footer from "@/app/components/footer";
import { trackActivity } from "@/lib/activity";

export default function Dashboard() {
  const router = useRouter();
  const { user, loading } = useUser();
  const [modules, setModules] = useState([]);
  const [progress, setProgress] = useState({});
  const [showAllCompleted, setShowAllCompleted] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
    } else {
      fetchModules();
      trackActivity(user.id, "site_visit");
    }
  }, [user, loading]);

  async function fetchModules() {
    const { data: modulesData, error: modulesError } = await supabase
      .from("modules")
      .select("*");

    if (modulesError) {
      console.error(modulesError);
      return;
    }

    const { data: progressData, error: progressError } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", user.id);

    if (progressError) {
      console.error(progressError);
      return;
    }

    const progressMap = {};
    progressData.forEach((item) => {
      progressMap[item.module_id] = {
        is_done: item.is_done,
        updated_at: item.updated_at
      };
    });

    setModules(modulesData);
    setProgress(progressMap);
  }

  return (
    <section className="bg-white dark:bg-neutral-900 min-h-screen">
      <div>
        <Navbar />
      </div>
      <main className="max-w-4xl mx-auto px-4 py-24">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">My Dashboard</h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">Track your learning progress and activity.</p>
        </div>

        {user && (
          <div className="flex justify-start mb-4">
            <div className="bg-gradient-to-br from-primary to-primary-dark shadow-md rounded-full px-6 py-2">
              <span className="text-lg text-white">
              Welcome, {user.user_metadata?.name || user.email.split("@")[0]}
            </span>
            </div>
          </div>
        )}

        {user && (
          <div className="mb-8">
            <ActivityDashboard userId={user.id} />
          </div>
        )}

        <section className="mb-8">
          <h2 className="text-xl text-surface-800 dark:text-surface-200 mb-4">Modules Completed</h2>
          {(() => {
            const completedModules = modules.filter((mod) => progress[mod.id]?.is_done);
            if (completedModules.length > 0) {
              const modulesToShow = showAllCompleted ? completedModules : completedModules.slice(0, 3);
              return (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {modulesToShow.map((mod) => (
                      <div
                        key={mod.id}
                        className="card-surface p-4 flex flex-col justify-between"
                      >
                        <div>
                          <Image
                            src={`/modules/${mod.image}`}
                            alt={mod.title}
                            width={400}
                            height={160}
                            className="w-full h-40 object-cover rounded-md mb-2"
                          />
                          <h3 className="text-md font-semibold text-surface-800 dark:text-surface-200 py-2">{mod.title}</h3>
                          <p className="text-sm text-surface-500 dark:text-surface-400">{mod.description}</p>
                        </div>
                        <div className="mt-2 text-right text-xs flex justify-end">
                          <div className="bg-primary/10 px-2 rounded-full py-1">
                            <p className="text-primary text-xs">Conquered: {new Date(progress[mod.id].updated_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {completedModules.length > 3 && (
                    <div className="flex justify-center mt-8">
                      <button
                        onClick={() => setShowAllCompleted(!showAllCompleted)}
                        className="px-4 py-2 rounded-lg font-medium bg-primary hover:bg-primary-dark text-white shadow-lg transition duration-300"
                      >
                        {showAllCompleted ? "Show Less" : "Load More"}
                      </button>
                    </div>
                  )}
                </>
              );
            } else {
              return (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-surface-500 dark:text-surface-400 mb-4">
                    You haven't completed any modules yet.
                  </p>
                  <Link
                    href="/visualizer"
                    className="group inline-flex items-center gap-2 h-[52px] min-h-[44px] px-8 rounded-full bg-surface-900 dark:bg-white text-white dark:text-surface-900 text-[15px] font-bold hover:bg-primary dark:hover:bg-primary dark:hover:text-white active:scale-95 transition-all duration-200"
                  >
                    Start Learning
                  </Link>
                </div>
              );
            }
          })()}
        </section>
      </main>

      <div>
       <Footer />
      </div>
    </section>
  );
}
