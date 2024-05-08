'use client'

import { inventoryModelType } from '@/types/producto'
import { ActionIcon, Box, Button, Flex, Tooltip } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconEdit, IconShirt, IconTrash } from '@tabler/icons-react'
import { MRT_ColumnDef, MantineReactTable, useMantineReactTable } from 'mantine-react-table'
//@ts-ignore
import { MRT_Localization_ES } from 'mantine-react-table/locales/es'
import { useMemo } from 'react'
import { Modal } from '../modals'
import { FormInventory } from '../Forms'

type Props = {
	data: inventoryModelType[]
	productName: string
}

export const InventoryDataTable = ({ data, productName }: Props) => {
	const [opened, { open, close }] = useDisclosure(false)

	const columns = useMemo<MRT_ColumnDef<inventoryModelType>[]>(
		() => [
			{
				accessorKey: 'actions',
				header: '',
				size: 100,
				Cell: () => (
					<Flex gap='md'>
						<Tooltip label='Modificar producto'>
							<ActionIcon color='yellow' variant='subtle'>
								<IconEdit stroke={0.5} />
							</ActionIcon>
						</Tooltip>
						<Tooltip label='Eliminar producto'>
							<ActionIcon color='red' variant='subtle'>
								<IconTrash stroke={0.5} />
							</ActionIcon>
						</Tooltip>
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
		[]
	)

	const table = useMantineReactTable({
		columns,
		data,
		enableGlobalFilter: false,
		enableRowSelection: true,
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
				<Modal opened={opened} close={close} title={`Agregar ${productName} al inventario`}>
					<FormInventory action={'create'} close={close} productName={productName} />
				</Modal>
				<Button variant='light' color='cyan' size='xs' leftSection={<IconShirt size={18} />} onClick={open}>
					Agregar producto al inventario
				</Button>
			</Box>
		),
		mantineTableBodyRowProps: ({ row }) => ({
			onClick: (event) => {
				console.log('hola')
			},
			style: {
				cursor: 'pointer', //you might want to change the cursor too when adding an onClick
			},
		}),
	})

	return <MantineReactTable table={table} />
}
