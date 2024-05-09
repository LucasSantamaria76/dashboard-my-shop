import { upperFirst } from '@mantine/hooks'
import { supabase } from '../supabase/client'

type CategoryProps = {
	name: string
	description?: string
	parentData: string
}

export const addNewCategorySupabase = async ({ parentData, name, ...restCategory }: CategoryProps) => {
	try {
		const parent: string[] = parentData.split(',').map((item) => item.trim())
		const { data, error } = await supabase
			.from('categories')
			.insert([{ ...restCategory, parent, name: upperFirst(name) }])
			.select('*')
			.single()

		if (error) throw error

		return { data, ok: true, error: null }
	} catch (error: any) {
		return { ok: false, error, data: null }
	}
}
