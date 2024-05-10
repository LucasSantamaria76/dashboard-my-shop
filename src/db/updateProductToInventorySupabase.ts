import { supabase } from '@/supabase'
import { getProductById } from '.'
import { productDataModel } from '@/data'

interface Props {
	id: string
	product_id: string
	primary_color: string
	secondary_color: string
	size: string
	stock: number
	price: number
	discount: number
	images: string[]
}

export const updateProductToInventorySupabase = async ({ id, ...restProduct }: Props) => {
	try {
		const { error } = await supabase
			.from('inventory')
			.update({ ...restProduct })
			.eq('id', id)

		if (error) return { ok: false, error }

		const product = productDataModel(await getProductById(restProduct.product_id))

		return { product, ok: true, error: null }
	} catch (error: any) {
		console.error(error)
		return { error, ok: false, product: null }
	}
}
