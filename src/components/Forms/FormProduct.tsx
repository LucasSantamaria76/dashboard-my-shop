'use client'

import { useShopStore } from '@/store/shopStore'
import type { ProductsType } from '@/types/db'
import { validateProduct } from '@/validations'
import {
	Select,
	SimpleGrid,
	Stack,
	TextInput,
	Textarea,
	Button,
	Flex,
	Tooltip,
	Group,
	ActionIcon,
	List,
	Text,
	Box,
	DEFAULT_THEME,
	Grid,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { useEffect, useState } from 'react'
import { Modal } from '../modals'
import { FormBrand, FormCategory } from '.'
import { IconPlus, IconSend2 } from '@tabler/icons-react'
import { GenderType, ModalFormType } from '@/types/db'
import { addNewProductSupabase } from '@/db'
import classes from './styles.module.css'
import { notifications } from '@mantine/notifications'
import { supabaseErrors } from '@/constants'

type PropsForm = {
	action: 'create' | 'update'
	product?: Omit<ProductsType, 'inventory'>
	close: () => void
}

type ValuesType = {
	name: string
	description: string
	gender: GenderType
	brand_id: string
	category_id: string
	feature: string[]
}

export const FormProduct = ({ action, product, close }: PropsForm) => {
	const [openedModal, { open: openModal, close: closeModal }] = useDisclosure(false)
	const [modalForm, setModalForm] = useState<ModalFormType>({ title: '', name: '' })
	const [featureList, setFeatureList] = useState<string[]>([])
	const [inputValue, setInputValue] = useState('')
	const categories = useShopStore.use.categories()
	const brands = useShopStore.use.brands()
	const addNewProduct = useShopStore.use.addNewProduct()
	const [subCategoriesValues, setSubCategoriesValues] = useState<{ value: string; label: string }[] | undefined>()

	const { key, getInputProps, onSubmit, setFieldValue } = useForm<ValuesType>({
		mode: 'uncontrolled',
		initialValues: {
			name: '',
			description: '',
			gender: 'Hombres',
			brand_id: '',
			category_id: '',
			feature: [],
		},

		validate: validateProduct,
	})

	const handleFeatureList = () => {
		if (!featureList.includes(inputValue) && inputValue !== '') {
			setFeatureList([inputValue, ...featureList])
			setInputValue('')
		}
	}

	useEffect(() => {
		setFieldValue(
			'feature',
			featureList.sort((a, b) => a.localeCompare(b))
		)
	}, [featureList, setFieldValue])

	return (
		<>
			<form
				onSubmit={onSubmit(async (values) => {
					try {
						if (action === 'create') {
							const res = await addNewProductSupabase(values)
							if (res?.ok) {
								addNewProduct(res.product!)
								notifications.show({
									title: 'Éxito',
									message: 'Producto agregado correctamente',
									color: 'green',
								})
								close()
							} else throw res?.error
						} else {
							console.log(values)
						}
					} catch (error: any) {
						notifications.show({
							title: 'Error',
							message: supabaseErrors[error.code] || 'Error inesperado',
							color: 'red',
						})
					}
				})}>
				<Stack w={{ base: '100%', xs: 450, md: 600, lg: 800 }}>
					{/* Name - Brand */}
					<Grid>
						<Grid.Col span={{ base: 12, xs: 6, sm: 7, md: 8 }}>
							<TextInput label='Nombre' withAsterisk key={key('name')} {...getInputProps('name')} data-autofocus />
						</Grid.Col>

						<Grid.Col span={{ base: 12, xs: 6, sm: 5, md: 4 }}>
							<Flex justify='space-between' align='flex-end' wrap='nowrap' gap={4} pos={'relative'}>
								<Select
									w={'100%'}
									withAsterisk
									checkIconPosition='right'
									searchable
									data={brands?.map((brand) => ({
										value: brand.id,
										label: brand.name,
									}))}
									label='Marca'
									key={key('brand_id')}
									{...getInputProps('brand_id')}
								/>
								<Tooltip label='Añadir nueva marca'>
									<ActionIcon
										variant='light'
										size='xs'
										pos={'absolute'}
										top={4}
										left={55}
										onClick={() => {
											setModalForm((current) => (current = { title: 'Nueva marca', name: 'brand' }))
											openModal()
										}}>
										<IconPlus stroke={1} />
									</ActionIcon>
								</Tooltip>
							</Flex>
						</Grid.Col>
					</Grid>

					{/*Gender - Category */}
					<SimpleGrid cols={{ base: 1, xs: 2 }}>
						<Select
							withAsterisk
							checkIconPosition='right'
							searchable
							data={[
								{ value: 'Hombres', label: 'Hombres' },
								{ value: 'Mujeres', label: 'Mujeres' },
								{ value: 'Niños', label: 'Niños' },
								{ value: 'Unisex', label: 'Unisex' },
							]}
							label='Género'
							key={key('gender')}
							{...getInputProps('gender')}
						/>
						<Flex justify='space-between' align='flex-end' wrap='nowrap' gap={4} pos={'relative'}>
							<Select
								w={'100%'}
								checkIconPosition='right'
								searchable
								data={categories?.map((category) => ({
									value: category.id,
									label: category.name,
								}))}
								key={key('category_id')}
								{...getInputProps('category_id')}
								label='Categoría'
							/>
							<Tooltip label='Añadir nueva categoría'>
								<ActionIcon
									variant='light'
									size='xs'
									pos={'absolute'}
									top={4}
									left={70}
									onClick={() => {
										setModalForm((current) => (current = { title: 'Nueva categoría', name: 'category' }))
										openModal()
									}}>
									<IconPlus stroke={1} />
								</ActionIcon>
							</Tooltip>
						</Flex>
					</SimpleGrid>

					{/* Description - feature */}
					<SimpleGrid cols={{ base: 1, xs: 2 }}>
						<Textarea
							w='100%'
							label='Descripción'
							minRows={9}
							maxRows={9}
							rows={9}
							key={key('description')}
							{...getInputProps('description')}
						/>
						<Stack gap={'xs'}>
							<TextInput
								label='Nueva característica'
								size='xs'
								value={inputValue}
								onChange={(e) => setInputValue(e.currentTarget.value)}
								rightSection={
									<IconSend2
										style={{ cursor: 'pointer' }}
										size={18}
										color={DEFAULT_THEME.colors.cyan[8]}
										onClick={handleFeatureList}
									/>
								}
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										e.preventDefault()
										handleFeatureList()
									}
								}}
							/>

							<Stack gap={0}>
								<Text size='xs'>Características</Text>
								<List
									size='xs'
									w={'100%'}
									h={150}
									styles={{
										root: {
											border: '1px solid gray',
											borderRadius: '0.5em',
											overflowY: 'auto',
										},
									}}>
									{featureList.map((feature) => (
										<Box key={feature} className={classes.listItem}>
											<List.Item w={'100%'}>{feature}</List.Item>
											<span
												className={classes.listItemDelete}
												onClick={() => setFeatureList(featureList.filter((f) => f !== feature))}>
												x
											</span>
										</Box>
									))}
								</List>
							</Stack>
						</Stack>
					</SimpleGrid>
					<Group justify='flex-end' m={'sm'}>
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
				{modalForm.name === 'brand' && <FormBrand close={closeModal} />}
				{modalForm.name === 'category' && <FormCategory close={closeModal} />}
			</Modal>
		</>
	)
}
