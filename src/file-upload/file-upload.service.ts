import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { FileUpload } from 'graphql-upload/processRequest.mjs';

@Injectable()
export class FileUploadService {
  async saveImage(file: FileUpload): Promise<string> {
    const { createReadStream, filename } = file;

    const uploadDir = `${process.cwd()}/public/uploads`;
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const uniqueName = `${Date.now()}-${filename}`;
    const path = `${uploadDir}/${uniqueName}`;

    const stream = createReadStream();
    const writeStream = fs.createWriteStream(path);

    await new Promise((resolve, reject) => {
      stream.pipe(writeStream);
      stream.on('end', resolve);
      stream.on('error', (error) => {
        writeStream.close();
        reject(error);
      });
    });

    return path;
  }
}
