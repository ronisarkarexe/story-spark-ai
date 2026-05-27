import { supabase } from '../lib/supabase'

export async function getToken() {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session?.access_token || null
}