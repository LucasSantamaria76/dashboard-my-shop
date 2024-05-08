import { supabase } from '@/supabase'

export const addNewBrandSupabase = async (name: string, provider_id: string) => {
	try {
		const { data, error } = await supabase.from('brand').insert([{ name, provider_id }]).select('id').single()

		if (error) throw error

		return { id: data?.id, ok: true, error: null }
	} catch (error: any) {
		return { ok: false, error, id: null }
	}
}
