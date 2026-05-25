import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Controller('upload')
export class UploadController {
  constructor(private readonly configService: ConfigService) {
    // Configure Cloudinary on init
    const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');
    
    console.log('Initializing Cloudinary with:', { cloudName, apiKey, apiSecret: apiSecret ? '***' : undefined });
    
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      // Use memory storage — files are streamed directly to Cloudinary, never written to disk
      storage: memoryStorage(),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp|svg\+xml)$/)) {
          return callback(
            new BadRequestException('Only image files (jpg, jpeg, png, gif, webp, svg) are allowed!'),
            false,
          );
        }
        callback(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    try {
      console.log('Received file for upload:', {
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        hasBuffer: !!file.buffer,
        bufferLength: file.buffer ? file.buffer.length : 0,
      });

      // Stream the buffer directly to Cloudinary
      const result = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: 'portfolio',
              resource_type: 'image',
              transformation: [
                { quality: 'auto', fetch_format: 'auto' }, // Auto-optimize format & quality
              ],
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            },
          )
          .end(file.buffer);
      });

      return {
        url: result.secure_url,        // Permanent, CDN-backed HTTPS URL
        publicId: result.public_id,    // Cloudinary public ID (for future deletion/transformations)
        width: result.width,
        height: result.height,
        format: result.format,
      };
    } catch (error: any) {
      console.error('Cloudinary Upload Error Details:', error);
      throw new InternalServerErrorException(
        `Failed to upload image to Cloudinary: ${error?.message || JSON.stringify(error)}`,
      );
    }
  }
}
