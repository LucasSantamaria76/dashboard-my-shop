import { supabase } from '@/supabase'

type ColorProps = {
	name: string
	color: string
}

export const addNewColorSupabase = async (dataColor: ColorProps) => {
	try {
		const { data, error } = await supabase
			.from('colors')
			.insert([{ ...dataColor }])
			.select('id')
			.single()

		if (error) throw error

		return { id: data?.id, ok: true, error: null }
	} catch (error: any) {
		return { ok: false, error, id: null }
	}
}
