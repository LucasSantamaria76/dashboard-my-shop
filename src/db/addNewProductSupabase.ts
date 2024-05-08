import { supabase } from '../supabase/client'
import { productDataModel } from '@/data'
import { GenderType } from '@/types/db'

type ProductProps = {
	name: string
	description: string
	gender: GenderType
	category_id: string
	brand_id: string
	feature: string[]
}

export const addNewProductSupabase = async (dataProduct: ProductProps) => {
	try {
		const slug = dataProduct.name.replace(/ /g, '_').toLowerCase()

		const { data, error } = await supabase
			.from('products')
			.insert([{ ...dataProduct, slug }])
			.select(
				`id, name, description, gender, created_at, slug, feature,
      products_category_id_fkey(*),
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
