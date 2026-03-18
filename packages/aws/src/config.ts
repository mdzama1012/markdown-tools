import 'dotenv/config';

import assert from 'assert';
import { S3Client } from '@aws-sdk/client-s3';

class S3ClientSingleton {
  private static instance: S3Client;

  private constructor() {}

  static getInstance(): S3Client {
    if (S3ClientSingleton.instance) {
      return S3ClientSingleton.instance;
    }

    assert.ok(process.env.AWS_REGION, 'ENV variables not found');
    assert.ok(process.env.AWS_ACCESS_KEY, 'ENV variables not found');
    assert.ok(process.env.AWS_SECRET_ACCESS_KEY, 'ENV variables not found');

    S3ClientSingleton.instance = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    return S3ClientSingleton.instance;
  }
}

export default S3ClientSingleton.getInstance();
