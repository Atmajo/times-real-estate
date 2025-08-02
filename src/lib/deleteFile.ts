import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

export const deleteFile = async (fileUrl: string) => {
  try {
    const s3Client = new S3Client({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRET_KEY!,
      },
    });

    const url = new URL(fileUrl);
    const s3Key = url.pathname.substring(1);

    // Create S3 DeleteObjectCommand
    const deleteParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: s3Key,
    };

    await s3Client.send(new DeleteObjectCommand(deleteParams));

    return {
      success: true,
      message: `File ${s3Key} deleted successfully`,
    };
  } catch (error) {
    throw error;
  }
};
