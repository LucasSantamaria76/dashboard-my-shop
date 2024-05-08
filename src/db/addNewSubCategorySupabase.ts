import { supabase } from '../supabase/client';

type subCategoryProps = {
  name: string;
  description?: string;
  category_id: string;
};

export const addNewSubCategorySupabase = async (dataSubCategory: subCategoryProps) => {
  try {
    const { data } = await supabase
      .from('subcategories')
      .insert([{ ...dataSubCategory }])
      .select('category_id')
      .single()
      .throwOnError();

    return data?.category_id;
  } catch (error: any) {
    return error;
  }
};
