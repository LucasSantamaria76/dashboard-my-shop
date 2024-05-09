'use client'

import { create } from 'zustand'

import { createSelectors } from './createSelectors'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { BrandType, CategoriesType, ColorsType, ProvidersType, SizesType } from '@/types/db'
import { productModelType } from '@/types/producto'

interface State {
	//user: ProfileType | null;
	products: productModelType[] | []
	brands: BrandType[] | []
	categories: CategoriesType[] | []
	providers: ProvidersType[] | []
	colors: ColorsType[] | []
	sizes: SizesType[] | []
}

interface Actions {
	//setUser: (user: ProfileType | null) => void;
	setProducts: (products: productModelType[] | []) => void
	setBrands: (brands: BrandType[] | []) => void
	setCategories: (categories: CategoriesType[] | []) => void
	setProviders: (providers: ProvidersType[] | []) => void
	setColors: (colors: ColorsType[] | []) => void
	setSizes: (sizes: SizesType[] | []) => void

	addNewBrand: (brand: BrandType) => void
	addNewProvider: (provider: ProvidersType) => void
	addNewCategory: (category: CategoriesType) => void
	addNewProduct: (product: productModelType) => void
	addNewSize: (size: SizesType) => void
	addNewColor: (color: ColorsType) => void

	updateProduct: (product: productModelType) => void

	deleteById: ({ id, table }: { id: string; table: string }) => void
}

const INITIAL_STATE: State = {
	//user: null,
	products: [],
	brands: [],
	categories: [],
	providers: [],
	colors: [],
	sizes: [],
}

const useShopStoreBase = create<State & Actions>()(
	devtools(
		immer((set, get) => ({
			...INITIAL_STATE,

			//setUser: (user: ProfileType | null) => set({ user }),

			setProducts: (products: productModelType[] | []) => set({ products }),

			setBrands: (brands: BrandType[] | []) => set({ brands }),

			setCategories: (categories: CategoriesType[] | []) => set({ categories }),

			setProviders: (providers: ProvidersType[] | []) => set({ providers }),

			setColors: (colors: ColorsType[] | []) => set({ colors }),

			setSizes: (sizes: SizesType[] | []) => set({ sizes }),

			addNewBrand: (brand: BrandType) => set((state) => ({ brands: [...state.brands, brand] })),

			addNewProvider: (provider: ProvidersType) => set((state) => ({ providers: [...state.providers, provider] })),

			addNewCategory: (category: CategoriesType) => set((state) => ({ categories: [...state.categories, category] })),

			addNewProduct: (product: productModelType) => set((state) => ({ products: [...state.products, product] })),

			addNewSize: (size: SizesType) => set((state) => ({ sizes: [...state.sizes, size] })),

			addNewColor: (color: ColorsType) => set((state) => ({ colors: [...state.colors, color] })),

			updateProduct: (product: productModelType) =>
				set((state) => ({
					products: state.products.map((item) => (item.id === product.id ? product : item)),
				})),

			deleteById: ({ id, table }: { id: string; table: string }) =>
				set((state) => ({
					//@ts-ignore
					[table]: state[table].filter((item: unknown) => item.id !== id),
				})),
		}))
	)
)

export const useShopStore = createSelectors(useShopStoreBase)
