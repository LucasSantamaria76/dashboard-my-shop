/* import { sha1 } from "crypto-hash";
import { cloudinary } from "./cloudinary-api";
 */
export const removeImgCloudinary = async (url) => {
  //const publicId = url?.substring(url.indexOf('e-commers'), url.lastIndexOf('.'))

  try {
    /*     const timestamp = new Date().getTime();
    const string = `public_id=${publicId}&timestamp=${timestamp}${process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET}`;
    const signature = await sha1(string);
    const removeImg = new FormData();
    removeImg.append("public_id", publicId);
    removeImg.append("signature", signature);
    removeImg.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY);
    removeImg.append("timestamp", timestamp);
    await cloudinary.post("/image/destroy", removeImg); */
  } catch (error) {
    console.log({ error });
  }
};
