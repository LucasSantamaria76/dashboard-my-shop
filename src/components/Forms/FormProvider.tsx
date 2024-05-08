'use client'

import { supabaseErrors } from '@/constants'
import { addNewProviderSupabase } from '@/db'
import { useShopStore } from '@/store/shopStore'
import { Button, Flex, Group, Stack, TextInput } from '@mantine/core'
import { isNotEmpty, useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'

type PropsForm = {
	close: () => void
}

export const FormProvider = ({ close }: PropsForm) => {
	const addNewProvider = useShopStore.use.addNewProvider()
	const { key, getInputProps, onSubmit } = useForm({
		mode: 'uncontrolled',
		initialValues: {
			name: '',
			address: '',
			city: '',
			phone: '',
			province: '',
		},

		validate: {
			name: isNotEmpty('El nombre de la marca es requerido'),
		},
	})

	return (
		<>
			<form
				onSubmit={onSubmit(async (values) => {
					try {
						const res = await addNewProviderSupabase(values)
						if (res?.ok) {
							addNewProvider({ id: res?.id!, ...values })
							notifications.show({
								title: 'Éxito',
								message: 'Proveedor agregado correctamente',
								color: 'green',
							})
							close()
						} else throw res?.error
					} catch (error: any) {
						console.log(error)
						notifications.show({
							title: 'Error',
							message: supabaseErrors[error.code] || 'Error inesperado',
							color: 'red',
						})
					}
				})}>
				<Stack w={{ base: 250, xs: 450 }}>
					<TextInput label='Nombre' withAsterisk key={key('name')} {...getInputProps('name')} data-autofocus />
					<Flex justify='space-between' align='flex-end' wrap='nowrap' gap={4}>
						<TextInput label='Dirección' key={key('address')} {...getInputProps('address')} />
						<TextInput label='Teléfono' key={key('phone')} {...getInputProps('phone')} />
					</Flex>
					<Flex justify='space-between' align='flex-end' wrap='nowrap' gap={4}>
						<TextInput label='Ciudad' key={key('city')} {...getInputProps('city')} />
						<TextInput label='Provincia' key={key('province')} {...getInputProps('province')} />
					</Flex>

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
		</>
	)
}
