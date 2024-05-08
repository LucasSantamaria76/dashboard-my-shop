'use client'

import { useShopStore } from '@/store/shopStore'
import { ActionIcon, Box, Button, Flex, Group, NumberInput, Select, Stack, Tooltip } from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconPlus } from '@tabler/icons-react'
import { ImagesDropZone } from '..'
import { useState } from 'react'
import { addProductToInventorySupabase } from '@/db'
import { notifications } from '@mantine/notifications'
import { supabaseErrors } from '@/constants'
import { validateInventory } from '@/validations'
import { ModalFormType } from '@/types/db'
import { useDisclosure } from '@mantine/hooks'
import { FormColors, FormNewSize } from '.'
import { Modal } from '../modals'

const initialValues = {
	product_id: '',
	primary_color: '',
	size: '',
	stock: 1,
	price: 0,
	discount: 0,
	secondary_color: '',
}

type FormProps = {
	close: () => void
	action: 'create' | 'update'
	productName: string
}

export const FormInventory = ({ action, close, productName }: FormProps) => {
	const product = useShopStore.use.products().find((product) => product.name === productName)
	const colors = useShopStore.use.colors()
	const sizes = useShopStore.use.sizes()
	const [images, setImages] = useState<string[]>([])
	const [openedModal, { open: openModal, close: closeModal }] = useDisclosure(false)
	const [modalForm, setModalForm] = useState<ModalFormType>({ title: '', name: '' })
	const [imagesToDeleteCloudinary, setImagesToDeleteCloudinary] = useState<string[]>([])

	const { key, getInputProps, onSubmit } = useForm<typeof initialValues>({
		mode: 'uncontrolled',
		initialValues: {
			...initialValues,
			product_id: product?.id || '',
		},
		validate: validateInventory,
	})

	return (
		<>
			<form
				onSubmit={onSubmit(async (product) => {
					if (action === 'create') {
						const { ok, error } = await addProductToInventorySupabase({ images, ...product })

						if (ok) {
							notifications.show({
								title: 'Éxito',
								message: 'Producto agregado correctamente',
								color: 'green',
							})
							close()
						}

						if (error)
							notifications.show({
								title: 'Error',
								message: supabaseErrors[error.code],
								color: 'red',
							})
					} else {
						console.log(product)
					}
				})}>
				<Stack w={{ base: '80vw', sm: 600 }}>
					<Flex justify={'center'} align={'center'} gap={'xs'} wrap={'wrap'}>
						<NumberInput
							data-autofocus
							label='Precio'
							w={{ base: '100%' }}
							withAsterisk
							styles={{
								input: { textAlign: 'right' },
							}}
							hideControls
							min={0}
							clampBehavior='strict'
							prefix='$'
							decimalScale={2}
							fixedDecimalScale
							thousandSeparator=','
							key={key('price')}
							{...getInputProps('price')}
						/>
						<NumberInput
							label='Stock'
							styles={{
								input: { textAlign: 'right' },
							}}
							w={{ base: '100%', xs: '48%' }}
							hideControls
							min={0}
							clampBehavior='strict'
							key={key('stock')}
							{...getInputProps('stock')}
						/>
						<NumberInput
							label='Descuento'
							w={{ base: '100%', xs: '48%' }}
							styles={{
								input: { textAlign: 'right' },
							}}
							suffix='%'
							hideControls
							min={0}
							max={100}
							clampBehavior='strict'
							key={key('discount')}
							{...getInputProps('discount')}
						/>
					</Flex>
					<Flex justify={'center'} align={'center'} gap={'xs'} wrap={'wrap'}>
						<Box pos={'relative'} w={{ base: '100%', xs: '30%' }}>
							<Select
								withAsterisk
								checkIconPosition='right'
								label='Talle'
								w={'100%'}
								data={sizes
									.filter((size) => size.gender === product?.gender)
									.map((size) => ({
										value: size.id,
										label: size.name,
									}))}
								key={key('size')}
								{...getInputProps('size')}
							/>
							<Tooltip label='Añadir nuevo talle'>
								<ActionIcon
									variant='light'
									size='xs'
									pos={'absolute'}
									top={4}
									left={45}
									onClick={() => {
										setModalForm((current) => (current = { title: 'Nuevo talle', name: 'sizes' }))
										openModal()
									}}>
									<IconPlus stroke={1} />
								</ActionIcon>
							</Tooltip>
						</Box>
						<Box w={{ base: '100%', xs: '34%' }} pos={'relative'}>
							<Select
								withAsterisk
								checkIconPosition='right'
								label='Color primario'
								data={colors.map((color) => ({
									value: color.id,
									label: color.name,
								}))}
								w={'100%'}
								key={key('primary_color')}
								{...getInputProps('primary_color')}
							/>
							<Tooltip label='Añadir nuevo color'>
								<ActionIcon
									variant='light'
									size='xs'
									pos={'absolute'}
									top={4}
									left={110}
									onClick={() => {
										setModalForm((current) => (current = { title: 'Nuevo color', name: 'colors' }))
										openModal()
									}}>
									<IconPlus stroke={1} />
								</ActionIcon>
							</Tooltip>
						</Box>
						<Select
							withAsterisk
							checkIconPosition='right'
							label='Color secundario'
							data={colors.map((color) => ({
								value: color.id,
								label: color.name,
							}))}
							w={{ base: '100%', xs: '30%' }}
							key={key('secondary_color')}
							{...getInputProps('secondary_color')}
						/>
					</Flex>
					<ImagesDropZone images={images} setImages={setImages} id={product?.id || ''} />
					<Group justify='flex-end' m='sm'>
						<Button variant='default' onClick={close}>
							Cancelar
						</Button>
						<Button variant='light' color='green' type='submit'>
							Guardar
						</Button>
					</Group>
				</Stack>
			</form>
			<Modal opened={openedModal} close={closeModal} title={modalForm.title}>
				{modalForm.name === 'sizes' && <FormNewSize close={closeModal} />}
				{modalForm.name === 'colors' && <FormColors close={closeModal} />}
			</Modal>
		</>
	)
}
