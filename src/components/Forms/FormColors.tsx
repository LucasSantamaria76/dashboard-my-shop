'use client'

import { useShopStore } from '@/store/shopStore'
import { isNotEmpty, useForm } from '@mantine/form'
import { supabaseErrors } from '@/constants'
import { Button, ColorInput, DEFAULT_THEME, Group, Stack, TextInput } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { addNewColorSupabase } from '@/db'

const initialValues = {
	name: '',
	color: '#fff',
}

type FormProps = {
	close: () => void
}

export const FormColors = ({ close }: FormProps) => {
	const addNewColor = useShopStore.use.addNewColor()

	const { key, getInputProps, onSubmit } = useForm<typeof initialValues>({
		mode: 'uncontrolled',
		initialValues: {
			...initialValues,
		},
		validate: {
			name: isNotEmpty('El nombre del color es requerido'),
			color: isNotEmpty('El color es requerido'),
		},
	})

	return (
		<form
			onSubmit={onSubmit(async (color) => {
				try {
					const res = await addNewColorSupabase(color)

					if (res?.ok) {
						addNewColor({ id: res?.id!, ...color })
						notifications.show({
							title: 'Éxito',
							message: 'Color agregado correctamente',
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
			<Stack w={{ base: '80vw', xs: 400 }}>
				<TextInput data-autofocus label='Nombre del color' withAsterisk key={key('name')} {...getInputProps('name')} />
				<ColorInput
					closeOnColorSwatchClick
					styles={{ dropdown: { overflowY: 'auto', maxHeight: '400px' } }}
					withAsterisk
					label='Elija el color'
					swatchesPerRow={10}
					swatches={[
						...DEFAULT_THEME.colors.pink,
						...DEFAULT_THEME.colors.red,
						...DEFAULT_THEME.colors.orange,
						...DEFAULT_THEME.colors.yellow,
						...DEFAULT_THEME.colors.lime,
						...DEFAULT_THEME.colors.green,
						...DEFAULT_THEME.colors.teal,
						...DEFAULT_THEME.colors.cyan,
						...DEFAULT_THEME.colors.blue,
						...DEFAULT_THEME.colors.indigo,
						...DEFAULT_THEME.colors.violet,
						...DEFAULT_THEME.colors.grape,
						...DEFAULT_THEME.colors.gray,
						...DEFAULT_THEME.colors.dark,
					]}
				/>
			</Stack>
			<Group justify='flex-end' m='sm'>
				<Button variant='default' onClick={close}>
					Cancelar
				</Button>
				<Button variant='light' color='green' type='submit'>
					Guardar
				</Button>
			</Group>
		</form>
	)
}
