import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CvService } from './cv.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { GetCvQueryDto } from './dto/get-cv-query.dto';
import { FileUploadService } from '../file-upload/file-upload.service';
import { ImageValidationPipe } from '../file-upload/pipes/image_validation.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';
import { GenericService } from 'src/common/services/generic.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from '@prisma/client';

@Controller('cv')
export class CvController {
  constructor(
    private readonly cvService: CvService,
    private readonly fileUploadService: FileUploadService,
    private readonly genericService: GenericService,
  ) {}

  @Get('all')
  @UseGuards(JWTAuthGuard)
  getAllCvs(@Query() query: PaginationQueryDto) {
    return this.genericService.getAll('cv', {
      skip: query.skip,
      take: query.take,
    });
  }

  @Get()
  @UseGuards(JWTAuthGuard)
  getCV(@Query() query: GetCvQueryDto) {
    return this.cvService.findByQuery(query);
  }

  @Get(':id')
  @UseGuards(JWTAuthGuard)
  getCVById(@Param('id') id: string) {
    return this.cvService.findOne(id);
  }

  @Post()
  @UseGuards(JWTAuthGuard)
  createCV(@Body() createCvDto: CreateCvDto, @GetUser() user: User) {
    console.log('User ID:', user.id); // Log the user ID for debugging
    return this.cvService.create(createCvDto, user.id);
  }

  @Put(':id')
  @UseGuards(JWTAuthGuard)
  updateCV(
    @Param('id') id: string,
    @Body() updateCvDto: UpdateCvDto,
    @GetUser() user: User,
  ) {
    return this.cvService.update(id, updateCvDto, user.id);
  }

  @Delete(':id')
  @UseGuards(JWTAuthGuard)
  deleteCV(@Param('id') id: string, @GetUser() user: User) {
    return this.cvService.remove(id, user.id);
  }

  // TODO @safina57 UseGuards(JwtAuthGuard) Guards are commented out for now
  @Post('upload-image')
  @UseGuards(JWTAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File upload',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadImage(
    @UploadedFile(new ImageValidationPipe()) file: Express.Multer.File,
  ) {
    const savedImagePath = await this.fileUploadService.saveImage(file);
    return { message: 'Image uploaded successfully', path: savedImagePath };
  }
}
