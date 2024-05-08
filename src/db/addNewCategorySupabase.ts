import { supabase } from '../supabase/client';

type CategoryProps = {
  name: string;
  description?: string;
};

export const addNewCategorySupabase = async (dataCategory: CategoryProps) => {
  try {
    const { data } = await supabase
      .from('categories')
      .insert([{ ...dataCategory }])
      .select('category_id')
      .single()
      .throwOnError();

    return data?.category_id;
  } catch (error: any) {
    return error;
  }
};
