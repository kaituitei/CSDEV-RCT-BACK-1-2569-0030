import { S3Client } from "@aws-sdk/client-s3";
// import { config } from "dotenv";

// config({ path: '.env.local' })

export const s3 = new S3Client({
	region: process.env.REGION!,
	endpoint: process.env.S3_ENDPOINT!,
	forcePathStyle: true,
	credentials: {
		accessKeyId: process.env.S3_ACCESS_KEY_ID!,
		secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
	},
});

export const BUCKET_NAME = process.env.S3_BUCKET_NAME!;