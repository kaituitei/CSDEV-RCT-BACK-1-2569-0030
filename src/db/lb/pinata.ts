import { PinataSDK } from 'pinata'
// import { config } from "dotenv";

// config({ path: '.env.local' })

export const pinata = new PinataSDK({
	pinataJwt: process.env.PINATA_JWT!,
	pinataGateway: process.env.PINATA_GATEWAY!,
});

export const BUCKET_NAME = process.env.PINATA_BUCKET_NAME!;
