'use client';

import { supabaseErrors } from '@/constants'
import { addNewCategorySupabase } from '@/db'
import { useShopStore } from '@/store/shopStore'
import { Button, Flex, Group, Select, SelectProps, Stack, Text, TextInput, Textarea, Tooltip } from '@mantine/core'
import { isNotEmpty, useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'

type PropsForm = {
	close: () => void
}

export const FormCategory = ({ close }: PropsForm) => {
	const addNewCategory = useShopStore.use.addNewCategory()
	const categories = useShopStore.use.categories()

	const { key, getInputProps, onSubmit } = useForm({
		mode: 'uncontrolled',
		initialValues: {
			name: '',
			description: '',
			parentData: '',
		},

		validate: {
			name: isNotEmpty('El nombre de la categoría es requerido'),
		},
	})

	const renderSelectOption: SelectProps['renderOption'] = ({ option, checked }) => {
		const parent = categories.find((category) => category.name === option.label)?.parent?.join(' / ')
		return (
			<Group flex='1' gap='xs'>
				<Text fw={900} c={checked ? 'cyan.3' : 'white'}>
					{option.label}
				</Text>
				<Text size='xs' c={'gray.6'}>
					( {parent} )
				</Text>
			</Group>
		)
	}

	return (
		<form
			onSubmit={onSubmit(async (values) => {
				try {
					const { data, error } = await addNewCategorySupabase(values)
					if (data) {
						addNewCategory(data)
						notifications.show({
							title: 'Éxito',
							message: 'Categoría agregada correctamente',
							color: 'green',
						})
						close()
					} else throw error
				} catch (error: any) {
					console.log(error)
					notifications.show({
						title: 'Error',
						message: supabaseErrors[error?.code || '1'],
						color: 'red',
					})
				}
			})}>
			<Stack w={{ base: 250, xs: 450 }}>
				<TextInput label='Nombre' withAsterisk key={key('name')} {...getInputProps('name')} data-autofocus />
				<Textarea label='Descripción' key={key('description')} {...getInputProps('description')} />
				<Select
					w={'100%'}
					checkIconPosition='right'
					searchable
					data={categories?.map((category) => ({
						value: category.parent?.join(',').concat(',').concat(category.name) || '',
						label: category.name,
					}))}
					key={key('parentData')}
					{...getInputProps('parentData')}
					label='Categoría padre'
					renderOption={renderSelectOption}
				/>
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
	)
}
