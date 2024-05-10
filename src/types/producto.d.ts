import { GenderType } from './db'

export type inventoryModelType = {
	id: string
	price: number
	stock: number
	images: string[] | []
	discount: number | null
	product_id: string
	size: {
		name: string
		gender: string
		size_guide: string
	}
	primaryColor: {
		name: string
		color: string
	}
	secondaryColor: {
		name: string
		color: string
	}
}

export type productModelType = {
	id: string
	name: string
	description: string
	gender: GenderType
	created_at: string
	slug: string
	feature: string[] | null | undefined
	category:
		| {
				id: string
				name: string
				description: string
				parent: string
		  }
		| null
		| undefined
	brand: string | null
	brand_id: string
	category_id: string
	inventory: inventoryModelType[] | []
}
