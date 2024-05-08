'use client'

import { useShopStore } from '@/store/shopStore'
import { Button, Group, Select, Stack, TextInput, Textarea, Tooltip } from '@mantine/core'
import { isNotEmpty, useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { supabaseErrors } from '@/constants'
import { notifications } from '@mantine/notifications'
import { addNewSizeSupabase } from '@/db'
import { GenderType } from '@/types/db'

type ValuesType = {
	name: string
	gender: GenderType
	size_guide: string
}

type PropsForm = {
	close: () => void
}

export const FormNewSize = ({ close }: PropsForm) => {
	const [openedCategory, { open, close: closeCategory }] = useDisclosure(false)

	const categories = useShopStore.use.categories()
	const addNewSize = useShopStore.use.addNewSize()

	const { key, getInputProps, onSubmit } = useForm<ValuesType>({
		mode: 'uncontrolled',
		initialValues: {
			name: '',
			gender: 'Hombres',
			size_guide: '',
		},

		validate: {
			name: isNotEmpty('El nombre de la marca es requerido'),
			gender: isNotEmpty('El género es requerido'),
		},
	})

	return (
		<form
			onSubmit={onSubmit(async (size) => {
				try {
					const res = await addNewSizeSupabase(size)

					if (res?.ok) {
						addNewSize({ id: res?.id!, ...size })
						notifications.show({
							title: 'Éxito',
							message: 'Talle agregado correctamente',
							color: 'green',
						})
						close()
					} else throw res?.error
				} catch (error: any) {
					notifications.show({
						title: 'Error',
						message: supabaseErrors[error.code] || 'Ocurrió un error inesperado',
						color: 'red',
					})
				}
			})}>
			<Stack w={{ base: 250, xs: 450 }}>
				<TextInput label='Nombre' withAsterisk key={key('name')} {...getInputProps('name')} data-autofocus />
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
				<Textarea label='Guía de Talle' key={key('size_guide')} {...getInputProps('size_guide')} />
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
