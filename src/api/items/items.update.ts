import { Hono } from "hono";
import { authCheck } from "../../middleware/authCheck.js";
import { z } from 'zod'
import { ERR_PARMS } from "../../constants.js";
import { getImageById, updateNotice } from "../../services/notice.services.js";
import { uploadImage } from "../../services/image.services.js";
import { zValidator } from "@hono/zod-validator";
import { notice } from "../../db/schema/notice.js";
import { deleteImage } from "../../services/image.services.js";

const updateItem = new Hono();

const updateScheme = z.object({
	title: z.string().min(1, ERR_PARMS.NULL_TITLE),
	type: z.enum(['LOST', 'FOUND'], ERR_PARMS.NULL_TYPE),
	description: z.string().min(1, ERR_PARMS.NULL_DESC),
	location: z.string().min(1, ERR_PARMS.NULL_LOC),
	evenDate: z.string().min(1, ERR_PARMS.NULL_DATE),
	image: z.instanceof(File),
}).partial();

updateItem.patch('/:id', authCheck, zValidator('form', updateScheme), async (c) => {
	try {
		const body = c.req.valid('form');
		const id = c.req.param('id');
		const image = await uploadImage(body.image);
		
		const updateData = Object.fromEntries(
			Object.entries(body).filter(([, value]) => value !== undefined)
		) as Partial<typeof notice.$inferInsert>; // strip out undefined value

		// Delete old image if it exit
		if (image !== undefined)
		{
			const oldImage = await getImageById(id);
			if (oldImage?.imageId)
				await deleteImage(oldImage.imageId);
			updateData.imageUrl = image.imageUrl;
			updateData.imageId = image.cid;
		}

		return (c.json({updateRow: await updateNotice(id, updateData)}, 200));
	}
	catch (error) {
		console.error("Notice creation error:", error);

		const errorMessage = error instanceof Error ? error.message : "Failed to create notice";
		return c.json({ success: false, message: errorMessage }, 400);
	}
});

export default (updateItem);