import { ProductsResponse } from '@/types/db'
import { productModelType } from '@/types/producto'

export const productDataModel = (data: ProductsResponse): productModelType => ({
	id: data.id,
	name: data.name,
	description: data.description || '',
	gender: data.gender,
	created_at: data.created_at,
	slug: data.slug,
	feature: data.feature,
	category:
		{
			id: data.products_category_id_fkey?.id || '',
			name: data.products_category_id_fkey?.name || '',
			description: data.products_category_id_fkey?.description || '',
			parent: data.products_category_id_fkey?.parent || '',
		} || null,
	brand: data.products_brand_id_fkey?.name || '',
	brand_id: data?.brand_id || '',
	category_id: data?.category_id || '',
	inventory:
		data.inventory.map((item) => ({
			id: item.id,
			price: item.price,
			stock: item.stock,
			images: item.images || [],
			discount: item.discount || null,
			product_id: item.product_id,
			size: {
				name: item.inventory_size_fkey?.name || '',
				gender: item.inventory_size_fkey?.gender || '',
				size_guide: item.inventory_size_fkey?.size_guide || '',
			},
			primaryColor: {
				name: item.inventory_primary_color_fkey?.name || '',
				color: item.inventory_primary_color_fkey?.color || '',
			},
			secondaryColor: {
				name: item.inventory_secondary_color_fkey?.name || '',
				color: item.inventory_secondary_color_fkey?.color || '',
			},
		})) || [],
})
