import { supabase } from '@/supabase'
import { ProvidersType } from '@/types/db'

export const getProviders = async (): Promise<ProvidersType[] | []> => {
	try {
		const { data: providers } = await supabase.from('providers').select('*').throwOnError()

		return providers || []
	} catch (error) {
		return []
	}
}
