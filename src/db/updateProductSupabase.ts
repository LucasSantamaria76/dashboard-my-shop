import { productDataModel } from '@/data'
import { supabase } from '../supabase/client'
import { GenderType, ProductsType } from '@/types/db'

export const updateProductSupabase = async (dataProduct: ProductsType) => {
	try {
		const { data, error } = await supabase
			.from('products')
			.update({ ...dataProduct })
			.eq('id', dataProduct.id)
			.select(
				`*, products_category_id_fkey(*),
      				products_brand_id_fkey(name),
      				inventory(id, price, stock, discount,images,
        			inventory_primary_color_fkey(name,color),
        			inventory_secondary_color_fkey(name,color),
        			inventory_size_fkey(name,gender,size_guide))`
			)
			.single()

		if (error) throw error

		if (data) {
			//@ts-ignore
			const product = productDataModel(data)
			return { product, ok: true, error: null }
		}

		return null
	} catch (error: any) {
		return { error, ok: false, product: null }
	}
}
