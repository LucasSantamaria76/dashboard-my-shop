'use client'

import { inventoryModelType } from '@/types/producto'
import { ActionIcon, Box, Button, Flex, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconEdit, IconShirt, IconTrash } from '@tabler/icons-react'
import { MRT_ColumnDef, MantineReactTable, useMantineReactTable } from 'mantine-react-table'
//@ts-ignore
import { MRT_Localization_ES } from 'mantine-react-table/locales/es'
import { useMemo, useState } from 'react'
import { Modal } from '../modals'
import { FormInventory } from '../Forms'
import { useShopStore } from '@/store/shopStore'
import { modals } from '@mantine/modals'
import { deleteByIdSupabase } from '@/db'
import { TABLES } from '@/constants'
import { notifications } from '@mantine/notifications'
import { removeImgCloudinary } from '@/Cloudinary'

type Props = {
	data: inventoryModelType[]
	productName: string
}

export const InventoryDataTable = ({ data, productName }: Props) => {
	const deleteFromInventory = useShopStore.use.deleteFromInventory()
	const [action, setAction] = useState<'create' | 'update'>('create')
	const [inventoryToEdit, setInventoryToEdit] = useState<inventoryModelType>()
	const [opened, { open, close }] = useDisclosure(false)

	const modalConfirmDelete = useMemo(
		() => (id: string, product_id: string, images: string[]) => {
			modals.openConfirmModal({
				title: 'Por favor confirma tu acción',
				children: <Text size='sm'>Confirma el borrado del inventario de este producto?</Text>,
				labels: { confirm: 'Confirmar', cancel: 'Cancelar' },
				confirmProps: { color: 'red', variant: 'light' },
				onConfirm: async () => {
					const { ok } = await deleteByIdSupabase({
						id,
						table: TABLES.INVENTORY,
					})
					if (ok) {
						images.forEach(async (publicId) => await removeImgCloudinary(publicId))
						deleteFromInventory({ id, product_id })
						notifications.show({
							title: '',
							message: 'Producto borrado del inventario correctamente',
							color: 'green',
						})
					} else {
						notifications.show({
							title: '',
							message: 'Error al borrar el producto del inventario',
							color: 'red',
						})
					}
				},
			})
		},
		[deleteFromInventory]
	)

	const columns = useMemo<MRT_ColumnDef<inventoryModelType>[]>(
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
								setInventoryToEdit(row.original)
								setAction('update')
								open()
							}}>
							<IconEdit stroke={0.5} />
						</ActionIcon>
						<ActionIcon
							color='red'
							variant='subtle'
							onClick={() => modalConfirmDelete(row.original.id, row.original.product_id, row.original.images)}>
							<IconTrash stroke={0.5} />
						</ActionIcon>
					</Flex>
				),
			},
			{
				accessorKey: 'stock',
				header: 'Stock',
				mantineTableBodyCellProps: {
					align: 'center',
				},
			},
			{
				accessorKey: 'size',
				header: 'Talle',
				accessorFn: (row) => `${row.size.name}`,
			},
			{
				accessorKey: 'primaryColor',
				accessorFn: (row) => `${row.primaryColor.name}`,
				header: 'Color primario',
			},
			{
				accessorKey: 'secondaryColor',
				header: 'Color secundario',
				accessorFn: (row) => `${row.secondaryColor.name}`,
			},
			{
				accessorKey: 'price',
				header: 'Precio',
			},
			{
				accessorKey: 'discount',
				header: 'Descuento',
			},
		],
		[modalConfirmDelete, open]
	)

	const table = useMantineReactTable({
		columns,
		data,
		enableGlobalFilter: false,
		enableColumnPinning: true,
		enableGrouping: true,
		positionToolbarDropZone: 'top',
		positionToolbarAlertBanner: 'bottom',
		localization: MRT_Localization_ES,
		initialState: {
			columnPinning: {
				left: ['name'],
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
						setInventoryToEdit(undefined)
						setAction('create')
						open()
					}}>
					Agregar producto al inventario
				</Button>
			</Box>
		),
	})

	return (
		<>
			<MantineReactTable table={table} />
			<Modal
				opened={opened}
				close={close}
				title={`${action === 'create' ? 'Agregar' : 'Editando'} ${productName} ${
					action === 'create' ? 'al inventario' : 'del inventario'
				}`}>
				<FormInventory action={'create'} close={close} productName={productName} />
			</Modal>
		</>
	)
}
