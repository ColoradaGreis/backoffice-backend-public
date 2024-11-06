const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3')
const fs = require('fs')
const path = require('path')
// Load AWS credentials and region from the config file
const configFilePath = path.resolve(global.__basepath + '/config/aws-production.json')
const config = JSON.parse(fs.readFileSync(configFilePath))
const region = 'us-east-1'

// Initialize S3 client
const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey
  }
})

module.exports = {
  uploadImage: async (bucket, filename, fileBuffer, targetFolder) => {
    try {
      const key = `${targetFolder}/${filename}`
      const params = {
        Bucket: bucket,
        Key: key,
        Body: Buffer.from(fileBuffer)
      }
      const command = new PutObjectCommand(params)
      const result = await s3Client.send(command)
      result.bucket = bucket
      result.filename = filename
      result.key = key
      return result
    } catch (error) {
      console.log('Error uploading image to S3:', error)
    }
  },
  getObjectUrl: (bucket, key) => {
    if (key.length > 0) {
      return 'https://' + bucket + '.s3.amazonaws.com/' + key
    }
  },
  deleteObject: async (bucket, key) => {
    const params = {
      Bucket: bucket,
      Key: key
    }
    const command = new DeleteObjectCommand(params)
    await s3Client.send(command)
    return true
  }

}
