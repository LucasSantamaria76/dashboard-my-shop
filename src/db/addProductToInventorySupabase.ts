import { cloudinary } from '@/Cloudinary'
import { supabase } from '@/supabase'
import { promises } from 'dns'

interface Props {
	product_id: string
	primary_color: string
	secondary_color: string
	size: string
	stock: number
	price: number
	discount: number
	images: string[]
}

export const addProductToInventorySupabase = async (product: Props) => {
	try {
		const { error } = await supabase.from('inventory').insert([{ ...product }])

		if (error) return { ok: false, error }

		return { ok: true, error: null }
	} catch (error: any) {
		console.error(error)
		return { ok: false, error }
	}
}
