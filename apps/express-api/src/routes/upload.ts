import { Router } from 'express';

import { generatePutSignedUrl } from '@repo/utils/aws';

const router = Router();

router.get('/pre-signed', async (_, res) => {
	const result = await generatePutSignedUrl();
	res.status(200).json(result);
});

export default router;
