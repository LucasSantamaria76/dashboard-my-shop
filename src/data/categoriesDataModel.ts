import { categoriesModelType } from '@/types/categories'
import { CategoriesType } from '../types/db'

export const productDataModel = (data: CategoriesType): categoriesModelType => ({
	id: data.id,
	name: data.name,
	description: data.description || '',
	parent: data.parent || '',
})
