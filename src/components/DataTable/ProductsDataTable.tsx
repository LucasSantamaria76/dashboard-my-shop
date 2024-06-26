'use client'

import { ActionIcon, Box, Button, Center, Flex, Text } from '@mantine/core'
import { IconEdit, IconShirt, IconTrash } from '@tabler/icons-react'
//@ts-ignore
import { MRT_Localization_ES } from 'mantine-react-table/locales/es'
import { type MRT_ColumnDef, MantineReactTable, useMantineReactTable } from 'mantine-react-table'
import { InventoryDataTable } from './InventoryDataTable'
import { useMemo, useState } from 'react'
import { useDisclosure } from '@mantine/hooks'
import { Modal } from '../modals'
import { FormProduct } from '../Forms'
import { deleteByIdSupabase } from '@/db'
import { TABLES } from '@/constants'
import { notifications } from '@mantine/notifications'
import { modals } from '@mantine/modals'
import { useShopStore } from '@/store/shopStore'
import type { productModelType } from '@/types/producto'

export const ProductsDataTable = () => {
	const data = useShopStore.use.products() ?? []
	const deleteById = useShopStore.use.deleteById()
	const [action, setAction] = useState<'create' | 'update'>('create')
	const [productToEdit, setProductToEdit] = useState<productModelType>()
	const [openedModal, { open: openModal, close: closeModal }] = useDisclosure(false)

	const modalConfirmDelete = useMemo(
		() => (id: string) => {
			modals.openConfirmModal({
				title: 'Por favor confirma tu acción',
				children: <Text size='sm'>Confirma el borrado de este producto?</Text>,
				labels: { confirm: 'Confirmar', cancel: 'Cancelar' },
				confirmProps: { color: 'red', variant: 'light' },
				onConfirm: async () => {
					const { ok } = await deleteByIdSupabase({
						id,
						table: TABLES.PRODUCTS,
					})
					if (ok) {
						/*
						 * TODO: eliminar imágenes de cloudinary						*
						 */
						deleteById({ id, table: TABLES.PRODUCTS })
						notifications.show({
							title: '',
							message: 'Producto borrado correctamente',
							color: 'green',
						})
					} else {
						notifications.show({
							title: '',
							message: 'Error al borrar el producto',
							color: 'red',
						})
					}
				},
			})
		},
		[deleteById]
	)

	const columns = useMemo<MRT_ColumnDef<productModelType>[]>(
		() => [
			{
				accessorKey: 'actions',
				header: '',
				size: 100,
				Cell: ({ row }) => (
					<Flex gap='md'>
						<ActionIcon
							color='yellow'
							variant='subtle'
							onClick={() => {
								setProductToEdit(row.original)
								setAction('update')
								openModal()
							}}>
							<IconEdit stroke={0.5} />
						</ActionIcon>
						<ActionIcon color='red' variant='subtle' onClick={() => modalConfirmDelete(row.original.id)}>
							<IconTrash stroke={0.5} />
						</ActionIcon>
					</Flex>
				),
			},
			{
				accessorKey: 'name',
				header: 'Producto',
				enableHiding: false,
				size: 250,
				filterVariant: 'autocomplete',
			},
			{
				accessorKey: 'gender',
				header: 'Género',
			},
			{
				accessorKey: 'brand',
				header: 'Marca',
				accessorFn: (row) => row.brand,
			},
			{
				accessorKey: 'categories',
				header: 'Categoría',
				accessorFn: (row) => row.category?.name,
			},
		],
		[modalConfirmDelete, openModal]
	)

	const table = useMantineReactTable({
		columns,
		data,
		enableGrouping: true,
		positionToolbarDropZone: 'top',
		positionToolbarAlertBanner: 'bottom',
		enableGlobalFilter: false,
		enableColumnPinning: true,
		enableStickyHeader: true,
		localization: MRT_Localization_ES,
		renderEmptyRowsFallback: () => (
			<Center>
				<Text my={40} fw={900} c='cyan.6' size='lg'>
					No hay datos para mostrar
				</Text>
			</Center>
		),
		initialState: {
			columnPinning: {
				left: ['actions', 'name'],
			},
			density: 'xs',
		},
		renderTopToolbarCustomActions: ({ table }) => (
			<Box style={{ display: 'flex', gap: '16px', padding: '4px' }}>
				<Button
					variant='light'
					color='cyan'
					size='xs'
					leftSection={<IconShirt size={18} />}
					onClick={() => {
						setProductToEdit(undefined)
						setAction('create')
						openModal()
					}}>
					Nuevo producto
				</Button>
			</Box>
		),
		renderDetailPanel: ({ row }) => (
			<InventoryDataTable data={row.original.inventory} productName={row.original.name} />
		),
	})

	return (
		<>
			<MantineReactTable table={table} />
			<Modal opened={openedModal} close={closeModal} title={`${action === 'create' ? 'Nuevo' : 'Editar'} producto`}>
				<FormProduct close={closeModal} action={action} product={action === 'update' ? productToEdit : undefined} />
			</Modal>
		</>
	)
}
