import 'dotenv/config';

import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import assert from 'assert';

import s3Client from './config.js';

export * from './config.js';

export async function generatePutSignedUrl() {
	assert.ok(process.env.S3_BUCKET_NAME);

	const command = new PutObjectCommand({
		Bucket: process.env.S3_BUCKET_NAME,
		Key: `user-uploads/${Date.now()}.md`,
	});

	return {
		url: await getSignedUrl(s3Client, command),
		filekey: command.input.Key,
	};
}

export async function generateGetSignedUrl(filekey: string) {
	assert.ok(process.env.S3_BUCKET_NAME);

	const command = new GetObjectCommand({
		Bucket: process.env.S3_BUCKET_NAME,
		Key: filekey,
	});

	// Read permissions expires within 4 hours.
	return await getSignedUrl(s3Client, command, { expiresIn: 14400 });
}

export async function getObjectAccessUrl(filekey: string) {
	const command = new GetObjectCommand({
		Bucket: process.env.S3_BUCKET_NAME,
		Key: filekey,
	});

	// Access permission will get revoked after passing 1 hour from assignment.
	return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
}

export async function streamUploadToS3(stream: ReadableStream) {
	const filekey = `generated-pdfs/${Date.now()}.pdf`;
	const upload = new Upload({
		client: s3Client,
		params: {
			Bucket: process.env.S3_BUCKET_NAME,
			Key: filekey,
			Body: stream,
		},
	});

	// Upload large file through stream.
	await upload.done();
	return filekey;
}
