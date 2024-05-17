'use client'

import { cloudinary, removeImgCloudinary } from '@/Cloudinary'
import { Text, SimpleGrid, Group, rem, Paper, Box, CloseButton, useMantineColorScheme, Image } from '@mantine/core'
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone'
import { IconUpload, IconX, IconPhoto } from '@tabler/icons-react'
import { useEffect, useMemo, useState } from 'react'
import { CldImage } from 'next-cloudinary'

type DropzoneProps = {
	images: string[]
	setImages: (images: string[]) => void
}

export const ImagesDropZone = ({ images, setImages }: DropzoneProps & {}) => {
	const { colorScheme } = useMantineColorScheme()
	const [dropImages, setDropImages] = useState<File[]>([])

	const previews = useMemo(
		() =>
			images.map((image) => (
				<Box key={image} pos={'relative'}>
					<CldImage
						width='50'
						height='50'
						src={image}
						sizes='100vw'
						alt='Description of my image'
						style={{ border: '1px solid cyan', objectFit: 'contain', padding: '2px', borderRadius: '4px' }}
					/>
					<CloseButton
						size='xs'
						pos={'absolute'}
						top={-2}
						right={-2}
						variant='transparent'
						c={'red'}
						onClick={() => {
							setImages(images.filter((el) => el !== image))
							removeImgCloudinary(image)
						}}
					/>
				</Box>
			)),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[images.length, setImages]
	)

	useEffect(() => {
		dropImages.forEach((file) => {
			const publicId = file.name.toLocaleLowerCase().substring(0, file.name.indexOf('.')).split(' ').join('_')

			const isLoaded = images.map((el) => el.substring(0, el.indexOf('['))).includes(`e-shop/products/${publicId}`)

			if (!isLoaded) {
				const formData = new FormData()
				formData.append('file', file)
				formData.append('upload_preset', 'products')
				formData.append('public_id', publicId.concat(`[${crypto.randomUUID()}]`))
				cloudinary.post('/image/upload', formData).then(({ data: { public_id } }) => {
					//@ts-ignore
					setImages((prev: string[]) => [...prev, public_id])
				})
			}
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dropImages])

	return (
		<div>
			<Dropzone
				accept={IMAGE_MIME_TYPE}
				onDrop={setDropImages}
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
				<Paper shadow='sm' mt={5} withBorder>
					<SimpleGrid mt={'xs'} mx={'xs'} cols={{ base: 4, xs: 8, sm: 10 }}>
						{previews}
					</SimpleGrid>
				</Paper>
			)}
		</div>
	)
}
