import { productDataModel } from '@/data'
import { getProducts } from './getProducts'
import { productModelType } from '@/types/producto'

export const getModelProducts = async (): Promise<productModelType[] | []> => {
	const data = await getProducts()
	if (data) {
		const products = data?.map(productDataModel)
		return products || []
	}
	return []
}
