import { Injectable } from '@nestjs/common';
import { CreateCvInput } from './dto/create-cv.input';
import { UpdateCvInput } from './dto/update-cv.input';

@Injectable()
export class CvsService {
  create(createCvInput: CreateCvInput) {
    return 'This action adds a new cv';
  }

  findAll() {
    return `This action returns all cvs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cv`;
  }

  update(id: number, updateCvInput: UpdateCvInput) {
    return `This action updates a #${id} cv`;
  }

  remove(id: number) {
    return `This action removes a #${id} cv`;
  }
}
