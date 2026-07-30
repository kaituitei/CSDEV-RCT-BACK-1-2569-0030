import { Hono } from "hono";
import { itemExit, getImageById } from "../../services/notice.services.js";

const getImage = new Hono();

getImage.get('/:id/image', async (c) => {
	const id = c.req.param('id');

	if (!itemExit(id))
		return (c.json({ error: `This item ID is not exit`}, 201));

	const imageUrl = await getImageById(id);
	if (imageUrl !== null)
		return (c.json({ image_url: imageUrl }, 200));
	return (c.json({ error: "Image not found"}, 201))
});

export default (getImage);