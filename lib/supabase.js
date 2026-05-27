import { createBrowserClient } from "@supabase/ssr";

const SUPABASE_ENV_ERROR =
  "Missing NEXT_PUBLIC_SUPABASE_URL and/or NEXT_PUBLIC_SUPABASE_ANON_KEY. Copy EnvExample.txt to .env.local and add your Supabase project URL and anon key.";

function isValidHttpUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function getSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey || !isValidHttpUrl(supabaseUrl)) {
    return null;
  }

  return { supabaseUrl, supabaseAnonKey };
}

function createMissingQueryBuilder() {
  const result = {
    data: null,
    error: new Error(SUPABASE_ENV_ERROR),
  };

  const builder = {
    then(onFulfilled, onRejected) {
      return Promise.resolve(result).then(onFulfilled, onRejected);
    },
    catch(onRejected) {
      return Promise.resolve(result).catch(onRejected);
    },
    finally(onFinally) {
      return Promise.resolve(result).finally(onFinally);
    },
  };

  return new Proxy(builder, {
    get(target, prop) {
      if (prop in target) return target[prop];
      return () => builder;
    },
  });
}

function createMissingAuthClient() {
  const missing = async () => ({
    data: null,
    error: new Error(SUPABASE_ENV_ERROR),
  });

  return {
    getUser: async () => ({ data: { user: null }, error: new Error(SUPABASE_ENV_ERROR) }),
    getSession: async () => ({ data: { session: null }, error: new Error(SUPABASE_ENV_ERROR) }),
    signOut: missing,
    signInWithOAuth: missing,
    signInWithPassword: missing,
    signUp: missing,
    onAuthStateChange: () => ({
      data: {
        subscription: {
          unsubscribe() {},
        },
      },
    }),
  };
}

function createMissingSupabaseClient() {
  return {
    auth: createMissingAuthClient(),
    from() {
      return createMissingQueryBuilder();
    },
    rpc() {
      return createMissingQueryBuilder();
    },
  };
}

// Singleton browser client — stores the session in cookies (shared with the
// server-side createServerClient) instead of localStorage.
const globalForSupabase = globalThis;

const supabaseConfig = getSupabaseConfig();

export const supabase =
  globalForSupabase.__algobuddySupabase ||
  (supabaseConfig
    ? createBrowserClient(
        supabaseConfig.supabaseUrl,
        supabaseConfig.supabaseAnonKey,
      )
    : createMissingSupabaseClient());

if (process.env.NODE_ENV !== "production") {
  globalForSupabase.__algobuddySupabase = supabase;
}
