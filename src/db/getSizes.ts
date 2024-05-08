import { supabase } from '@/supabase'
import { SizesType } from '@/types/db'

export const getSizes = async (): Promise<SizesType[] | []> => {
	try {
		const { data: sizes } = await supabase.from('sizes').select('*').throwOnError()

		return sizes || []
	} catch (error) {
		return []
	}
}
