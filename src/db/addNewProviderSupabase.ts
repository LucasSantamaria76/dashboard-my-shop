import { supabase } from '@/supabase'

type ProviderProps = {
	name: string
	address?: string
	city?: string
	phone?: string
	province?: string
}

export const addNewProviderSupabase = async (dataProvider: ProviderProps) => {
	try {
		const { data, error } = await supabase
			.from('providers')
			.insert([{ ...dataProvider }])
			.select('id')
			.single()

		if (error) throw error

		return { id: data?.id, ok: true, error: null }
	} catch (error: any) {
		return { ok: false, error, id: null }
	}
}
