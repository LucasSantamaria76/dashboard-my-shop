import { supabase } from '@/supabase'
import { QueryData } from '@supabase/supabase-js'

export const getProductById = async (id: string) => {
	try {
		const productQuery = supabase
			.from('products')
			.select(
				`*,
		products_category_id_fkey(*),
		products_brand_id_fkey(name),
		inventory(*, inventory_primary_color_fkey(name,color),
			inventory_secondary_color_fkey(name,color),
			inventory_size_fkey(name,gender,size_guide))`
			)
			.eq('id', id)
			.single()

		type TProductQuery = QueryData<typeof productQuery>

		const { data, error } = await productQuery

		if (error) throw error

		const product: TProductQuery = data

		return product!
	} catch (error: any) {
		console.log(error)
		return error
	}
}
