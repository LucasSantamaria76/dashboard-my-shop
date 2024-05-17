'use server'

import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
	cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
	api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
	api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
})

export const renameImgCloudinary = async (from_public_id: string, a_public_id: string) => {
	try {
		const { public_id } = await cloudinary.uploader.rename(from_public_id, a_public_id)

		return { public_id, error: null }
	} catch (error) {
		console.log({ error })
		return { error, public_id: null }
	}
}
