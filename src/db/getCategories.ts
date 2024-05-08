import { supabase } from '@/supabase'
import { CategoriesType } from '@/types/db'
import { QueryData } from '@supabase/supabase-js'

export const getCategories = async (): Promise<CategoriesType[] | []> => {
	try {
		const categoriesQuery = supabase.from('categories').select('*')

		type TCategoriesQuery = QueryData<typeof categoriesQuery>

		const { data, error } = await categoriesQuery

		if (error) throw error

		const categories: TCategoriesQuery = data

		/* const categories = categoriesData?.map(async (category) => {
			const route = []
			if (category.parent) {
				const parent = await supabase.from('categories').select('*').eq('id', category.parent).single()

			}
		}, []) */

		return categories || []
	} catch (error) {
		return []
	}
}
