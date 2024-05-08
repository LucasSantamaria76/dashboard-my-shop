'use client'

import { useShopStore } from '@/store/shopStore'
import { addNewBrandSupabase } from '@/db/addNewBrandSupabase'
import { ActionIcon, Button, Flex, Group, Select, Stack, TextInput, Tooltip } from '@mantine/core'
import { isNotEmpty, useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { FormProvider } from './FormProvider'
import { Modal } from '../modals'
import { IconPlus } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { supabaseErrors } from '@/constants'

type PropsForm = {
	close: () => void
}

export const FormBrand = ({ close }: PropsForm) => {
	const [openedProvider, { open: openProvider, close: closeProvider }] = useDisclosure(false)

	const providers = useShopStore.use.providers()
	const addNewBrand = useShopStore.use.addNewBrand()

	const { key, getInputProps, onSubmit } = useForm({
		mode: 'uncontrolled',
		initialValues: {
			name: '',
			provider_id: '',
		},

		validate: {
			name: isNotEmpty('El nombre de la marca es requerido'),
			provider_id: isNotEmpty('El proveedor es requerido'),
		},
	})

	return (
		<>
			<form
				onSubmit={onSubmit(async ({ name, provider_id }) => {
					try {
						const res = await addNewBrandSupabase(name, provider_id)
						if (res?.ok) {
							addNewBrand({ id: res?.id!, name, provider_id })
							notifications.show({
								title: 'Éxito',
								message: 'Marca agregada correctamente',
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
					<Flex justify='space-between' align='flex-end' wrap='nowrap' gap={4} pos={'relative'}>
						<Select
							w={'100%'}
							withAsterisk
							checkIconPosition='right'
							searchable
							data={providers?.map((item) => ({ value: item.id, label: item.name }))}
							label='Proveedor'
							key={key('provider_id')}
							{...getInputProps('provider_id')}
						/>
						<Tooltip label='Añadir nuevo proveedor'>
							<ActionIcon variant='light' size='xs' pos={'absolute'} top={4} left={80} onClick={openProvider}>
								<IconPlus stroke={1} />
							</ActionIcon>
						</Tooltip>
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
			<Modal opened={openedProvider} close={closeProvider} title={'Nuevo proveedor'}>
				<FormProvider close={closeProvider} />
			</Modal>
		</>
	)
}
