import { supabase } from '@/supabase'
import { GenderType } from '@/types/db'

type SizeProps = {
	name: string
	gender: GenderType
	size_guide: string
}

export const addNewSizeSupabase = async (dataSize: SizeProps) => {
	try {
		const { data, error } = await supabase
			.from('sizes')
			.insert([{ ...dataSize }])
			.select('id')
			.single()

		if (error) throw error

		return { id: data?.id, ok: true, error: null }
	} catch (error: any) {
		return { ok: false, error, id: null }
	}
}
