import type { Tables, Enums } from './supabase'
/* import { loginSchema, registerSchema } from "@/validations";
import { z } from "zod";

export type LoginType = z.infer<typeof loginSchema>;

export type LogupType = z.infer<typeof registerSchema>; */

//Database
let brand: Tables<'brand'>
export type BrandType = typeof brand

let categories: Tables<'categories'>
export type CategoriesType = typeof categories

let colors: Tables<'colors'>
export type ColorsType = typeof colors

let providers: Tables<'providers'>
export type ProvidersType = typeof providers

let sizes: Tables<'sizes'>
export type SizesType = typeof sizes

let products: Tables<'products'>
export type ProductsType = typeof products

let inventory: Tables<'inventory'>
export type InventoryType = typeof inventory

let gender: Enums<'gender_type'>
export type GenderType = typeof gender
/*
let profile: Tables<'profiles'>;
export type ProfileType = typeof profile;

let cart_items: Tables<"cart_items">;
export type CartItemsType = typeof cart_items;

let carts: Tables<"carts">;
export type CartsType = typeof carts;




let order_items: Tables<"order_items">;
export type Order_itemsType = typeof order_items;

let orders: Tables<"orders">;
export type OrdersType = typeof orders;


*/

//Responses

export interface InventoryResponse {
	id: string
	price: number
	stock: number
	images: string[]
	discount: number | null
	product_id: string
	inventory_size_fkey: {
		name: string
		gender: string
		size_guide: string
	} | null
	inventory_primary_color_fkey: {
		name: string
		color: string
	} | null
	inventory_secondary_color_fkey: {
		name: string
		color: string
	} | null
}

export interface ProductsResponse {
	id: string
	name: string
	description: string | null
	gender: GenderType
	created_at: string
	slug: string
	feature: string[] | null
	brand_id: string
	category_id: string
	products_category_id_fkey: {
		id: string
		name: string
		description: string | null
		parent: string | null
	} | null
	products_brand_id_fkey: {
		id: string
		name: string
		provider_id: string
	} | null
	inventory: InventoryResponse[]
}

export type ModalFormType = {
	title: string
	name: string
}
