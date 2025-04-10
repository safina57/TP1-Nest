import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileUploadService {
  async saveImage(file: Express.Multer.File): Promise<string> {
    const uploadsDir = path.join(__dirname, '../../public/uploads');
    
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, file.originalname);

    fs.writeFileSync(filePath, file.buffer);
    return filePath;
  }
}
