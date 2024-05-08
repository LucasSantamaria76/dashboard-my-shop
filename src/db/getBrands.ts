import { supabase } from '@/supabase'
import { BrandType } from '@/types/db'

export const getBrands = async (): Promise<BrandType[] | []> => {
	try {
		const { data: brands } = await supabase.from('brand').select('*').throwOnError()

		return brands || []
	} catch (error) {
		return []
	}
}
