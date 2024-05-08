import type { ProfileType } from '@/types';
import { supabase } from '../supabase/client';

const getProfile = async (id: string) => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return profile;
  } catch (error: any) {
    console.log(error);
  }
};

export const getSessionUser = async (): Promise<ProfileType | null> => {
  try {
    const {
      data: { session },
      error
    } = await supabase.auth.getSession();

    if (error) throw error;

    if (!session) return null;
    const user = (await getProfile(session.user.id)) || null;
    return user;
  } catch (error: any) {
    console.error(error);
    return null;
  }
};
