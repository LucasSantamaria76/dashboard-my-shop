'use client'

import { useShopStore } from '@/store/shopStore'
import { ActionIcon, Box, Button, Flex, Group, NumberInput, Select, Stack, Tooltip } from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconPlus } from '@tabler/icons-react'
import { ImagesDropZone } from '..'
import { useEffect, useState } from 'react'
import { addNewProductToInventorySupabase } from '@/db'
import { notifications } from '@mantine/notifications'
import { supabaseErrors } from '@/constants'
import { validateInventory } from '@/validations'
import { InventoryResponse, ModalFormType } from '@/types/db'
import { useDisclosure } from '@mantine/hooks'
import { FormColors, FormNewSize } from '.'
import { Modal } from '../modals'
import { updateProductToInventorySupabase } from '@/db/updateProductToInventorySupabase'
import { inventoryModelType } from '@/types/producto'
import { removeImgCloudinary } from '@/Cloudinary'

const initialValues = {
	id: '',
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
	inventory?: inventoryModelType
}

export const FormInventory = ({ action, close, productName, inventory }: FormProps) => {
	const updateProduct = useShopStore.use.updateProduct()
	const product = useShopStore.use.products().find((product) => product.name === productName)
	const colors = useShopStore.use.colors()
	const sizes = useShopStore.use.sizes()
	const [images, setImages] = useState<string[]>([])
	const [prevImages, setPrevImages] = useState<string[]>([])
	const [saving, setSaving] = useState<boolean>(false)
	const [openedModal, { open: openModal, close: closeModal }] = useDisclosure(false)
	const [modalForm, setModalForm] = useState<ModalFormType>({ title: '', name: '' })

	const { getInputProps, onSubmit, getValues, setFieldValue, initialize } = useForm<typeof initialValues>({
		mode: 'controlled',
		initialValues: {
			...initialValues,
			product_id: product?.id || '',
		},
		validate: validateInventory,
	})

	useEffect(() => {
		if (action === 'update') {
			initialize({
				id: inventory?.id || '',
				product_id: inventory?.product_id || '',
				primary_color: colors.find((c) => c.name === inventory?.primaryColor.name)?.id || '',
				size: sizes.find((s) => s.name === inventory?.size.name)?.id || '',
				stock: inventory?.stock || 1,
				price: inventory?.price || 0,
				discount: inventory?.discount || 0,
				secondary_color: colors.find((c) => c.name === inventory?.secondaryColor.name)?.id || '',
			})

			setImages(inventory?.images || [])
			setPrevImages(inventory?.images || [])
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [action])

	return (
		<>
			<form
				onSubmit={onSubmit(async (product) => {
					try {
						setSaving(true)
						const res =
							action === 'create'
								? await addNewProductToInventorySupabase({ images, ...product })
								: await updateProductToInventorySupabase({ images, ...product })

						if (res?.ok) {
							updateProduct(res.product!)
							notifications.show({
								title: 'Éxito',
								message: `Producto ${action === 'create' ? 'agregado' : 'actualizado'} correctamente`,
								color: 'green',
							})

							close()
						} else throw res?.error
					} catch (error: any) {
						notifications.show({
							title: 'Error',
							message: supabaseErrors[error?.code || '1'],
							color: 'red',
						})
					} finally {
						setSaving(false)
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
							thousandSeparator=','
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
								{...getInputProps('primary_color')}
								onChange={(value) => {
									setFieldValue('primary_color', value!)
									setFieldValue('secondary_color', value!)
								}}
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
							{...getInputProps('secondary_color')}
						/>
					</Flex>
					{getValues().primary_color && getValues().secondary_color && getValues().size ? (
						<ImagesDropZone images={images} setImages={setImages} />
					) : null}
					<Group justify='flex-end' m='sm'>
						<Button
							variant='default'
							onClick={() => {
								images.forEach(async (el) => !prevImages.includes(el) && (await removeImgCloudinary(el)))

								setImages((current) => (current = prevImages))

								close()
							}}
							disabled={saving}>
							Cancelar
						</Button>
						<Button variant='light' color='green' type='submit' disabled={saving} loading={saving}>
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