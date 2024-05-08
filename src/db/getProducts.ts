import { supabase } from '@/supabase'
import { QueryData } from '@supabase/supabase-js'

export const getProducts = async () => {
	try {
		const productsQuery = supabase.from('products').select(`id, name, description, gender, created_at, slug, feature,
		products_category_id_fkey(*),
		products_brand_id_fkey(name),
		inventory(id, price, stock, discount,images,
			inventory_primary_color_fkey(name,color),
			inventory_secondary_color_fkey(name,color),
			inventory_size_fkey(name,gender,size_guide))`)

		type TProductsQuery = QueryData<typeof productsQuery>

		const { data, error } = await productsQuery

		if (error) throw error

		const products: TProductsQuery = data

		return products!
	} catch (error: any) {
		console.log(error)
		return error
	}
}
