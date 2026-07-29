import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3"
import { s3, BUCKET_NAME } from "../db/s3/s3.js"
import { randomUUID } from 'crypto'
import { url } from "inspector";

export async function uploadImage(file?: File): Promise<string | undefined> {
	if (!(file instanceof File))
		return (undefined);

	const maxSize = 1024 * 1024 * 5; // 5 MB
	if (file.size > maxSize)
		throw new Error("File size exceed 5 MB");

	const allowType = ['image/jpeg', 'image/png', 'image/webp'];
	if (!allowType.includes(file.type))
		throw new Error("File type invalid. Only jpeg, png, and webp are allowed");

	// upload file to S3 bucket
	const buffer = Buffer.from(await file.arrayBuffer());
	const key = `uploads/${randomUUID()}-${file.name}`;

	await s3.send(
		new PutObjectCommand({
			Bucket: BUCKET_NAME,
			Key: key,
			Body: buffer,
			ContentType: file.type,
		})
	);
	const imageUrl = `http://${BUCKET_NAME}.s3.${process.env.AWS_REGION}/${key}`;

	return (imageUrl);
};

export async function deleteImage(imageUrl: string) {
	const url = new URL(imageUrl);
	const key = url.pathname.slice(1);

	await s3.send(
		new DeleteObjectCommand({
			Bucket: BUCKET_NAME,
			Key: key,
		})
	);
};