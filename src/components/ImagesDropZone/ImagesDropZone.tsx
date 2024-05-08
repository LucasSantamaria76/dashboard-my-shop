'use client'

import { cloudinary } from '@/Cloudinary'
import { Text, SimpleGrid, Group, rem, Paper, Box, CloseButton, useMantineColorScheme, Image } from '@mantine/core'
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone'
import { IconUpload, IconX, IconPhoto } from '@tabler/icons-react'
import { useEffect, useState } from 'react'

type DropzoneProps = {
	images: string[]
	setImages: (images: string[]) => void
	id: string
}

export const ImagesDropZone = ({ images, setImages, id }: DropzoneProps & {}) => {
	const { colorScheme } = useMantineColorScheme()
	const [dropImages, setDropImages] = useState<File[]>([])

	const previews = dropImages.map((file) => {
		const imageUrl = URL.createObjectURL(file)
		return (
			<Box key={imageUrl} pos={'relative'}>
				<Image
					radius='sm'
					styles={{
						root: { border: '1px solid blue' },
					}}
					alt='Preview'
					h={50}
					w='auto'
					fit='contain'
					src={imageUrl}
					onLoad={() => URL.revokeObjectURL(imageUrl)}
				/>
				<CloseButton
					size='xs'
					pos={'absolute'}
					top={-2}
					right={-2}
					variant='transparent'
					c={'red'}
					onClick={() => setDropImages(dropImages.filter((image) => image !== file))}
				/>
			</Box>
		)
	})

	useEffect(() => {
		setImages([])
		dropImages.forEach((file) => {
			const publicId = `${file.name
				.toLocaleLowerCase()
				.substring(0, file.name.indexOf('.'))
				.split(' ')
				.join('_')}_${id}`
			const formData = new FormData()
			formData.append('file', file)
			formData.append('upload_preset', 'products')
			formData.append('public_id', publicId)
			cloudinary
				.post('/image/upload', formData)
				//@ts-ignore
				.then(({ data: { public_id } }) => setImages((prev: string[]) => [...prev, public_id]))
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dropImages])

	const onDrop = (files: File[]) => {
		const imagesNotLoaded = files.filter((file) => !dropImages.some((image) => image.name === file.name))
		setDropImages([...dropImages, ...imagesNotLoaded])
	}

	return (
		<div>
			<Dropzone
				accept={IMAGE_MIME_TYPE}
				onDrop={onDrop}
				onReject={(files) => console.log('rejected files', files)}
				maxSize={5 * 1024 ** 2}
				py={5}
				styles={{
					root: { borderRadius: 5, backgroundColor: colorScheme === 'dark' ? '#3f3f46' : '#e5e7eb' },
				}}>
				<Group justify='center' mih={100} style={{ pointerEvents: 'none' }} pb={5}>
					<Dropzone.Accept>
						<IconUpload
							style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }}
							stroke={1.5}
						/>
					</Dropzone.Accept>
					<Dropzone.Reject>
						<IconX style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }} stroke={1.5} />
					</Dropzone.Reject>
					<Dropzone.Idle>
						<IconPhoto style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }} stroke={1.5} />
					</Dropzone.Idle>

					<div>
						<Text size='lg' inline>
							Arrastre las imágenes aquí o haga clic para seleccionar archivos
						</Text>
						<Text size='xs' c='dimmed' inline mt={3}>
							Adjunte tantos archivos como desee, cada archivo no debe exceder los 5 MB
						</Text>
					</div>
				</Group>
			</Dropzone>

			{!!previews.length && (
				<Paper shadow='sm' p='sm' mt={5} withBorder>
					<SimpleGrid cols={{ base: 4, xs: 8, sm: 10 }}>{previews}</SimpleGrid>
				</Paper>
			)}
		</div>
	)
}
