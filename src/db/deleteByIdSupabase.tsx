import { supabase } from '@/supabase';

type Props = {
  id: string;
  table: string;
};

export const deleteByIdSupabase = async ({ id, table }: Props) => {
  try {
    //@ts-ignore
    const { error } = await supabase.from(table).delete().eq('id', id)

		if (error) throw error
		return { ok: true, error: null }
  } catch (error: any) {
    console.log(error);
    return { ok: false, error };
  }
};
