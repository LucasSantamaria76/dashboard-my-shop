import { supabase } from '@/supabase'
import { ColorsType } from '@/types/db'

export const getColors = async (): Promise<ColorsType[] | []> => {
	try {
		const { data: colors } = await supabase.from('colors').select('*').order('name').throwOnError()

		return colors || []
	} catch (error) {
		return []
	}
}
