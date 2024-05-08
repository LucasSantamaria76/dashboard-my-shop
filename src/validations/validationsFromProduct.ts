import { isNotEmpty } from '@mantine/form'

export const validateProduct = {
	name: isNotEmpty('El nombre del producto es requerido'),
	gender: isNotEmpty('El género es requerido'),
	brand_id: isNotEmpty('La marca es requerida'),
	category_id: isNotEmpty('La marca es requerida'),
}

export const validateInventory = {
	price: isNotEmpty('El precio del producto es requerido'),
	size: isNotEmpty('El talle es requerido'),
	primary_color: isNotEmpty('El color primario es requerido'),
	secondary_color: isNotEmpty('El color secundario es requerido'),
}
