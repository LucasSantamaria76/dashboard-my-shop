import axios from 'axios'

const baseURL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}`

export const cloudinary = axios.create({
  baseURL
})
