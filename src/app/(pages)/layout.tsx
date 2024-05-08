'use client'

import { useEffect } from 'react'
import { useShopStore } from '@/store/shopStore'
/* 
import { registerLicense } from '@syncfusion/ej2-base'; */

import { supabase } from '@/supabase'
import { getBrands, getCategories, getColors, getModelProducts, getProviders, getSizes } from '@/db'

// Registering Syncfusion license key
//registerLicense(process.env.NEXT_PUBLIC_SYNCFUSION_LICENSE_KEY!);

export default function PagesLayout({ children }: { children: React.ReactNode }) {
	const setProducts = useShopStore.use.setProducts()
	const setCategories = useShopStore.use.setCategories()
	const setBrands = useShopStore.use.setBrands()
	const setProviders = useShopStore.use.setProviders()
	const setColors = useShopStore.use.setColors()
	const setSizes = useShopStore.use.setSizes()

	useEffect(() => {
		getModelProducts().then(setProducts)
		getCategories().then(setCategories)
		getBrands().then(setBrands)
		getProviders().then(setProviders)
		getColors().then(setColors)
		getSizes().then(setSizes)

		const channels = supabase
			.channel('custom-filter-channel')
			.on('postgres_changes', { event: '*', schema: 'public', table: 'inventory' }, () => {
				getModelProducts().then(setProducts)
			})
			.on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
				getModelProducts().then(setProducts)
			})
			.subscribe()
	}, [setBrands, setCategories, setColors, setProducts, setProviders, setSizes])

	return <>{children}</>
}
