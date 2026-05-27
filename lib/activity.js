import { supabase } from "@/lib/supabase";

const trackActivity = async (userId, type = "site_visit") => {
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("user_activity")
    .select("id")
    .eq("user_id", userId)
    .eq("activity_date", today);

  if (!error && data.length === 0) {
    await supabase.from("user_activity").insert([
      { user_id: userId, activity_date: today, type }
    ]);
  }
};

export { trackActivity };