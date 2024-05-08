import { supabase } from '@/supabase';

type Props = {
  id: string;
  table: string;
};

const ID = {
  products: 'product_id',
  brands: 'brand_id',
  categories: 'category_id',
  subcategories: 'subcategory_id',
  providers: 'provider_id',
  colors: 'color_id',
  sizes: 'size_id',
  inventory: 'inventory_id'
};

export const deleteByIdSupabase = async ({ id, table }: Props) => {
  try {
    //@ts-ignore
    const { error } = await supabase.from(table).delete().eq(ID[table], id);

    if (error) throw error;
    return { ok: true };
  } catch (error: any) {
    console.log(error);
    return { ok: false, error };
  }
};
