import z from 'zod';
import { Router } from 'express';
import { v4 as uuidV4 } from 'uuid';
import { eq } from 'drizzle-orm';
import { jobsTable } from '../db/schema.js';
import { publishMessage } from '@repo/rabbitmq';
import db from '../db/config.js';
import { generateGetSignedUrl } from '@repo/aws';

const router = Router();

router.post('/', async (req, res) => {
  const parsedBody = z.object({ filekey: z.string() }).parse(req.body);

  const message = {
    jobId: uuidV4(),
    markdownFilekey: parsedBody.filekey,
  };
  publishMessage(Buffer.from(JSON.stringify(message)));

  await db.insert(jobsTable).values({
    jobId: message.jobId,
    markdownFilekey: message.markdownFilekey,
  });

  res.status(202).json({ jobId: message.jobId });
});

router.get('/status/:jobId', async (req, res) => {
  const result = await db.select().from(jobsTable).where(eq(jobsTable.jobId, req.params.jobId));

  if (!result[0]) {
    return res.status(404).json({ message: 'Job Not Found' });
  }

  if (result[0].pdfFilekey) {
    const url = await generateGetSignedUrl(result[0].pdfFilekey);
    res.status(200).json({ status: result[0].status, url: url });
  } else {
    res.status(200).json({ status: result[0].status });
  }
});

router.patch('/status/:jobId', async (req, res) => {
  const parsedBody = z
    .object({
      status: z.enum(['PENDING', 'COMPLETED', 'FAILED']),
      filekey: z.string().optional(),
    })
    .parse(req.body);

  await db
    .update(jobsTable)
    .set({ status: parsedBody.status, pdfFilekey: parsedBody.filekey })
    .where(eq(jobsTable.jobId, req.params.jobId));

  res.sendStatus(201);
});

export default router;
