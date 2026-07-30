import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3"
import { pinata } from "../db/lb/pinata.js";
import { randomUUID } from 'crypto'
import { url } from "inspector";

export async function uploadImage(file?: File): Promise<{imageUrl: string; cid: string} | undefined> {
	if (!(file instanceof File))
		return (undefined);

	const maxSize = 1024 * 1024 * 4; // 4 MB
	if (file.size > maxSize)
		throw new Error("File size exceed 5 MB");

	const allowType = ['image/jpeg', 'image/png', 'image/webp'];
	if (!allowType.includes(file.type))
		throw new Error("File type invalid. Only jpeg, png, and webp are allowed");

	// upload file to pinata
	const upload = await pinata.upload.public.file(file);
	const imageUrl = `https://${process.env.PINATA_GATEWAY}/ipfs/${upload.cid}`;
	return ({ imageUrl: imageUrl, cid: upload.cid });
};

export async function deleteImage(imageId: string): Promise<void> {
	await pinata.files.public.delete([imageId]);
};

async function testConnection() {
	console.log(process.env.PINATA_JWT)
	try {
		const result = await pinata.files.public.list();
		console.log("Connected to Pinata successfully:", result);
	} catch (error) {
		console.error("Failed to connect to Pinata:", error);
	}
}

testConnection();