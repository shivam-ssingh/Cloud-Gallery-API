const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
require("dotenv").config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function generateUploadUrl(key) {
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
  });

  return await getSignedUrl(s3, command, { expiresIn: 3600 }); // 1 hour
}

async function generateViewUrl(key) {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
  });

  return await getSignedUrl(s3, command, { expiresIn: 3600 }); // 1 hour view link
}

module.exports = { s3, generateUploadUrl, generateViewUrl };
