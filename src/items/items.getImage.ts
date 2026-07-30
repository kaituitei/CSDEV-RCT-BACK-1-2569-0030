import { Hono } from "hono";
import { itemExit, getImageById } from "../services/notice.services.js";

const getImage = new Hono();

getImage.get('/:id/image', async (c) => {
	const id = c.req.param('id');

	if (!itemExit(id))
		return (c.json({ error: `This item ID is not exit`}, 201));

	const imageUrl = await getImageById(id);
	if (imageUrl)
		return (c.json({ image_url: imageUrl }, 200));
	return (c.json({ error: "This post didn't have an image"}, 201))
});

export default (getImage);